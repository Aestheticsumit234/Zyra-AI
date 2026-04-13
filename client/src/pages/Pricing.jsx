import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiCheck, HiOutlineSparkles } from "react-icons/hi";

const pricingPlans = [
  {
    name: "Associate",
    price: "0",
    desc: "For career baseline testing.",
    features: [
      "2 AI Interviews / month",
      "Standard Skill Mapping",
      "Automated Feedback",
    ],
    button: "Access Free",
    premium: false,
  },
  {
    name: "Professional",
    price: "24",
    desc: "Precision tools for active candidates.",
    features: [
      "Unlimited Simulations",
      "Voice Tonality Metrics",
      "Smart Career Synthesis",
      "Priority Support",
    ],
    button: "Upgrade to Pro",
    premium: true,
  },
  {
    name: "Executive",
    price: "89",
    desc: "Tailored for leadership and elite roles.",
    features: [
      "Everything in Pro",
      "System Design Modules",
      "Executive Presence Score",
      "Concierge Support",
    ],
    button: "Contact Sales",
    premium: false,
  },
];

const Pricing = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#070707] px-6 py-20 text-white selection:bg-amber-400/20 selection:text-amber-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_22%),radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_18%),linear-gradient(180deg,#090909_0%,#060606_50%,#040404_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-white/3 px-4 py-2 backdrop-blur-xl"
          >
            <HiOutlineSparkles className="text-sm text-amber-300" />
            <span className="text-[10px] uppercase tracking-[0.32em] text-amber-100/80">
              Premium Pricing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="mt-8 text-4xl font-light leading-tight tracking-tight text-white md:text-6xl"
          >
            Choose the tier that matches
            <span className="block bg-linear-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text italic text-transparent">
              your ambition.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-400"
          >
            Refined interview practice for students, professionals, and
            high-stakes candidates who want a more confident edge.
          </motion.p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-4xl border p-7 md:p-8 backdrop-blur-2xl transition-all duration-500 ${
                plan.premium
                  ? "border-amber-300/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_24px_80px_rgba(245,158,11,0.12)]"
                  : "border-white/10 bg-white/3 hover:border-white/20"
              }`}
            >
              {plan.premium && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_32%)]" />
                  <div className="absolute right-6 top-6 rounded-full border border-amber-200/20 bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                    Most Popular
                  </div>
                </>
              )}

              <div className="relative">
                <div className="mb-8">
                  <p className="text-sm font-medium tracking-wide text-white/95">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-8 flex items-end gap-2 border-b border-white/10 pb-8">
                  <span className="text-5xl font-light tracking-tight text-white">
                    ${plan.price}
                  </span>
                  <span className="pb-1 text-sm text-neutral-500">/month</span>
                </div>

                <div className="mb-10 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                          plan.premium
                            ? "bg-amber-300/15 text-amber-300"
                            : "bg-white/5 text-neutral-300"
                        }`}
                      >
                        <HiCheck className="text-xs" />
                      </div>
                      <span className="text-sm leading-6 text-neutral-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full rounded-2xl px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
                    plan.premium
                      ? "bg-linear-to-r from-amber-200 via-amber-300 to-yellow-500 text-black hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(245,158,11,0.22)]"
                      : "border border-white/10 bg-white/4 text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {plan.button}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-5">
          <p className="text-center text-[10px] uppercase tracking-[0.32em] text-neutral-600">
            Enterprise and team billing available on request
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/3 text-neutral-400 transition-all duration-300 hover:border-amber-200/20 hover:text-white"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/3 text-neutral-400 transition-all duration-300 hover:border-amber-200/20 hover:text-white"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
