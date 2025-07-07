import { Request, Response } from "express";
import path from "path";
import { exec } from "child_process";

// Main OCR controller
export const processAadhaarOCR = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No Aadhaar image uploaded" });
    return;
  }

  const imgPath = path.resolve(file.path);
  const extractFaceScript = path.resolve(__dirname, "./python/extract_face.py");
  const extractDataScript = path.resolve(__dirname, "./python/extract_data.py");

  // Step 1: Run face extraction
  exec(`python "${extractFaceScript}" "${imgPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Face extraction failed:", stderr);
      res.status(500).json({ error: "Face extraction failed" });
      return;
    }

    let photoUrl = "";
    try {
      const result = JSON.parse(stdout);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }
      const facePath = result.path.replace(/\\/g, "/");
      photoUrl = `http://localhost:3001/${facePath}`;
    } catch {
      res.status(500).json({ error: "Invalid face extract response" });
      return;
    }

    // Step 2: Run Aadhaar OCR data extraction
    exec(`python "${extractDataScript}" "${imgPath}"`, (err2, stdout2, stderr2) => {
      if (err2) {
        console.error("❌ OCR extraction failed:", stderr2);
        res.status(500).json({ error: "Data extraction failed" });
        return;
      }

      try {
        const data = JSON.parse(stdout2);
        res.json({
          message: "Face and Aadhaar data extracted successfully",
          photoUrl,
          name: data.name || "Not found",
          dob: data.dob || "Not found",
          aadhaarNumber: data.aadhaarNumber || "Not found",
        });
      } catch {
        res.status(500).json({ error: "Invalid OCR response format" });
      }
    });
  });
};
