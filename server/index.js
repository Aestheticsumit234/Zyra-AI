import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`server is listining on PORT : ${PORT}`);
});
