import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { AiTwotoneDollarCircle } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const [showCreaditPopup, setShowCreaditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(setUserData(null));
      setShowCreaditPopup(false);
      setShowUserPopup(false);
      Navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0a0a0a]/40 backdrop-blur-xl border-b border-white/4 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="text-2xl font-light text-white tracking-widest uppercase cursor-pointer"
        >
          Hirely<span className="text-amber-200/80">.</span>
        </motion.div>

        <div className="hidden md:flex space-x-12 text-sm font-medium tracking-wide text-neutral-400">
          {[
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
            { name: "Pricing", path: "/pricing" },
            { name: "Contact", path: "/contact" },
          ].map((item, i) => (
            <motion.a
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
              key={item.name}
              href={item.path}
              className="hover:text-white transition-colors duration-300 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200/50 transition-all duration-500 group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreaditPopup(!showCreaditPopup);
                setShowUserPopup(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="cursor-pointer hidden md:flex items-center justify-center gap-3 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-white/45 hover:text-black transition-all duration-500"
            >
              <AiTwotoneDollarCircle className="text-2xl" />{" "}
              {userData?.credits || 0}
            </motion.button>

            {showCreaditPopup && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
                className="absolute w-75 top-14 right-0 bg-white/5 border border-white/10 rounded-lg py-4 px-5 text-white/60 text-sm font-medium tracking-wide"
              >
                <p>Need more credits to continue Hirely?</p>
                <button
                  onClick={() => Navigate("/pricing")}
                  className="border border-white/10 w-full  rounded-full py-2 mt-4 cursor-pointer hover:bg-white/45 hover:text-black transition-all duration-500"
                >
                  Buy Credits
                </button>
              </motion.div>
            )}
          </div>

          <div>
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreaditPopup(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="block border cursor-pointer border-white/10 text-white  rounded-full text-sm font-medium tracking-wide hover:bg-white/50 hover:text-black transition-all duration-500"
            >
              {userData ? (
                <img
                  src={userData.photoURL}
                  alt={userData.name}
                  className="w-11 h-11 object-cover rounded-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                userData?.name.slice(0, 1) || <FaRegUserCircle size={28} />
              )}
            </motion.button>

            {showUserPopup && (
              <div>
                {showUserPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-30 top-20 w-72 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-100 overflow-hidden"
                  >
                    <div className="px-4 py-2 bg-white/3 border-b border-white/5">
                      <p className="text-white text-sm font-bold truncate">
                        {userData?.name}
                      </p>
                      <p className="text-white/40 text-[11px] truncate font-medium uppercase tracking-wider">
                        {userData?.email}
                      </p>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => Navigate("/history")}
                        className="w-full flex items-center px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                      >
                        View History
                      </button>
                    </div>

                    <div className="p-1 border-t border-white/5 bg-black/20">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        {userData ? "Logout" : "Login"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </nav>
  );
};

export default Navbar;
