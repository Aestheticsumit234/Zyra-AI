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
    desc: "Nuanced voice mapping and organic conversation flow adaptation.",
  },
  {
    title: "Profile Synthesis",
    icon: <HiOutlineDocumentText size={24} strokeWidth={1.5} />,
    desc: "Deep-context queries generated strictly from your career trajectory.",
  },
  {
    title: "Live Telemetry",
    icon: <HiOutlineLightningBolt size={24} strokeWidth={1.5} />,
    desc: "Real-time metrics on pacing, tonality, and rhetorical confidence.",
  },
  {
    title: "Diagnostic Analytics",
    icon: <HiOutlineChartBar size={24} strokeWidth={1.5} />,
    desc: "Granular post-session reports identifying micro-weaknesses.",
  },
  {
    title: "Evolution Graph",
    icon: <MdOutlineTimeline size={24} />,
    desc: "Track your command of the room visually across multiple sessions.",
  },
  {
    title: "Bespoke Pathways",
    icon: <MdOutlineBusinessCenter size={24} />,
    desc: "Curated environments mimicking the exact culture of top-tier firms.",
  },
];

const Features = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
          The Anatomy of an{" "}
          <span className="italic text-amber-200/80">Offer</span>
        </h2>
        <p className="text-neutral-400 text-lg font-light max-w-xl mx-auto">
          A comprehensive suite of intelligence tools tailored for the modern
          executive and high-tier candidate.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {featuresData.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group p-10 bg-neutral-900/20 border border-white/4 rounded-3xl hover:bg-neutral-900/40 hover:border-amber-200/20 transition-all duration-500 backdrop-blur-sm"
          >
            <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mb-8 text-neutral-400 group-hover:text-amber-200 group-hover:border-amber-200/30 transition-all duration-500 bg-neutral-950">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium text-white mb-3 tracking-wide">
              {feature.title}
            </h3>
            <p className="text-neutral-500 leading-relaxed font-light text-sm">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
