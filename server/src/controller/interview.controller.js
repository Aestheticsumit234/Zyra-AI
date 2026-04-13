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
        content: `
You are an expert resume parser.

Your task is to extract structured candidate data from resume text.

Extraction rules:
- Extract the candidate's most relevant target job role as "role".
- Extract total experience as a short readable string as "experience".
- Extract the most important project names or project descriptions as "project".
- Extract technical and professional skills as "skill".
- Use only information clearly present in the resume.
- Do not invent or assume missing details.
- If a field is missing, return an empty string or empty array as appropriate.
- Keep extracted values concise and clean.
- Remove duplicates from arrays.
- Prefer normalized, human-readable values.

Output rules:
- Return ONLY one valid raw JSON object.
- Do not wrap the JSON in markdown.
- Do not add explanations, notes, headings, or extra text.
- All keys must match exactly.

Return exactly this structure:
{
  "role": "string",
  "experience": "string",
  "project": ["string"],
  "skill": ["string"]
}
    `.trim(),
      },
      {
        role: "user",
        content: `
Resume Text:
${resumeText}
    `.trim(),
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
        content: `
You are an experienced human interviewer.

Your job is to generate interview questions in simple, natural, conversational English.

Output requirements:
- Return exactly 5 interview questions.
- Each question must be on its own line.
- Do not add numbering.
- Do not add bullets.
- Do not add headings.
- Do not add explanations.
- Do not add introductory or closing text.
- Output plain text only.

Question quality rules:
- Questions must be relevant to the user's prompt.
- Questions should sound like a real interviewer is asking them.
- Keep each question clear, concise, and professional.
- Avoid repeating the same idea in multiple questions.
- Avoid overly generic wording when more specific wording is possible.

Difficulty progression:
- Question 1: Easy
- Question 2: Easy
- Question 3: Medium
- Question 4: Medium
- Question 5: Hard

Final instruction:
Return only the 5 questions, with one question per line.
    `.trim(),
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
        content: `
You are an expert technical interviewer and candidate evaluator.

Your task is to evaluate a candidate's answer to a single interview question.

Scoring rules:
- Score these 3 categories from 0 to 10 as integers only:
  1. confidence
  2. communication
  3. correctness
- finalScore must be the rounded average of confidence, communication, and correctness.
- Be fair, consistent, and realistic.
- Do not give high scores unless the answer clearly deserves them.
- If the answer is vague, incomplete, off-topic, or factually weak, reduce the score accordingly.
- If the answer is empty, irrelevant, or "No response.", assign very low scores.

Feedback rules:
- feedback must be natural, professional, and human-sounding.
- Keep feedback between 12 and 20 words.
- Mention one strength or weakness clearly.
- Do not use markdown.
- Do not use bullet points.

Output rules:
- Return ONLY valid raw JSON.
- Do not wrap in markdown fences.
- Do not add explanations, labels, or extra text.
- All numeric fields must be numbers, not strings.

Return exactly this structure:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "string"
}
    `.trim(),
      },
      {
        role: "user",
        content: `
Evaluate the following interview response.

Question:
${question.question}

Candidate Answer:
${answer || "No response."}
    `.trim(),
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
