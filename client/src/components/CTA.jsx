import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthModel from "./AuthModel";

const CTA = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const easeOutExpo = [0.16, 1, 0.3, 1];

  const handleClick = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    navigate("/interview");
  };

  return (
    <section className="px-6 pb-24 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: easeOutExpo }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/4 p-8 md:p-14 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-amber-100/70">
              Premium Practice Starts Here
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-light leading-tight text-white md:text-5xl">
              Walk into your next interview looking rehearsed, refined, and
              ready.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-400">
              Build sharper stories, steadier delivery, and a more impressive
              presence before the stakes are real.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <button
              onClick={handleClick}
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-amber-200 via-amber-300 to-yellow-500 px-9 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(245,158,11,0.24)]"
            >
              Start Now
              <HiOutlineArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <p className="text-sm text-neutral-500">
              Private setup. Fast onboarding. Premium feel.
            </p>
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </section>
  );
};

export default CTA;
