import { Link } from "react-router";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    credits: "100",
    price: "Free",
    description: "Get started with your first auctions",
    features: [
      "100 starter credits on signup",
      "Browse all live auctions",
      "Real-time bid notifications",
      "Basic leaderboard access",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Bidder Pro",
    credits: "500",
    price: "Contact Admin",
    description: "For serious bidders who want more action",
    features: [
      "500 credits assigned by admin",
      "Priority notification alerts",
      "Full analytics dashboard",
      "Winner reveal replays",
      "AI-powered recommendations",
    ],
    cta: "Request Credits",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Seller",
    credits: "Unlimited",
    price: "Free",
    description: "List your items and start selling",
    features: [
      "Create unlimited auctions",
      "Real-time bid tracking",
      "Seller analytics dashboard",
      "Winner declaration tools",
      "Credit settlement reports",
    ],
    cta: "Start Selling",
    href: "/signup",
    highlight: false,
  },
];

export const Pricing = () => {
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
            Credit Plans
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Choose your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              plan
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Credits are your bidding currency. Get started for free and request more from your admin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                tier.highlight
                  ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200/50 scale-[1.03]"
                  : "bg-white border border-gray-200/80 hover:shadow-lg hover:shadow-indigo-100/30"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-lg font-bold ${tier.highlight ? "text-white" : "text-gray-900"}`}
              >
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={`text-3xl font-extrabold ${tier.highlight ? "text-white" : "text-gray-900"}`}
                >
                  {tier.credits}
                </span>
                <span
                  className={`text-sm ${tier.highlight ? "text-white/70" : "text-gray-500"}`}
                >
                  credits
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${tier.highlight ? "text-white/60" : "text-gray-400"}`}
              >
                {tier.price}
              </p>
              <p
                className={`text-sm mt-3 ${tier.highlight ? "text-white/80" : "text-gray-500"}`}
              >
                {tier.description}
              </p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-0.5 shrink-0 ${tier.highlight ? "text-emerald-300" : "text-emerald-500"}`}
                    >
                      ✓
                    </span>
                    <span className={tier.highlight ? "text-white/90" : "text-gray-600"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.href}
                className={`mt-8 block text-center text-sm font-semibold py-3 rounded-xl transition-all active:scale-[0.97] ${
                  tier.highlight
                    ? "bg-white text-indigo-700 hover:bg-gray-100 shadow-sm"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-200/50"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
