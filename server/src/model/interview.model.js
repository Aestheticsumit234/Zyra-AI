import mongoose from "mongoose";

const questionScheme = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
  },
  timeLimite: {
    type: Number,
  },
  answer: {
    type: String,
    default: "",
  },
  feedback: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  confidence: {
    type: Number,
    default: 0,
  },
  communicationScore: {
    type: Number,
    default: 0,
  },
  correctNess: {
    type: Number,
    default: 0,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR Interview", "Technical Interview", "System Design"],
      default: "Technical Interview",
      required: true,
    },
    resumeText: {
      type: String,
    },
    questions: [questionScheme],
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
