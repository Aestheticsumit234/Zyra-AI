import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineLightningBolt,
  HiOutlineMicrophone,
} from "react-icons/hi";
import { MdOutlineBusinessCenter, MdOutlineTimeline } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";

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

const FeaturesPage = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  return (
    <div className="min-h-screen bg-[#121212] font-sans selection:bg-amber-200/30">
      <section className="pt-24 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-amber-200/60 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            Intelligence Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Master the Art of the <br />
            <span className="italic text-amber-200/80">
              Executive Interview
            </span>
          </h1>
          <p className="text-neutral-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Our technology doesn't just record sessions; it deconstructs your
            performance using high-tier metrics to ensure you're ready for the
            most demanding rooms.
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4 tracking-tight">
            The Anatomy of an{" "}
            <span className="italic text-amber-200/80">Offer</span>
          </h2>
          <div className="w-12 h-px bg-amber-200/30 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuresData.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 bg-neutral-900/20 border border-white/5 rounded-3xl hover:bg-neutral-900/40 hover:border-amber-200/20 transition-all duration-500 backdrop-blur-sm"
            >
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center mb-6 text-neutral-400 group-hover:text-amber-200 group-hover:border-amber-200/30 transition-all duration-500 bg-neutral-950">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-neutral-500 leading-relaxed font-light text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          className="max-w-4xl mx-auto bg-linear-to-b from-neutral-900/40 to-transparent p-12 rounded-[3rem] border border-white/5 text-center"
        >
          <h2 className="text-3xl font-light text-white mb-6">
            Ready to secure your next{" "}
            <span className="text-amber-100">milestone?</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
              className="px-8 cursor-pointer py-3 bg-amber-200 text-black font-semibold rounded-full hover:bg-amber-100 transition-all duration-300"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/report");
              }}
              className="px-8 cursor-pointer py-3 border border-white/10 text-white font-light rounded-full hover:bg-white/5 transition-all duration-300"
            >
              View Report
            </button>
          </div>
        </motion.div>
      </section>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default FeaturesPage;
