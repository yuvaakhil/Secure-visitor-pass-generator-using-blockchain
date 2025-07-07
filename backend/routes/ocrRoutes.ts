import express from "express";
import multer from "multer";
import path from "path";
import { processAadhaarOCR } from "../ocrController";

const router = express.Router();

// Configure multer to save uploaded files in "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/**
 * POST /api/ocr/upload
 * Expects: image file named "aadhaar"
 * Runs OCR + face extraction and returns cropped photo URL
 */
router.post("/upload", upload.single("aadhaar"), processAadhaarOCR);

export default router;
