import User from "../models/user.model.js";
import CreditLedger from "../models/creditLedger.model.js";

export const getCreditBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("credits");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ credits: user.credits });
  } catch (error) {
    res.status(500).json({ error: "Error fetching credit balance" });
  }
};

export const getCreditHistory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    const total = await CreditLedger.countDocuments(filter);

    const history = await CreditLedger.find(filter)
      .populate("auctionId", "itemName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formatted = history.map((entry) => ({
      _id: entry._id,
      type: entry.type,
      amount: entry.amount,
      auctionName: entry.auctionId?.itemName || null,
      auctionId: entry.auctionId?._id || null,
      reason: entry.reason,
      createdAt: entry.createdAt,
    }));

    res.status(200).json({
      history: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching credit history" });
  }
};
