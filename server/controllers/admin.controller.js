import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import CreditLedger from "../models/creditLedger.model.js";
import bcrypt from "bcrypt";
import { getIO } from "../socket/index.js";

// Get all auctions for admin
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Product.find({})
      .populate("seller", "name email")
      .populate("winner", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ auctions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Declare winner for an auction
export const declareAuctionWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Product.findById(id).populate("bids.bidder", "name credits");
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    if (auction.winner) return res.status(400).json({ error: "Winner already declared" });
    if (auction.bids.length === 0) return res.status(400).json({ error: "No bids placed" });

    const sortedBids = [...auction.bids].sort((a, b) => b.bidAmount - a.bidAmount);
    const highestBid = sortedBids[0];
    const winnerId = highestBid.bidder._id || highestBid.bidder;

    auction.winner = winnerId;
    auction.isSold = true;
    await auction.save();

    // Credit settlement: return credits to all non-winning bidders
    // Each bidder's latest (highest) bid was deducted. We return it.
    const processed = new Set();
    for (const bid of sortedBids) {
      const bidderId = (bid.bidder._id || bid.bidder).toString();
      if (bidderId === winnerId.toString()) continue; // winner keeps deduction
      if (processed.has(bidderId)) continue;
      processed.add(bidderId);

      // Find the bidder's highest bid (their last deduction)
      const bidderHighest = sortedBids.find(
        (b) => (b.bidder._id || b.bidder).toString() === bidderId
      );
      if (bidderHighest) {
        await User.findByIdAndUpdate(bidderId, {
          $inc: { credits: bidderHighest.bidAmount },
        });
        await CreditLedger.create({
          userId: bidderId,
          type: "returned",
          amount: bidderHighest.bidAmount,
          auctionId: id,
          reason: "Credits returned — auction lost",
        });
      }
    }

    // Log winner's permanent deduction (type "won" to distinguish from the original bid deduction)
    await CreditLedger.create({
      userId: winnerId,
      type: "won",
      amount: highestBid.bidAmount,
      auctionId: id,
      reason: "Winning bid — credits permanently deducted",
    });

    // Broadcast auction close event
    try {
      const io = getIO();
      io.to(id).emit("auction:closed", { auctionId: id, winnerId: winnerId.toString(), winnerName: highestBid.bidder.name });
    } catch (e) { /* socket not ready */ }

    res.status(200).json({ success: true, auction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit auction (admin only)
export const editAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const auction = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.status(200).json({ success: true, auction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete auction (admin only)
export const deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Product.findByIdAndDelete(id);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Assign credits to a user (admin only)
export const assignCredits = async (req, res) => {
  try {
    const { userId, credits, reason } = req.body;
    if (!userId || typeof credits !== "number" || credits <= 0) {
      return res.status(400).json({ error: "userId and positive credits amount required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.credits += credits;
    await user.save();

    // Log to credit ledger
    await CreditLedger.create({
      userId,
      type: "assigned",
      amount: credits,
      reason: reason || "Credits assigned by admin",
    });

    // Emit real-time notification
    try {
      const io = getIO();
      io.to(`user:${userId}`).emit("credits:updated", { userId, credits: user.credits });
    } catch (e) { /* socket not ready */ }

    res.status(200).json({ success: true, message: `${credits} credits assigned`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    // Get statistics
    const totalAuctions = await Product.countDocuments();
    const activeAuctions = await Product.countDocuments({
      itemEndDate: { $gt: new Date() },
    });
    const totalUsers = await User.countDocuments();
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Get recent active auctions for display
    const recentActiveAuctions = await Product.find({
      itemEndDate: { $gt: new Date() },
    })
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent users for display
    const recentUsersList = await User.find({})
      .select("name email role createdAt lastLogin location avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      stats: {
        activeAuctions,
        totalAuctions,
        totalUsers,
        recentUsers,
      },
      recentAuctions: recentActiveAuctions,
      recentUsersList: recentUsersList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admin dashboard data",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";

    // Whitelist sortable fields to prevent sorting by sensitive fields like password
    const allowedSortFields = [
      "createdAt",
      "name",
      "email",
      "role",
      "lastLogin",
    ];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build search query — escape regex special chars to prevent ReDoS
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchQuery = escapedSearch
      ? {
          $or: [
            { name: { $regex: escapedSearch, $options: "i" } },
            { email: { $regex: escapedSearch, $options: "i" } },
          ],
        }
      : {};

    // Apply role filter if provided
    const roleFilter = role && ["user", "admin"].includes(role) ? { role } : {};

    const query = { ...searchQuery, ...roleFilter };

    // Get total count for pagination info
    const totalUsers = await User.countDocuments(query);

    // Get users with pagination, search, and sorting
    const users = await User.find(query)
      .select("name email role credits createdAt signupAt lastLogin location avatar")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Toggle user status (active/suspended)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot suspend admin users" });
    }

    user.status = user.status === "active" ? "suspended" : "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.status === "active" ? "activated" : "suspended"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset user password (admin sets a temporary password)
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
