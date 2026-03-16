import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds and get starter credits to begin your bidding journey.",
    icon: "👤",
  },
  {
    step: "02",
    title: "Browse Auctions",
    description: "Explore live auctions across multiple categories with real-time bid tracking.",
    icon: "🔍",
  },
  {
    step: "03",
    title: "Place Your Bid",
    description: "Use your credits to place bids. Outbid? Your credits are automatically returned.",
    icon: "🎯",
  },
  {
    step: "04",
    title: "Win & Celebrate",
    description: "Watch the gamified winner reveal with confetti and share your victory!",
    icon: "🏆",
  },
];

export const Auction = () => {
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
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Four steps to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              winning
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-white rounded-2xl border border-gray-200/80 p-7 text-center hover:shadow-lg hover:shadow-indigo-100/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-2xl mb-4">
                {item.icon}
              </div>
              <div className="absolute top-4 right-4 text-xs font-bold text-indigo-200">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
