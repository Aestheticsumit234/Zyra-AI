import express from "express";
import {
  anylizeResume,
  finishInterview,
  generateQuestions,
  submitAnswer,
} from "../controller/interview.controller.js";
import isAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), anylizeResume);
interviewRouter.post("/generate-questions", isAuth, generateQuestions);
interviewRouter.post("/submit-answer", isAuth, submitAnswer);
interviewRouter.post("/interview-finish", isAuth, finishInterview);

export default interviewRouter;
