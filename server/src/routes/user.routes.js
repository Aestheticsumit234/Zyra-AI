import express from "express";
import { getCurrentUser } from "../controller/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);

export default userRouter;
