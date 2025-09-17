"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ocrController_1 = require("../ocrController");
const router = express_1.default.Router();
// Configure multer to save uploaded files in "uploads" folder
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = (0, multer_1.default)({ storage });
/**
 * POST /api/ocr/upload
 * Expects: image file named "aadhaar"
 * Runs OCR + face extraction and returns cropped photo URL
 */
router.post("/upload", upload.single("aadhaar"), ocrController_1.processAadhaarOCR);
exports.default = router;
