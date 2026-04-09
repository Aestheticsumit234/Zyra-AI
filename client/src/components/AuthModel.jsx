import { motion } from "framer-motion";
import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import Auth from "../pages/Auth";

const AuthModel = ({ onClose }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 h-dvh w-screen z-9999 flex items-center justify-center bg-black/75 backdrop-blur-md px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="relative w-full max-w-md mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-10 right-0 md:-right-48 md:top-3 p-3 bg-white/5 border border-white/10 rounded-full text-neutral-400 hover:text-white hover:bg-white/20 transition-all duration-300 z-1000 backdrop-blur-xl cursor-pointer group shadow-xl"
        >
          <RxCross2
            size={22}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>

        <Auth isModal={true} />
      </motion.div>
    </motion.div>
  );
};

export default AuthModel;
