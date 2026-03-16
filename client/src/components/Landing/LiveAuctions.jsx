import { motion } from "framer-motion";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/api";

const LiveAuctionCard = ({ auction, index }) => {
  const timeRemaining = () => {
    const end = new Date(auction.itemEndDate);
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${mins}m`;
  };

  const isActive = new Date(auction.itemEndDate) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-lg hover:shadow-indigo-100/40 transition-all duration-300"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {auction.itemImage ? (
          <img
            src={auction.itemImage}
            alt={auction.itemName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🖼️</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live
            </span>
          ) : (
            <span className="bg-gray-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Ended
            </span>
          )}
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {timeRemaining()}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {auction.itemName}
        </h3>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {auction.category || "General"}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Current Bid
            </p>
            <p className="text-lg font-bold text-gray-900 tabular-nums">
              Rs {auction.currentPrice || auction.startingPrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Bids
            </p>
            <p className="text-sm font-semibold text-gray-600">
              {auction.bids?.length || 0}
            </p>
          </div>
        </div>
        <Link
          to={`/auction/${auction._id}`}
          className="mt-4 block text-center text-xs font-semibold bg-indigo-50 text-indigo-600 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          {isActive ? "Place Bid" : "View Result"}
        </Link>
      </div>
    </motion.div>
  );
};

export const LiveAuctions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["landing-auctions"],
    queryFn: async () => {
      const res = await api.get("/product?limit=6&sort=-createdAt");
      return res.data;
    },
    staleTime: 30000,
  });

  const auctions = data?.products || data?.data || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
              Live Auctions
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Happening now
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!auctions.length) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
            Live Auctions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Happening{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              right now
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Jump into the action. Browse live auctions and place your bids in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.slice(0, 6).map((auction, i) => (
            <LiveAuctionCard key={auction._id} auction={auction} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/auction"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all auctions
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
