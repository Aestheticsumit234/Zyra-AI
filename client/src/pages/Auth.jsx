import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { auth, githubProvider, provider } from "../utils/firebase";

const Auth = ({ isModal = false }) => {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      const { photoURL, email, displayName: name } = user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleAuth",
        { photoURL, email, name },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      const response = await signInWithPopup(auth, githubProvider);
      let user = response.user;
      const { photoURL, email, displayName: name } = user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleAuth",
        { photoURL, email, name },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const easeOutExpo = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: easeOutExpo },
    },
  };

  return (
    <div
      className={` relative w-full min-h-screen ${isModal ? "bg-transparent" : ""}  bg-[#050505] flex items-center justify-center px-4 overflow-hidden selection:bg-amber-500/30 selection:text-amber-100 font-sans`}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="relative w-full max-w-105 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative bg-[#0a0a0a]/80 backdrop-blur-3xl p-10 md:p-14 rounded-[2.5rem] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-linear-to-r from-transparent via-amber-200/30 to-transparent"></div>

          <motion.div
            variants={itemVariants}
            className="mb-12 cursor-pointer text-center"
          >
            <span className="font-normal text-sm tracking-[0.3em] text-white uppercase">
              Hirely<span className="text-amber-300">.</span>
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center space-y-4 mb-12 w-full"
          >
            <h1 className="text-3xl font-medium tracking-tight text-white">
              Access Portal
            </h1>
            <p className="text-neutral-300 text-sm font-normal leading-relaxed max-w-65 mx-auto">
              Authenticate to enter the elite interview simulation environment.
            </p>
          </motion.div>

          <div className="w-full space-y-4">
            <motion.button
              variants={itemVariants}
              onClick={handleGoogleAuth}
              className="group relative w-full flex items-center justify-between px-6 bg-transparent border border-white/20 text-neutral-200 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-500 hover:border-white/50 hover:bg-white/10 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-4 relative z-10">
                <FaGoogle
                  size={18}
                  className="text-neutral-300 group-hover:text-white transition-colors duration-500"
                />
                <span className="group-hover:text-white transition-colors duration-500">
                  Continue with Google
                </span>
              </div>
              <HiArrowRight
                className="text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                size={18}
              />
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={handleGithubAuth}
              className="group relative w-full flex items-center justify-between px-6 bg-transparent border border-white/20 text-neutral-200 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-500 hover:border-white/50 hover:bg-white/10 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-4 relative z-10">
                <FaGithub
                  size={18}
                  className="text-neutral-300 group-hover:text-white transition-colors duration-500"
                />
                <span className="group-hover:text-white transition-colors duration-500">
                  Continue with GitHub
                </span>
              </div>
              <HiArrowRight
                className="text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                size={18}
              />
            </motion.button>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-12 w-full pt-8 border-t border-white/8 text-center"
          >
            <p className="text-[11px] text-neutral-400 font-medium tracking-widest uppercase">
              By proceeding, you agree to our{" "}
              <span className="text-neutral-200 cursor-pointer hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white/50 pb-0.5">
                Terms
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
