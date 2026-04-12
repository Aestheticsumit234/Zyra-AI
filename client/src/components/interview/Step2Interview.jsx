import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineMicrophone,
  HiOutlineStop,
} from "react-icons/hi";
import { serverUrl } from "../../App";

const Step2Interview = ({ interviewData, onFinished }) => {
  const { questions, interviewId } = interviewData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitting) {
      handleSubmitAnswer();
    }
  }, [timeLeft, submitting]);

  const handleSubmitAnswer = async () => {
    if (submitting) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer: answer || "No answer provided.",
          timeTaken: 60 - timeLeft,
        },
        { withCredentials: true },
      );

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
        setTimeLeft(60);
      } else {
        handleFinishInterview();
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to save answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishInterview = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/interview-finish`,
        {
          interviewId,
        },
        { withCredentials: true },
      );

      console.log("Finish Result:", result.data);

      if (result.data.success) {
        onFinished(result.data);
      }
    } catch (error) {
      console.error("Finish Error:", error);

      alert(error.response?.data?.message || "Failed to finish interview");
    }
  };
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-6 bg-[#0A0A0A] text-white font-sans selection:bg-amber-500/30">
      <div className="w-full max-w-4xl relative">
        <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <span className="text-amber-200/50 text-[10px] font-bold tracking-[0.3em] uppercase">
              Session Active
            </span>
            <h3 className="text-xl font-light">
              Question{" "}
              <span className="text-amber-200 font-medium">
                {currentIndex + 1}
              </span>
              <span className="text-neutral-600"> / {questions?.length}</span>
            </h3>
          </div>

          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${timeLeft < 15 ? "border-red-500/50 bg-red-500/5 text-red-500" : "border-white/5 bg-neutral-900/40 text-amber-200"}`}
          >
            <HiOutlineClock className={timeLeft < 15 ? "animate-spin" : ""} />
            <span className="font-mono text-xl font-medium">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-10 min-h-[100px]"
          >
            <h2 className="text-2xl md:text-4xl font-light leading-snug tracking-tight text-neutral-100">
              {questions[currentIndex]?.question}
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="relative mb-10 group">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Click the microphone to start speaking or type your answer..."
            className="w-full bg-neutral-900/20 border border-white/5 rounded-[2rem] p-8 md:p-10 min-h-[280px] text-lg text-neutral-400 font-light focus:outline-none focus:border-amber-500/20 transition-all duration-500 backdrop-blur-sm placeholder:text-neutral-700 resize-none"
          />

          <div className="absolute bottom-8 right-8 flex items-center gap-6">
            {isRecording && (
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 20, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
            )}

            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                isRecording
                  ? "bg-red-500 shadow-red-500/20 scale-110"
                  : "bg-amber-500 hover:bg-amber-400 shadow-amber-500/10 hover:scale-105"
              }`}
            >
              {isRecording ? (
                <HiOutlineStop className="text-2xl" />
              ) : (
                <HiOutlineMicrophone className="text-2xl text-black" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmitAnswer}
            disabled={submitting}
            className={`flex items-center gap-4 px-10 py-4 rounded-full font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-500 ${
              submitting
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-amber-200"
            }`}
          >
            {submitting
              ? "Analyzing Answer..."
              : currentIndex === questions.length - 1
                ? "Complete Interview"
                : "Next Question"}
            {!submitting && <HiOutlineArrowRight className="text-lg" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
