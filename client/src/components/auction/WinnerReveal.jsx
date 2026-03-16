import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WinnerReveal = ({ winner, runnerUp, currentPrice, currentUserId, bids = [], onClose }) => {
  const [phase, setPhase] = useState(0); // 0=countdown, 1=vs-battle, 2=winner-burst, 3=final-leaderboard
  const [count, setCount] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  const isWinner = winner?._id === currentUserId;

  // Derive runner-up from bids if not passed directly
  const derivedRunnerUp = runnerUp || (() => {
    if (!bids || bids.length < 2) return null;
    const bidderMap = new Map();
    bids.forEach((bid) => {
      const bidderId = bid.bidder?._id || bid.bidder;
      const bidderName = bid.bidder?.name || "Anonymous";
      if (!bidderMap.has(bidderId) || bidderMap.get(bidderId).amount < bid.bidAmount) {
        bidderMap.set(bidderId, { id: bidderId, name: bidderName, amount: bid.bidAmount });
      }
    });
    const sorted = Array.from(bidderMap.values()).sort((a, b) => b.amount - a.amount);
    return sorted.length >= 2 ? { _id: sorted[1].id, name: sorted[1].name, amount: sorted[1].amount } : null;
  })();

  // Phase 0: Countdown 3-2-1
  useEffect(() => {
    if (phase !== 0) return;
    if (count <= 0) {
      setPhase(derivedRunnerUp ? 1 : 2);
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(timer);
  }, [count, phase, derivedRunnerUp]);

  // Phase 1: VS battle — auto-advance after 3 seconds
  useEffect(() => {
    if (phase !== 1) return;
    const timer = setTimeout(() => {
      setPhase(2);
      setShowConfetti(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2: Winner declaration — auto-advance after 4 seconds
  useEffect(() => {
    if (phase !== 2) return;
    setShowConfetti(true);
    const timer = setTimeout(() => setPhase(3), 4000);
    return () => clearTimeout(timer);
  }, [phase]);

  const skip = useCallback(() => {
    setPhase(3);
    setShowConfetti(true);
  }, []);

  const confettiColors = [
    "#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981",
    "#3b82f6", "#ef4444", "#8b5cf6",
  ];

  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  // Build final leaderboard from bids
  const finalLeaderboard = (() => {
    const bidderMap = new Map();
    (bids || []).forEach((bid) => {
      const bidderId = bid.bidder?._id || bid.bidder;
      const bidderName = bid.bidder?.name || "Anonymous";
      if (!bidderMap.has(bidderId) || bidderMap.get(bidderId).amount < bid.bidAmount) {
        bidderMap.set(bidderId, { id: bidderId, name: bidderName, amount: bid.bidAmount });
      }
    });
    return Array.from(bidderMap.values()).sort((a, b) => b.amount - a.amount);
  })();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && phase === 3 && onClose?.()}
      >
        {/* Skip button — always visible except on final phase */}
        {phase < 3 && (
          <button
            onClick={skip}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-sm font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition z-50"
          >
            Skip →
          </button>
        )}

        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "50vw", y: "40vh", opacity: 1, scale: 0 }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  ease: "easeOut",
                  delay: Math.random() * 0.3,
                }}
                style={{
                  position: "absolute",
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  backgroundColor: confettiColors[i % confettiColors.length],
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Phase 0: Countdown */}
          {phase === 0 && (
            <motion.div
              key={`count-${count}`}
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-8xl sm:text-9xl font-black text-white drop-shadow-2xl"
            >
              {count || "🏆"}
            </motion.div>
          )}

          {/* Phase 1: VS Card Battle */}
          {phase === 1 && derivedRunnerUp && (
            <motion.div
              key="vs-battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full max-w-2xl px-4"
            >
              {/* #1 Card */}
              <motion.div
                initial={{ x: "-100vw", rotate: -10 }}
                animate={{ x: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-6 shadow-2xl w-full sm:w-64 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {getInitial(winner?.name)}
                </div>
                <p className="text-white font-bold text-lg">{winner?.name || "Winner"}</p>
                <p className="text-white/80 text-sm mt-1">Rs {currentPrice}</p>
                <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-white/60 text-xs mt-2 font-semibold uppercase tracking-wider">#1</p>
              </motion.div>

              {/* VS Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}
                className="shrink-0"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                >
                  <span className="text-white font-black text-xl">VS</span>
                </motion.div>
              </motion.div>

              {/* #2 Card */}
              <motion.div
                initial={{ x: "100vw", rotate: 10 }}
                animate={{ x: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 shadow-2xl w-full sm:w-64 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {getInitial(derivedRunnerUp.name)}
                </div>
                <p className="text-white font-bold text-lg">{derivedRunnerUp.name}</p>
                <p className="text-white/80 text-sm mt-1">Rs {derivedRunnerUp.amount}</p>
                <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((derivedRunnerUp.amount / currentPrice) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-white/60 text-xs mt-2 font-semibold uppercase tracking-wider">#2</p>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Winner Declaration Burst */}
          {phase === 2 && (
            <motion.div
              key="winner-burst"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-7xl sm:text-8xl mb-4"
              >
                🏆
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xl sm:text-2xl font-bold px-8 py-3 rounded-full shadow-lg shadow-amber-500/30 inline-block"
              >
                {winner?.name || "Winner"} wins!
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/80 text-lg mt-3"
              >
                Winning bid: Rs {currentPrice}
              </motion.p>
            </motion.div>
          )}

          {/* Phase 3: Final Leaderboard */}
          {phase === 3 && (
            <motion.div
              key="final-leaderboard"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-center">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Auction Winner</p>
                <h2 className="text-2xl font-bold text-white">{winner?.name || "Winner"}</h2>
                <p className="text-white/90 mt-1">Winning bid: Rs {currentPrice}</p>
                {isWinner && (
                  <div className="mt-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full inline-block">
                    🎉 That's you!
                  </div>
                )}
              </div>

              <div className="p-5 max-h-64 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Final Rankings</h4>
                <div className="space-y-2">
                  {finalLeaderboard.map((bidder, index) => {
                    const isMe = bidder.id === currentUserId;
                    const isTopBidder = bidder.id === (winner?._id || "");
                    return (
                      <div
                        key={bidder.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl ${
                          isMe ? "bg-indigo-50 border border-indigo-100" :
                          isTopBidder ? "bg-amber-50" : ""
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                        </span>
                        <span className={`text-sm font-medium flex-1 ${isMe ? "text-indigo-700" : "text-gray-800"}`}>
                          {bidder.name}
                          {isMe && <span className="ml-1 text-[10px] text-indigo-500 font-semibold">(You)</span>}
                        </span>
                        <span className="text-sm font-bold text-gray-600 tabular-nums">Rs {bidder.amount}</span>
                        {isTopBidder && (
                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">WON</span>
                        )}
                        {!isTopBidder && (
                          <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">RETURNED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={onClose}
                  className="w-full bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default WinnerReveal;
