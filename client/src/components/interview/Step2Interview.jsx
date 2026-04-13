import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineMicrophone,
  HiOutlineShieldCheck,
  HiOutlineStop,
  HiOutlineVideoCamera,
} from "react-icons/hi";
import { serverUrl } from "../../App";

const QUESTION_TIME = 60;

const Step2Interview = ({ interviewData, onFinished }) => {
  const { interviewId, questions = [], userName = "Candidate" } = interviewData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hardwareReady, setHardwareReady] = useState(false);
  const [error, setError] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const camStreamRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const currentQuestion = questions[currentIndex]?.question || "";

  const attachVideoStream = async (stream) => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;

    try {
      await videoRef.current.play();
    } catch (e) {
      console.error("Video preview play error:", e);
    }
  };

  const speak = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const setupRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      setError(
        "Speech transcription is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += `${transcript} `;
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer(`${finalTranscriptRef.current}${interimTranscript}`.trim());
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsRecording(false);

      if (event.error === "not-allowed") {
        setError("Microphone permission denied. Please allow mic access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try speaking again.");
      } else {
        setError(
          "Voice transcription failed. Please try again or use text input.",
        );
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setRecognitionSupported(true);
  };

  const startHardware = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      camStreamRef.current = stream;
      await attachVideoStream(stream);
      setupRecognition();
      setHardwareReady(true);

      if (questions[0]?.question) {
        setTimeout(() => speak(questions[0].question), 600);
      }
    } catch (err) {
      console.error(err);
      setError("Camera aur microphone permission allow karein.");
    }
  };

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error("Stop recognition error:", e);
    }
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (!recognitionRef.current) {
      setError(
        "Voice transcription available nahi hai. Aap type kar sakte hain.",
      );
      return;
    }

    if (isRecording) {
      stopRecognition();
      return;
    }

    try {
      finalTranscriptRef.current = answer ? `${answer} ` : "";
      recognitionRef.current.start();
    } catch (err) {
      console.error("Start recognition error:", err);
      setIsRecording(false);
      setError("Mic start nahi ho paaya. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    stopRecognition();

    try {
      await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer: answer.trim() || "No response.",
          timeTaken: QUESTION_TIME - timeLeft,
        },
        { withCredentials: true },
      );

      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setAnswer("");
        finalTranscriptRef.current = "";
        setTimeLeft(QUESTION_TIME);

        setTimeout(() => {
          speak(questions[nextIndex]?.question);
        }, 500);
      } else {
        const res = await axios.post(
          `${serverUrl}/api/interview/interview-finish`,
          { interviewId },
          { withCredentials: true },
        );
        onFinished(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Answer submit karte waqt problem aayi.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!hardwareReady || submitting) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, hardwareReady, submitting]);

  useEffect(() => {
    if (
      hardwareReady &&
      camStreamRef.current &&
      videoRef.current &&
      !videoRef.current.srcObject
    ) {
      attachVideoStream(camStreamRef.current);
    }
  }, [hardwareReady]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
      camStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!hardwareReady) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg bg-white/4 border border-white/10 p-8 md:p-10 rounded-[2.5rem] text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <HiOutlineShieldCheck className="text-emerald-400 text-4xl" />
          </div>

          <h2 className="text-3xl font-light text-white mb-3">
            Start Interview
          </h2>

          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Camera aur microphone permission allow kijiye. Screen share ki
            zarurat nahi hai.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4 text-neutral-300">
              <HiOutlineVideoCamera className="mx-auto mb-2 text-2xl text-emerald-400" />
              Camera Access
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4 text-neutral-300">
              <HiOutlineMicrophone className="mx-auto mb-2 text-2xl text-emerald-400" />
              Mic Access
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-5">{error}</p>}

          <button
            onClick={startHardware}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all"
          >
            Enable Camera & Mic
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white/3 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400/70">
                AI Interview
              </p>
              <h2 className="text-2xl font-light mt-2">{userName}</h2>
            </div>

            <div className="px-4 py-3 rounded-2xl border border-white/10 text-sm text-neutral-300">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="mb-8 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{
                width: `${questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center text-center min-h-70">
            <motion.div
              animate={{ scale: isRecording ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8"
            >
              <span className="text-emerald-400 font-black text-3xl">AI</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h3
                key={currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="text-2xl md:text-3xl font-light text-neutral-100 leading-relaxed"
              >
                "{currentQuestion}"
              </motion.h3>
            </AnimatePresence>
          </div>

          <div className="mt-8 rounded-4xl overflow-hidden border border-white/10 bg-black">
            <div className="px-4 py-3 border-b border-white/10 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Camera Preview
            </div>
            <div className="h-72">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/3 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl flex flex-col">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
            <div className="text-sm text-neutral-400">
              {isRecording
                ? "Listening and transcribing..."
                : recognitionSupported
                  ? "Click mic to start speaking"
                  : "Type your answer manually"}
            </div>

            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border font-mono text-lg ${
                timeLeft < 15
                  ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
              }`}
            >
              <HiOutlineClock />
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex-1 rounded-4xl border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
              Your Answer
            </p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Yahan type karein ya mic button dabakar bolna start karein..."
              className="w-full h-65 bg-transparent border-none outline-none resize-none text-lg text-neutral-200 leading-relaxed placeholder:text-neutral-600"
            />
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleRecording}
                disabled={!recognitionSupported}
                className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all disabled:opacity-40 ${
                  isRecording
                    ? "bg-red-500 text-white shadow-2xl shadow-red-500/20"
                    : "bg-white text-black hover:bg-emerald-400"
                }`}
              >
                {isRecording ? (
                  <HiOutlineStop className="text-2xl" />
                ) : (
                  <HiOutlineMicrophone className="text-2xl" />
                )}
              </button>

              <span className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.25em]">
                {isRecording ? "Recording..." : "Mic Ready"}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-10 py-4 bg-emerald-500 text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Answer"}
              <HiOutlineArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
