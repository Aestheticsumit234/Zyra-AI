import express from "express";
import { googleAuth, logout } from "../controller/auth.contoller.js";
const authRouter = express.Router();

authRouter.post("/googleAuth", googleAuth);
authRouter.post("/logout", logout);

export default authRouter;
