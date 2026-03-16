import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Aisha Patel",
    role: "Art Collector",
    avatar: "A",
    color: "bg-violet-500",
    quote:
      "The real-time bidding is incredibly smooth. I won a rare painting and the winner reveal with confetti made it feel like a real celebration!",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    role: "Frequent Bidder",
    avatar: "R",
    color: "bg-indigo-500",
    quote:
      "Love the credit system — being refunded instantly when outbid gives me confidence to keep bidding. Best auction platform I've used.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Antique Dealer",
    avatar: "P",
    color: "bg-rose-500",
    quote:
      "As a seller, the analytics dashboard helps me understand bidding patterns. The gamified experience keeps bidders engaged throughout.",
    rating: 5,
  },
  {
    name: "Karan Singh",
    role: "Tech Enthusiast",
    avatar: "K",
    color: "bg-amber-500",
    quote:
      "Smart notifications mean I never miss an auction ending. The VS battle reveal is genuinely exciting — it's auction meets entertainment.",
    rating: 4,
  },
];

export const Testimonials = () => {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((p) => (p + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Loved by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              bidders
            </span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[220px]">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={false}
                animate={{
                  opacity: i === active ? 1 : 0,
                  y: i === active ? 0 : 20,
                  scale: i === active ? 1 : 0.95,
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{ pointerEvents: i === active ? "auto" : "none" }}
              >
                <div className="bg-gray-50 rounded-3xl border border-gray-200/80 p-8 sm:p-10 text-center">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span
                        key={s}
                        className={`text-lg ${s < t.rating ? "text-amber-400" : "text-gray-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white`}
                    >
                      {t.avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "bg-indigo-600 w-7"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
