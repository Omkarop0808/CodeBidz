import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import CreditLedger from "../models/creditLedger.model.js";
import { createNotification } from "../services/notificationService.js";

// Track users in auction rooms: { auctionId: Map<socketId, { userId, userName }> }
const auctionRooms = new Map();

export const registerAuctionHandlers = (io, socket) => {
  // Use verified identity from socket auth middleware
  const userId = socket.user.id;
  const userName = socket.user.name;

  // Join user-specific room for targeted notifications
  socket.join(`user:${userId}`);

  // Join auction room
  socket.on("auction:join", ({ auctionId }) => {
    if (!auctionId) return;

    socket.join(auctionId);

    if (!auctionRooms.has(auctionId)) {
      auctionRooms.set(auctionId, new Map());
    }

    const room = auctionRooms.get(auctionId);
    room.set(socket.id, { userId, userName });

    // Broadcast to all users in room
    io.to(auctionId).emit("auction:userJoined", {
      userName,
      userId,
      activeUsers: getActiveUsers(auctionId),
    });

    console.log(`${userName} joined auction: ${auctionId}`);
  });

  // Leave auction room
  socket.on("auction:leave", ({ auctionId }) => {
    handleLeaveAuction(io, socket, auctionId);
  });

  // Place bid via socket — uses authenticated userId, not client-supplied
  // Includes full credit system logic (deduct, refund outbid, ledger, notifications)
  socket.on("auction:bid", async ({ auctionId, bidAmount }) => {
    try {
      if (!auctionId || bidAmount == null) return;

      // Coerce to number to prevent string comparison bugs
      const amount = Number(bidAmount);
      if (isNaN(amount)) {
        socket.emit("auction:error", { message: "Invalid bid amount" });
        return;
      }

      const product = await Product.findById(auctionId);
      if (!product) {
        socket.emit("auction:error", { message: "Auction not found" });
        return;
      }

      if (new Date(product.itemEndDate) < new Date()) {
        socket.emit("auction:error", {
          message: "Auction has already ended",
        });
        return;
      }

      // Prevent seller from bidding on own auction
      if (product.seller.toString() === userId) {
        socket.emit("auction:error", {
          message: "You cannot bid on your own auction",
        });
        return;
      }

      const minBid = Math.max(product.currentPrice, product.startingPrice) + 1;
      const maxBid = Math.max(product.currentPrice, product.startingPrice) + 10;

      if (amount < minBid) {
        socket.emit("auction:error", {
          message: `Bid must be at least Rs ${minBid}`,
        });
        return;
      }

      if (amount > maxBid) {
        socket.emit("auction:error", {
          message: `Bid must be at max Rs ${maxBid}`,
        });
        return;
      }

      // Check and deduct credits from bidder
      const bidder = await User.findById(userId);
      if (!bidder) {
        socket.emit("auction:error", { message: "Bidder not found" });
        return;
      }
      if (bidder.credits < amount) {
        socket.emit("auction:error", { message: "Insufficient credits to place bid" });
        return;
      }

      bidder.credits -= amount;
      await bidder.save();

      // Log credit deduction
      await CreditLedger.create({
        userId,
        type: "deducted",
        amount,
        auctionId,
        reason: "Bid placed",
      });

      // Find previous highest bidder to return their credits
      let previousHighestBidderId = null;
      let previousHighestBidAmount = 0;
      if (product.bids.length > 0) {
        const sortedBids = [...product.bids].sort((a, b) => b.bidAmount - a.bidAmount);
        const prevHighest = sortedBids[0];
        if (prevHighest.bidder.toString() !== userId) {
          previousHighestBidderId = prevHighest.bidder.toString();
          previousHighestBidAmount = prevHighest.bidAmount;
        }
      }

      // Use findOneAndUpdate with price condition to prevent race conditions
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: auctionId,
          currentPrice: product.currentPrice, // Only update if price hasn't changed
          itemEndDate: { $gt: new Date() },
        },
        {
          $set: { currentPrice: amount },
          $push: {
            bids: {
              bidder: userId,
              bidAmount: amount,
            },
          },
        },
        { new: true },
      )
        .populate("seller", "name")
        .populate("bids.bidder", "name");

      if (!updatedProduct) {
        // Refund credits if bid failed (race condition)
        bidder.credits += amount;
        await bidder.save();
        await CreditLedger.findOneAndDelete({
          userId,
          auctionId,
          amount,
          type: "deducted",
        }).sort({ createdAt: -1 });

        socket.emit("auction:error", {
          message: "Bid failed — price changed. Please try again.",
        });
        return;
      }

      // Return credits to previous highest bidder (outbid)
      if (previousHighestBidderId) {
        await User.findByIdAndUpdate(previousHighestBidderId, {
          $inc: { credits: previousHighestBidAmount },
        });
        await CreditLedger.create({
          userId: previousHighestBidderId,
          type: "returned",
          amount: previousHighestBidAmount,
          auctionId,
          reason: "Outbid — credits returned",
        });

        // Create persistent notification for outbid user
        try {
          await createNotification({
            userId: previousHighestBidderId,
            type: "outbid",
            message: `You were outbid on "${product.itemName}". Rs ${previousHighestBidAmount} credits returned.`,
            auctionId,
          });
        } catch (e) { /* notification creation failed, non-critical */ }

        // Targeted notification to previous highest bidder
        io.to(`user:${previousHighestBidderId}`).emit("notification:outbid", {
          userId: previousHighestBidderId,
          auctionId,
          auctionName: product.itemName,
          newBidAmount: amount,
          returnedCredits: previousHighestBidAmount,
        });
      }

      updatedProduct.bids.sort(
        (a, b) => new Date(b.bidTime) - new Date(a.bidTime),
      );

      // Broadcast updated auction data to all users in the room
      io.to(auctionId).emit("auction:bidPlaced", {
        auction: updatedProduct,
        bidderName: userName,
        bidderId: userId,
        bidAmount: amount,
        message: `${userName} placed a bid of Rs ${amount}`,
      });
    } catch (error) {
      console.error("Socket bid error:", error.message);
      socket.emit("auction:error", {
        message: "Error placing bid",
      });
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    cleanupSocket(io, socket);
  });
};

const handleLeaveAuction = (io, socket, auctionId) => {
  if (!auctionId || !auctionRooms.has(auctionId)) return;

  const room = auctionRooms.get(auctionId);
  const userData = room.get(socket.id);

  if (userData) {
    room.delete(socket.id);

    // Remove empty rooms
    if (room.size === 0) {
      auctionRooms.delete(auctionId);
    }

    socket.leave(auctionId);

    io.to(auctionId).emit("auction:userLeft", {
      userName: userData.userName,
      userId: userData.userId,
      activeUsers: getActiveUsers(auctionId),
    });

    console.log(`${userData.userName} left auction: ${auctionId}`);
  }
};

const cleanupSocket = (io, socket) => {
  for (const [auctionId, room] of auctionRooms.entries()) {
    if (room.has(socket.id)) {
      handleLeaveAuction(io, socket, auctionId);
    }
  }
};

const getActiveUsers = (auctionId) => {
  const room = auctionRooms.get(auctionId);
  if (!room) return [];

  const users = [];
  const seen = new Set();

  for (const { userId, userName } of room.values()) {
    if (!seen.has(userId)) {
      seen.add(userId);
      users.push({ userId, userName });
    }
  }

  return users;
};
