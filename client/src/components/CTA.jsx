import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import AuthModel from "./AuthModel";

const CTA = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <section className="pb-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: easeOutExpo }}
        className="max-w-5xl mx-auto bg-neutral-900/50 border border-white/5 rounded-[2.5rem] p-16 md:p-24 text-center relative overflow-hidden backdrop-blur-lg"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-amber-200/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-25 bg-amber-500/10 blur-[80px]"></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-tight">
            Elevate your next <br /> career defining moment.
          </h2>
          <button
            onClick={() => {
              if (!userData) {
                setShowAuth(true);
                return;
              }
            }}
            className="bg-white text-black px-12 py-4 rounded-full font-semibold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-colors duration-500 mt-4"
          >
            Unlock Access
          </button>
        </div>
      </motion.div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </section>
  );
};

export default CTA;
