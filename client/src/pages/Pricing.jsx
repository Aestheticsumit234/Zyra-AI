import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiCheck, HiOutlineSparkles } from "react-icons/hi";

const pricingPlans = [
  {
    name: "Associate",
    price: "0",
    desc: "For career baseline testing.",
    features: [
      "2 AI Interviews / mo",
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
    desc: "Tailored for leadership & elite roles.",
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
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-6 font-sans antialiased selection:bg-amber-500/30">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6"
          >
            <HiOutlineSparkles className="text-amber-400 text-xs" />
            <span className="text-amber-200/80 text-[10px] font-bold tracking-[0.2em] uppercase">
              Flexible Tiers
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
            Optimized for your{" "}
            <span className="italic text-amber-200/90 font-serif">
              next move.
            </span>
          </h1>
          <p className="text-neutral-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
            Scalable intelligence solutions for individual growth and
            high-performance teams.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative flex flex-col p-7 rounded-4xl border transition-all duration-500 ${
                plan.premium
                  ? "bg-neutral-900/40 border-amber-500/40 shadow-[0_20px_40px_-15px_rgba(251,191,36,0.1)]"
                  : "bg-neutral-900/10 border-white/6 hover:border-white/15"
              }`}
            >
              {plan.premium && (
                <div className="absolute -top-3 right-8 px-3 py-1 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20">
                  <p className="text-[10px] font-bold text-black uppercase tracking-tighter">
                    Most Selected
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white text-lg font-medium tracking-tight mb-1">
                  {plan.name}
                </h3>
                <p className="text-neutral-500 text-xs font-light leading-snug">
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-white tracking-tighter">
                    ${plan.price}
                  </span>
                  <span className="text-neutral-600 text-sm">/mo</span>
                </div>
              </div>

              <div className="space-y-3.5 mb-10 grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <HiCheck
                      className={`mt-0.5 text-sm ${plan.premium ? "text-amber-400" : "text-neutral-600"}`}
                    />
                    <span className="text-neutral-400 text-xs font-light tracking-wide">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
                  plan.premium
                    ? "bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10"
                    : "bg-white/3 text-white border border-white/8 hover:bg-white/8"
                }`}
              >
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-neutral-700 text-[10px] uppercase tracking-[0.3em]">
            Enterprise custom billing available upon request
          </p>
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <FaGithub
              size={20}
              className=" text-white cursor-pointer transition-colors duration-300"
            />
            <FaLinkedin
              size={20}
              className="text-white cursor-pointer transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
