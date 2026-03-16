import { Link } from "react-router";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-[85vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-300 font-medium">Live Auctions Happening Now</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Bid. Win.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Celebrate.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg"
            >
              The next‑generation auction platform where every bid counts. Real‑time bidding, transparent credits, and gamified winner reveals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/signup"
                className="bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-500 active:scale-[0.97] transition-all shadow-lg shadow-indigo-600/30 text-sm"
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="text-white/70 font-medium px-6 py-3.5 rounded-xl hover:text-white hover:bg-white/10 transition-all text-sm"
              >
                Learn More →
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {["bg-indigo-500", "bg-violet-500", "bg-rose-500", "bg-amber-500"].map((color, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${color} border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">500+ Active Bidders</p>
                <p className="text-xs text-slate-500">Join our growing community</p>
              </div>
            </motion.div>
          </div>

          {/* Right — Floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 rounded-3xl blur opacity-30" />

              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
                {/* Mock auction card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Vintage Art Collection</p>
                      <p className="text-xs text-slate-500">Ends in 2h 15m</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                    Live
                  </span>
                </div>

                {/* Price */}
                <div className="bg-slate-800/50 rounded-2xl p-5">
                  <p className="text-xs text-slate-500 mb-1">Current Bid</p>
                  <p className="text-3xl font-bold text-white tabular-nums">Rs 15,200</p>
                  <p className="text-xs text-slate-500 mt-1">Started at Rs 5,000</p>
                </div>

                {/* Bid activity */}
                <div className="space-y-2">
                  {[
                    { name: "A***r", amount: "15,200", leading: true },
                    { name: "P***a", amount: "14,800", leading: false },
                    { name: "R***n", amount: "13,500", leading: false },
                  ].map((bid, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${bid.leading ? "bg-indigo-500/10 border border-indigo-500/20" : ""}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${bid.leading ? "bg-indigo-500" : "bg-slate-700"} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {bid.name[0]}
                        </div>
                        <span className="text-sm text-slate-300">{bid.name}</span>
                        {bid.leading && <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Leading</span>}
                      </div>
                      <span className="text-sm font-semibold text-white tabular-nums">Rs {bid.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Mock bid input */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500">
                    Rs 15,201
                  </div>
                  <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm">
                    Bid Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
