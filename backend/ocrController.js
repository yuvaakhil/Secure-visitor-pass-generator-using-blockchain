"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAadhaarOCR = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
// Main OCR controller
const processAadhaarOCR = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No Aadhaar image uploaded" });
        return;
    }
    const imgPath = path_1.default.resolve(file.path);
    const extractFaceScript = path_1.default.resolve(__dirname, "./python/extract_face.py");
    const extractDataScript = path_1.default.resolve(__dirname, "./python/extract_data.py");
    // Step 1: Run face extraction
    (0, child_process_1.exec)(`python "${extractFaceScript}" "${imgPath}"`, (err, stdout, stderr) => {
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
        }
        catch (_a) {
            res.status(500).json({ error: "Invalid face extract response" });
            return;
        }
        // Step 2: Run Aadhaar OCR data extraction
        (0, child_process_1.exec)(`python "${extractDataScript}" "${imgPath}"`, (err2, stdout2, stderr2) => {
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
            }
            catch (_a) {
                res.status(500).json({ error: "Invalid OCR response format" });
            }
        });
    });
});
exports.processAadhaarOCR = processAadhaarOCR;
