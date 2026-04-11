import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthModel from "./AuthModel";

const Hero = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [index, setIndex] = useState(0);
  const easeOutExpo = [0.16, 1, 0.3, 1];
  const words = ["offers.", "results.", "dream jobs.", "careers.", "success."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-32 pb-24 px-6 text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-light text-white mb-8 leading-[1.1] tracking-tight"
        >
          Turn interviews <br /> into{" "}
          <div className="block md:inline-block md:min-w-85 text-center md:text-left mt-2 md:mt-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className="inline-block text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-yellow-600 font-medium italic md:pr-4"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-lg md:text-xl text-neutral-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Practice with an elite AI designed to refine your narrative. Stop
          guessing, start commanding the room.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: easeOutExpo }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <button
            onClick={() => {
              if (!userData) {
                setShowAuth(true);
                return;
              }
              navigate("/interview");
            }}
            className="bg-white text-black px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Start Interview
          </button>
          <button
            onClick={() => {
              if (!userData) {
                setShowAuth(true);
                return;
              }
              navigate("/history");
            }}
            className="border border-white/10 text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-white/5 transition-colors duration-500 backdrop-blur-sm"
          >
            View History
          </button>
        </motion.div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </section>
  );
};

export default Hero;
