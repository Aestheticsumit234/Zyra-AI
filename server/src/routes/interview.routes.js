import express from "express";
import { anylizeResume } from "../controller/interview.controller.js";
import isAuth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), anylizeResume);

export default interviewRouter;
