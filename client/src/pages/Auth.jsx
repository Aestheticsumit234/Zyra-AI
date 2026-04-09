import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { FaHireAHelper } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoSparkles } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { auth, githubProvider, provider } from "../utils/firebase";

const Auth = () => {
  const dispatch = useDispatch();
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      const { photoURL, email, displayName: name } = user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleAuth",
        {
          photoURL,
          email,
          name,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(setUserData(result.data));
    } catch (error) {}
  };

  const handleGithubAuth = async () => {
    try {
      const response = await signInWithPopup(auth, githubProvider);
      let user = response.user;
      const { photoURL, email, displayName: name } = user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleAuth",
        {
          photoURL,
          email,
          name,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative w-full min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 -mt-10 sm:mt-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 100,
          duration: 1,
        }}
        className="relative w-full max-w-110 z-10"
      >
        <div className="bg-[#F8FAFC] backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="bg-blue-900 text-white rounded-xl p-2.5 shadow-lg shadow-blue-700/20 transition-transform duration-500 group-hover:rotate-360">
              <FaHireAHelper size={27} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-blue-900">
              Hirely
            </span>
          </div>

          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 tracking-tight leading-[1.1]">
              Sign in with <br />
              <span className="relative inline-block mt-3">
                <span className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 blur-lg opacity-20"></span>
                <span className="relative flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-full text-sm font-medium shadow-xl">
                  <IoSparkles className="text-white" size={18} />
                  Hirely smart interview
                </span>
              </span>
            </h1>
            <p className="text-blue-900 opacity-70 text-sm md:text-base font-medium max-w-70 mx-auto leading-relaxed">
              Every great career starts with one good interview.
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4">
            {/* Google */}
            <motion.button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-4 bg-blue-900 text-white hover:text-blue-900 border border-slate-200 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-slate-50 cursor-pointer hover:border-blue-900"
            >
              <FcGoogle size={24} />
              <span className="sm:hidden">Continue with Google</span>
            </motion.button>

            {/* GitHub */}
            <motion.button
              onClick={handleGithubAuth}
              className="w-full flex items-center justify-center gap-4 bg-blue-900 text-white hover:text-blue-900 border border-slate-200 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-slate-50 cursor-pointer hover:border-blue-900"
            >
              <FaGithub size={22} />
              <span className="sm:hidden">Continue with GitHub</span>
            </motion.button>
          </div>

          <p className="mt-3 text-xs text-blue-900 font-medium">
            By signing in, you agree to our{" "}
            <span className="text-blue-400 cursor-pointer underline underline-offset-4 decoration-slate-200">
              Terms of Service
            </span>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-blue-900 text-sm"
        >
          Need help?{" "}
          <a href="#" className="text-indigo-600 font-semibold hover:underline">
            Contact Support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
