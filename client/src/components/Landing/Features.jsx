import { motion } from "framer-motion";

const features = [
  {
    icon: "⚡",
    title: "Real‑Time Bidding",
    description: "Instant bid updates via WebSocket. See every bid the moment it happens with live leaderboard and countdown timers.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: "🛡️",
    title: "Credit System",
    description: "Transparent credit ledger with full audit trail. Credits deducted on bid, returned on outbid, settled on auction close.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🏆",
    title: "Winner Reveal",
    description: "Gamified winner announcement with 3-2-1 countdown, confetti effects, and animated trophy reveal sequence.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description: "Real-time notifications for outbids, auction endings, and credit updates. Never miss an opportunity.",
    gradient: "from-sky-500 to-blue-500",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Admin analytics with KPI cards, category breakdowns, bid velocity tracking, and conversion rate monitoring.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: "🔐",
    title: "Secure Platform",
    description: "JWT authentication with HTTP-only cookies, role-based access control, and encrypted data transmission.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              win big
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            A feature-rich auction platform built for speed, transparency, and the thrill of competition.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white rounded-2xl border border-gray-200/80 p-7 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
