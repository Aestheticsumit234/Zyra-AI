import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Interview from "../model/interview.model.js";
import User from "../model/user.model.js";
import { askOpenRouter } from "../services/openRouter.service.js";

export const anylizeResume = async (req, res) => {
  const filepath = req.file?.path;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume is required" });
    }

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const message = [
      {
        role: "system",
        content: `Extract Structured Data from resume. 
        Return ONLY a raw JSON object. 
        Do not use markdown blocks (no backticks, no \`\`\`json).
        
        {
          "role": "string",
          "experience": "string",
          "project": ["string"],
          "skill": ["string"]
        }`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askOpenRouter(message);
    const cleanJsonString = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parse = JSON.parse(cleanJsonString);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    const parsedData = {
      role: parse.role || "",
      experience: parse.experience || "",
      project: parse.project || [],
      skill: parse.skill || parse.skills || [],
      resumeText,
    };

    return res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error("Backend Error:", error.message);

    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON format. Please try again.",
      });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        success: false,
        message: "Role, Experience and Mode are required",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits. Minimum 50 credits required",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length > 0
        ? projects.join(", ")
        : "None";
    const skillsText =
      Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
      Role: ${role}
      Experience: ${experience}
      InterviewMode: ${mode}
      Projects: ${projectText}
      Skills: ${skillsText}
      Resume: ${safeResume}
    `;

    const message = [
      {
        role: "system",
        content: `You are a real human interviewer. Speak in simple natural English.
        Generate exactly 5 questions, one per line.
        Strict Rules:
        1. No numbering.
        2. No extra text or explanations.
        3. One question per line.
        Difficulty progression: Q1-2 Easy, Q3-4 Medium, Q5 Hard.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askOpenRouter(message);

    if (!aiResponse) {
      return res
        .status(500)
        .json({ success: false, message: "AI response failed" });
    }

    const QuestionArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 15);

    if (QuestionArray.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Could not parse AI questions" });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: QuestionArray.map((q, index) => ({
        question: q,
        answer: "",
        difficulty: index < 4 ? "easy" : index < 8 ? "medium" : "hard",
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      interviewId: interview._id,
      credits: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Generate Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    if (!interviewId || questionIndex === undefined || !timeTaken) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    if (!answer || answer.trim() === "") {
      question.score = 0;
      question.feedback = "No answer provided by the candidate.";
      question.answer = "";
      await interview.save();

      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    if (timeTaken > (question.timeLimite || 60)) {
      console.log("Time limit exceeded for this question");
    }

    const message = [
      {
        role: "system",
        content: `You are a professional interviewer. Evaluate the candidate's answer.
        Score areas (0-10): Confidence, Communication, Correctness.
        Calculate finalScore as average rounded to nearest whole number.
        Feedback: 10-15 words, natural human tone.
        Return ONLY raw JSON:
        {
          "confidence": number,
          "communication": number,
          "correctness": number, 
          "finalScore": number,
          "feedback": "string"
        }`,
      },
      {
        role: "user",
        content: `Question: ${question.question}\nAnswer: ${answer}`,
      },
    ];

    const aiResponse = await askOpenRouter(message);

    if (!aiResponse) {
      return res
        .status(500)
        .json({ success: false, message: "AI evaluation failed" });
    }

    const cleanJson = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedResponse = JSON.parse(cleanJson);

    question.answer = answer;
    question.confidence = parsedResponse.confidence || 0;
    question.communicationScore = parsedResponse.communication || 0;
    question.correctNess = parsedResponse.correctness || 0;
    question.score = parsedResponse.finalScore || 0;
    question.feedback = parsedResponse.feedback || "Good effort.";

    await interview.save();

    return res.status(200).json({
      success: true,
      feedback: question.feedback,
      score: question.score,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "Completed") {
      return res.status(200).json({
        success: true,
        message: "Interview was already completed",
        finalScore: interview.finalScore,
      });
    }

    const totalQuestion = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((question) => {
      totalScore += question.score || 0;
      totalConfidence += question.confidence || 0;
      totalCommunication += question.communicationScore || 0;
      totalCorrectness += question.correctNess || 0;
    });

    const finalScore = totalQuestion ? totalScore / totalQuestion : 0;

    const avgConfidence = totalQuestion ? totalConfidence / totalQuestion : 0;

    const avgCommunication = totalQuestion
      ? totalCommunication / totalQuestion
      : 0;

    const avgCorrectness = totalQuestion ? totalCorrectness / totalQuestion : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      success: true,
      finalScore: Number(finalScore.toFixed(1)),
      Confidence: Number(avgConfidence.toFixed(1)),
      Communication: Number(avgCommunication.toFixed(1)),
      Correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((question) => ({
        question: question.question,
        score: question.score || 0,
        feedback: question.feedback,
        confidence: question.confidence || 0,
        communication: question.communicationScore || 0,
        correctness: question.correctNess || 0,
      })),
      message: "Interview completed successfully",
    });
  } catch (error) {
    console.error("Finish Interview Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
