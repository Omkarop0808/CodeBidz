import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = ({ bids = [], currentUserId, activeUsers = [] }) => {
  // Get unique bidders with their highest bid
  const bidderMap = new Map();
  bids.forEach((bid) => {
    const bidderId = bid.bidder?._id || bid.bidder;
    const bidderName = bid.bidder?.name || "Anonymous";
    if (!bidderMap.has(bidderId) || bidderMap.get(bidderId).amount < bid.bidAmount) {
      bidderMap.set(bidderId, {
        id: bidderId,
        name: bidderName,
        amount: bid.bidAmount,
        time: bid.bidTime,
      });
    }
  });

  const allSorted = Array.from(bidderMap.values())
    .sort((a, b) => b.amount - a.amount);

  const top5 = allSorted.slice(0, 5);

  // If current user is not in top 5, find their position and add them
  const currentUserInTop5 = top5.some((b) => b.id === currentUserId);
  const currentUserEntry = allSorted.find((b) => b.id === currentUserId);
  const currentUserRank = currentUserEntry
    ? allSorted.findIndex((b) => b.id === currentUserId) + 1
    : null;

  const maskName = (name, id) => {
    if (id === currentUserId) return name;
    if (!name || name.length <= 2) return name || "???";
    return name[0] + "***" + name[name.length - 1];
  };

  const rankColors = [
    "from-amber-400 to-yellow-500",
    "from-gray-300 to-gray-400",
    "from-orange-400 to-amber-500",
    "from-indigo-300 to-indigo-400",
    "from-slate-300 to-slate-400",
  ];

  const rankIcons = ["🥇", "🥈", "🥉"];

  if (allSorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Leaderboard</h3>
        <p className="text-sm text-gray-400 text-center py-4">No bids yet — be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3h14l-1.5 4H6.5L5 3zm0 4h14v2H5V7zm2 4h10v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z" />
          </svg>
          Leaderboard
        </h3>
        {activeUsers.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            {activeUsers.length} watching
          </span>
        )}
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {top5.map((bidder, index) => {
            const isCurrentUser = bidder.id === currentUserId;
            return (
              <motion.div
                key={bidder.id}
                layout
                layoutId={`leaderboard-${bidder.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isCurrentUser
                    ? "bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200"
                    : index === 0
                    ? "bg-amber-50/60"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Rank */}
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColors[index] || rankColors[4]} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {index < 3 ? rankIcons[index] : index + 1}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-indigo-700" : "text-gray-800"}`}>
                    {maskName(bidder.name, bidder.id)}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-[10px] font-semibold uppercase text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded">
                        You
                      </span>
                    )}
                    {index === 0 && (
                      <span className="ml-1.5 text-[10px] font-semibold uppercase text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                        Leading
                      </span>
                    )}
                  </p>
                </div>

                {/* Amount */}
                <span className="text-sm font-bold text-gray-700 tabular-nums shrink-0">
                  Rs {bidder.amount}
                </span>
              </motion.div>
            );
          })}

          {/* Show current user outside top 5 */}
          {!currentUserInTop5 && currentUserEntry && (
            <>
              <div className="text-center text-xs text-gray-400 py-1">• • •</div>
              <motion.div
                key={currentUserEntry.id}
                layout
                layoutId={`leaderboard-${currentUserEntry.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {currentUserRank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-indigo-700">
                    {currentUserEntry.name}
                    <span className="ml-1.5 text-[10px] font-semibold uppercase text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded">
                      You
                    </span>
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-700 tabular-nums shrink-0">
                  Rs {currentUserEntry.amount}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
