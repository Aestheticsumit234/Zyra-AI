import { motion } from "framer-motion";
import {
  FaAmazon,
  FaApple,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
} from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";

const Marquee = () => {
  return (
    <div className="py-16 border-y border-white/2 bg-neutral-950/30 overflow-hidden relative flex">
      <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex w-max opacity-40"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      >
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex gap-24 pr-24 items-center">
            {[FaGoogle, FaAmazon, FaMicrosoft, FaMeta, FaApple, FaGithub].map(
              (Icon, i) => (
                <div
                  key={`icon-${setIndex}-${i}`}
                  className="text-neutral-500 hover:text-white hover:scale-110 transition-all duration-500 cursor-pointer"
                >
                  <Icon size={36} />
                </div>
              ),
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
