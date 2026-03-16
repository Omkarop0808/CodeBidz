import Product from "../models/product.model.js";

/**
 * Generates AI-powered recommendations for a user.
 * Currently falls back to trending-based recommendations.
 * Structured so an AI provider can be plugged in later.
 */
const getAIRecommendations = async (userBids, openAuctions) => {
  // Check if any AI API key is configured
  const hasAI =
    process.env.GEMINI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.ANTHROPIC_API_KEY;

  if (hasAI) {
    // TODO: Integrate with AI provider when ready.
    // The prompt would include the user's recent bid categories and amounts,
    // and the list of open auctions, asking the model to rank and explain
    // which auctions best match the user's interests.
    //
    // For now, fall through to the trending fallback below.
  }

  return null; // Signal to use fallback
};

/**
 * Trending fallback: top 6 auctions by bid count in the last 30 minutes.
 */
const getTrendingRecommendations = async (openAuctions, excludeAuctionIds) => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const trending = await Product.aggregate([
    {
      $match: {
        itemEndDate: { $gt: new Date() },
        _id: { $nin: excludeAuctionIds },
      },
    },
    { $unwind: "$bids" },
    { $match: { "bids.bidTime": { $gte: thirtyMinutesAgo } } },
    {
      $group: {
        _id: "$_id",
        itemName: { $first: "$itemName" },
        itemDescription: { $first: "$itemDescription" },
        itemCategory: { $first: "$itemCategory" },
        itemPhoto: { $first: "$itemPhoto" },
        currentPrice: { $first: "$currentPrice" },
        itemEndDate: { $first: "$itemEndDate" },
        seller: { $first: "$seller" },
        recentBidCount: { $sum: 1 },
      },
    },
    { $sort: { recentBidCount: -1 } },
    { $limit: 6 },
  ]);

  return trending.map((auction) => ({
    auction: {
      _id: auction._id,
      itemName: auction.itemName,
      itemDescription: auction.itemDescription,
      itemCategory: auction.itemCategory,
      itemPhoto: auction.itemPhoto,
      currentPrice: auction.currentPrice,
      itemEndDate: auction.itemEndDate,
      seller: auction.seller,
      recentBidCount: auction.recentBidCount,
    },
    reason: "Popular right now",
  }));
};

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user's recent bids (last 20 bids they placed)
    const userBidAuctions = await Product.find({ "bids.bidder": userId })
      .sort({ "bids.bidTime": -1 })
      .limit(20)
      .select("_id itemName itemCategory bids currentPrice");

    // Collect auction IDs the user already bid on
    const biddedAuctionIds = userBidAuctions.map((a) => a._id);

    // Find open auctions the user hasn't bid on yet
    const openAuctions = await Product.find({
      itemEndDate: { $gt: new Date() },
      _id: { $nin: biddedAuctionIds },
    })
      .select(
        "itemName itemDescription itemCategory itemPhoto currentPrice itemEndDate seller bids",
      )
      .sort({ createdAt: -1 })
      .limit(50);

    // Try AI-based recommendations first
    const aiResults = await getAIRecommendations(userBidAuctions, openAuctions);

    if (aiResults) {
      return res.status(200).json({ recommendations: aiResults });
    }

    // Fallback to trending recommendations
    const recommendations = await getTrendingRecommendations(
      openAuctions,
      biddedAuctionIds,
    );

    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};
