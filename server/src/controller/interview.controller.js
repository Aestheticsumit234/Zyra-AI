import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
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
    const { role, experience, project, skill } = req.body;
  } catch (error) {}
};
