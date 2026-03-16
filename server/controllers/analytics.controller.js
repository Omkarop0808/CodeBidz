import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import CreditLedger from "../models/creditLedger.model.js";

export const getBidActivity = async (req, res) => {
  try {
    const { period = "day", startDate, endDate } = req.query;

    const periodFormats = {
      hour: { format: "%Y-%m-%dT%H:00", unit: "hour" },
      day: { format: "%Y-%m-%d", unit: "day" },
      week: { format: "%Y-W%V", unit: "week" },
    };

    const selected = periodFormats[period] || periodFormats.day;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage["bids.bidTime"] = {};
      if (startDate) matchStage["bids.bidTime"].$gte = new Date(startDate);
      if (endDate) matchStage["bids.bidTime"].$lte = new Date(endDate);
    }

    const pipeline = [
      { $unwind: "$bids" },
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: {
            $dateToString: {
              format: selected.format,
              date: "$bids.bidTime",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const results = await Product.aggregate(pipeline);

    const labels = results.map((r) => r._id);
    const data = results.map((r) => r.count);

    res.status(200).json({ labels, data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bid activity", error: error.message });
  }
};

export const getTopAuctions = async (req, res) => {
  try {
    const auctions = await Product.aggregate([
      {
        $project: {
          itemName: 1,
          currentPrice: 1,
          winner: 1,
          bidsCount: { $size: "$bids" },
        },
      },
      { $sort: { bidsCount: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({ auctions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top auctions", error: error.message });
  }
};

export const getCreditFlow = async (req, res) => {
  try {
    const results = await CreditLedger.aggregate([
      {
        $group: {
          _id: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const monthsSet = new Set();
    const dataByType = { assigned: {}, deducted: {}, returned: {}, won: {} };

    for (const entry of results) {
      const month = entry._id.month;
      const type = entry._id.type;
      monthsSet.add(month);
      if (dataByType[type]) {
        dataByType[type][month] = entry.total;
      }
    }

    const months = Array.from(monthsSet).sort();
    const assigned = months.map((m) => dataByType.assigned[m] || 0);
    const deducted = months.map((m) => dataByType.deducted[m] || 0);
    const returned = months.map((m) => dataByType.returned[m] || 0);
    const won = months.map((m) => dataByType.won[m] || 0);

    res.status(200).json({ months, assigned, deducted, returned, won });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching credit flow", error: error.message });
  }
};

export const getCategoryPerformance = async (req, res) => {
  try {
    const results = await Product.aggregate([
      {
        $group: {
          _id: "$itemCategory",
          bidsCount: { $sum: { $size: "$bids" } },
          auctionCount: { $sum: 1 },
        },
      },
      { $sort: { bidsCount: -1 } },
    ]);

    const categories = results.map((r) => ({
      name: r._id,
      bidsCount: r.bidsCount,
      auctionCount: r.auctionCount,
    }));

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category performance",
      error: error.message,
    });
  }
};

export const getTopBidders = async (req, res) => {
  try {
    const results = await Product.aggregate([
      { $unwind: "$bids" },
      {
        $group: {
          _id: "$bids.bidder",
          totalBids: { $sum: 1 },
          totalSpent: { $sum: "$bids.bidAmount" },
        },
      },
      { $sort: { totalBids: -1 } },
      { $limit: 10 },
    ]);

    // Count auctions won per bidder
    const wonCounts = await Product.aggregate([
      { $match: { winner: { $ne: null } } },
      {
        $group: {
          _id: "$winner",
          auctionsWon: { $sum: 1 },
        },
      },
    ]);

    const wonMap = new Map();
    for (const entry of wonCounts) {
      wonMap.set(entry._id.toString(), entry.auctionsWon);
    }

    // Populate user names
    const userIds = results.map((r) => r._id);
    const users = await User.find({ _id: { $in: userIds } }).select("name");
    const userMap = new Map();
    for (const user of users) {
      userMap.set(user._id.toString(), user.name);
    }

    const bidders = results.map((r) => ({
      userId: r._id,
      name: userMap.get(r._id.toString()) || "Unknown",
      totalBids: r.totalBids,
      totalSpent: r.totalSpent,
      auctionsWon: wonMap.get(r._id.toString()) || 0,
    }));

    res.status(200).json({ bidders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top bidders", error: error.message });
  }
};

export const getAuditLog = async (req, res) => {
  try {
    // Placeholder — audit log persistence not yet built
    res.status(200).json({ logs: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching audit log", error: error.message });
  }
};
