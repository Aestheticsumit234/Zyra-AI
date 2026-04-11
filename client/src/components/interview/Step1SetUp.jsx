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
import { serverUrl } from "../../App";

const Step1SetUp = ({ onStart }) => {
  const [role, setRole] = useState("");
  const [Experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical Interview");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

      console.log("Result received:", result.data);

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setSkills(result.data.skills || []);
      setProject(result.data.projects || []);
      setResumeText(result.data.resumeText || "");
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

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 font-sans">
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
          <div className="w-full flex flex-col gap-6 md:w-1/2 p-10 lg:p-12 border-b md:border-b-0 md:border-r border-gray-800">
            <div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight"
              >
                Start Your AI Interview
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-400 mb-10 leading-relaxed"
              >
                Practice real interview scenarios powered by AI. Improve
                communication, technical skills, and{" "}
                <span className="text-[#cda24b] font-medium">confidence.</span>
              </motion.p>
            </div>

            <div className="space-y-5">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-linear-to-r from-[#cda24b] to-[#e8c872] text-black p-4 rounded-xl font-semibold shadow-lg"
              >
                <FaUserTie className="text-xl" />
                <span>Choose Role & Experience</span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 border border-gray-700 bg-[#1e1e1e] text-gray-300 p-4 rounded-xl hover:border-gray-500 transition-colors"
              >
                <FaMicrophone className="text-xl" />
                <span>Smart Voice Interview</span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 border border-gray-700 bg-[#1e1e1e] text-gray-300 p-4 rounded-xl hover:border-gray-500 transition-colors"
              >
                <FaChartLine className="text-xl" />
                <span>Performance Analytics</span>
              </motion.div>
            </div>
            <p className="text-center text-orange-300 mt-auto">
              <span className="text-gray-500/40">for support</span>{" "}
              support@Hirely.in
            </p>
          </div>

          <div className="w-full md:w-1/2 p-10 lg:p-12 bg-[#1f1f1f]">
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-8 tracking-tight"
            >
              Interview SetUp
            </motion.h3>

            <motion.form
              onSubmit={handleSubmit}
              variants={itemVariants}
              className="space-y-5"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaUserTie />
                </div>
                <input
                  type="text"
                  placeholder="Enter role"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#cda24b] transition-colors placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaBriefcase />
                </div>
                <input
                  type="text"
                  placeholder="Experience (e.g. 2 years)"
                  onChange={(e) => setExperience(e.target.value)}
                  value={Experience}
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#cda24b] transition-colors placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <select
                  onChange={(e) => setMode(e.target.value)}
                  value={mode}
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#cda24b] transition-colors appearance-none cursor-pointer"
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
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                  }}
                  onClick={() =>
                    document.getElementById("resume-upload").click()
                  }
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 border-2 border-dashed border-gray-600 bg-[#1a1a1a] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#cda24b] transition-all group"
                >
                  <FaCloudUploadAlt className="text-4xl text-[#cda24b] mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <input
                    type="file"
                    id="resume-upload"
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                  <p className="text-gray-400 text-sm text-center">
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
                      className="px-6 py-2 border border-amber-400 rounded-xl bg-amber-300 text-black mt-5 font-bold"
                      whileHover={{ scale: 1.05 }}
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-linear-to-r from-[#cda24b] to-[#e8c872] text-black p-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity mt-4"
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
