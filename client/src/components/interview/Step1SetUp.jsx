import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaAngleDown,
  FaBriefcase,
  FaChartLine,
  FaCloudUploadAlt,
  FaMicrophone,
  FaUserTie,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setUserData } from "../../redux/userSlice";

const Step1SetUp = ({ onStart }) => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [Experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical Interview");
  const [resumeFile, setResumeFile] = useState(null);
  const [project, setProject] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleResumeUpload = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/resume`,
        formData,
        {
          withCredentials: true,
        },
      );
      const extractedData = result.data.data;
      setRole(extractedData.role || "");
      setExperience(extractedData.experience || "");
      setSkills(extractedData.skill || []);
      setProject(extractedData.project || []);
      setResumeText(extractedData.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.error("Upload Error:", error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ role, Experience, mode, skills, project, resumeText });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const handleStart = async () => {
    if (!role || !Experience || !mode) {
      alert("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`,
        {
          role,
          experience: Experience,
          mode,
          skills,
          projects: project,
          resumeText,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Interview Result:", result.data);

      if (userData && result.data.credits !== undefined) {
        dispatch(setUserData({ ...userData, credits: result.data.credits }));
      }

      setLoading(false);

      onStart(result.data);
    } catch (error) {
      setLoading(false);
      console.error("Generate Questions Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative max-w-5xl w-full"
      >
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -inset-0.5 bg-linear-to-r from-[#ecbf67] to-[#e8c463] rounded-3xl opacity-30"
        ></motion.div>

        <div className="relative flex flex-col md:flex-row bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="w-full flex flex-col gap-4 md:w-1/2 p-8 lg:p-10 border-b md:border-b-0 md:border-r border-gray-800">
            <div>
              <motion.h2
                variants={itemVariants}
                className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight"
              >
                Start Your AI Interview
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 mb-6 text-sm leading-relaxed"
              >
                Practice real interview scenarios powered by AI. Improve
                communication, technical skills, and{" "}
                <span className="text-[#cda24b] font-medium">confidence.</span>
              </motion.p>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <FaUserTie />,
                  text: "Choose Role & Experience",
                  active: true,
                },
                { icon: <FaMicrophone />, text: "Smart Voice Interview" },
                { icon: <FaChartLine />, text: "Performance Analytics" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl font-semibold text-sm ${
                    item.active
                      ? "bg-linear-to-r from-[#cda24b] to-[#e8c872] text-black shadow-lg"
                      : "border border-gray-700 bg-[#1e1e1e] text-gray-300"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-orange-300 mt-auto">
              <span className="text-gray-500/40">for support</span>{" "}
              support@Hirely.in
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-10 bg-[#1f1f1f]">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-bold text-white mb-6 tracking-tight"
            >
              Interview SetUp
            </motion.h3>

            <motion.form
              onSubmit={handleSubmit}
              variants={itemVariants}
              className="space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-sm">
                  <FaUserTie />
                </div>
                <input
                  type="text"
                  placeholder="Enter role"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  className="w-full bg-[#141414] border border-gray-700 text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#cda24b] transition-colors placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 text-sm">
                  <FaBriefcase />
                </div>
                <input
                  type="text"
                  placeholder="Experience (e.g. 2 years)"
                  onChange={(e) => setExperience(e.target.value)}
                  value={Experience}
                  className="w-full bg-[#141414] border border-gray-700 text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#cda24b] transition-colors placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <select
                  onChange={(e) => setMode(e.target.value)}
                  value={mode}
                  className="w-full bg-[#141414] border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#cda24b] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Technical Interview">
                    Technical Interview
                  </option>
                  <option value="HR Interview">HR Interview</option>
                  <option value="System Design">System Design</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#cda24b]">
                  <FaAngleDown />
                </div>
              </div>

              {!analysisDone && (
                <motion.div
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                  }}
                  onClick={() =>
                    document.getElementById("resume-upload").click()
                  }
                  className="mt-4 border-2 border-dashed border-gray-700 bg-[#1a1a1a] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#cda24b] transition-all group"
                >
                  <FaCloudUploadAlt className="text-3xl text-[#cda24b] mb-2 group-hover:scale-110 transition-transform" />
                  <input
                    type="file"
                    id="resume-upload"
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                  <p className="text-gray-400 text-xs text-center">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload resume (optional)"}
                  </p>
                  {resumeFile && (
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResumeUpload();
                      }}
                      className="px-5 py-1.5 bg-amber-300 text-black mt-4 text-xs font-bold rounded-lg"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}

              {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3 border-t border-gray-800 pt-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[#cda24b] text-xs font-semibold flex items-center gap-2 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-[#cda24b] rounded-full animate-pulse" />
                      AI Analysis
                    </h4>
                    <button
                      onClick={() => setAnalysisDone(false)}
                      className="text-[10px] text-gray-500 hover:text-white uppercase"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="bg-[#141414] p-2.5 rounded-lg border border-gray-800">
                    <span className="text-gray-500 text-[10px] block uppercase tracking-tighter">
                      Role
                    </span>
                    <p className="text-white text-xs font-medium truncate">
                      {role || "Not specified"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-[#cda24b]/5 border border-[#cda24b]/20 text-[#cda24b] text-[10px] rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    {project.slice(0, 2).map((p, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#252525] p-2 rounded-md border border-gray-700/50"
                      >
                        <div className="w-1 h-1 bg-gray-500 rounded-full" />
                        <p className="text-gray-300 text-[11px] truncate">
                          {p}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleStart}
                className="w-full bg-linear-to-r from-[#cda24b] to-[#e8c872] text-black py-3.5 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity mt-2 text-sm"
              >
                Start Interview
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step1SetUp;
