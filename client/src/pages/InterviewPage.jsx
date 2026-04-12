import { useState } from "react";
import Step1SetUp from "../components/interview/Step1SetUp";
import Step2Interview from "../components/interview/Step2Interview";
import Step3Report from "../components/interview/Step3Report";

const InterviewPage = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  const handleStart = (data) => {
    if (data && data.questions) {
      setInterviewData(data);
      setStep(2);
    } else {
      alert("Failed to load interview questions. Please try again.");
    }
  };

  const handleFinished = (report) => {
    setInterviewData(report);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {step === 1 && <Step1SetUp onStart={handleStart} />}

      {step === 2 && interviewData && (
        <Step2Interview
          interviewData={interviewData}
          onFinished={handleFinished}
        />
      )}

      {step === 3 && interviewData && (
        <Step3Report reportData={interviewData} />
      )}
    </div>
  );
};

export default InterviewPage;
