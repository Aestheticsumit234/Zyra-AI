import { motion } from "framer-motion";
import {
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineLightningBolt,
  HiOutlineMicrophone,
} from "react-icons/hi";
import { MdOutlineBusinessCenter, MdOutlineTimeline } from "react-icons/md";

const featuresData = [
  {
    title: "Adaptive Simulation",
    icon: <HiOutlineMicrophone size={24} strokeWidth={1.5} />,
    desc: "Natural interview flow that responds to your pace, tone, and speaking style.",
  },
  {
    title: "Profile Synthesis",
    icon: <HiOutlineDocumentText size={24} strokeWidth={1.5} />,
    desc: "Questions shaped around your experience, projects, and target role.",
  },
  {
    title: "Live Telemetry",
    icon: <HiOutlineLightningBolt size={24} strokeWidth={1.5} />,
    desc: "Realtime signals on confidence, clarity, and response rhythm.",
  },
  {
    title: "Diagnostic Analytics",
    icon: <HiOutlineChartBar size={24} strokeWidth={1.5} />,
    desc: "Post-session insight that shows what to tighten before the real round.",
  },
  {
    title: "Evolution Graph",
    icon: <MdOutlineTimeline size={24} />,
    desc: "Track how your delivery and quality improve across sessions.",
  },
  {
    title: "Bespoke Pathways",
    icon: <MdOutlineBusinessCenter size={24} />,
    desc: "Premium interview environments aligned to ambitious career goals.",
  },
];

const Features = () => {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-[0.34em] text-amber-100/70">
            Platform Advantage
          </p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-4xl font-light tracking-tight text-white md:text-5xl">
              Crafted to feel sharper, calmer, and more premium than ordinary
              practice tools.
            </h2>
            <p className="max-w-xl text-base leading-8 text-neutral-400">
              Every surface is designed to help candidates prepare with more
              clarity and perform with more authority.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuresData.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group rounded-4xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-500 hover:border-amber-200/20 hover:bg-white/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-black/20 text-neutral-300 transition-all duration-500 group-hover:border-amber-200/25 group-hover:text-amber-100">
                {feature.icon}
              </div>

              <h3 className="mt-8 text-2xl font-light text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
