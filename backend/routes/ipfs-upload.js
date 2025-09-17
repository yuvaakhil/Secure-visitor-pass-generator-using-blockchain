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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/upload", upload.single("photo"), (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            if (!filePath) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }
            const data = new form_data_1.default();
            data.append("file", fs_1.default.createReadStream(filePath));
            const result = yield axios_1.default.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: process.env.PINATA_API_KEY || "",
                    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY || "",
                },
            });
            fs_1.default.unlinkSync(filePath); // Delete local file
            res.json({ cid: result.data.IpfsHash });
        }
        catch (err) {
            console.error("Upload error:", ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message);
            res.status(500).json({ error: "Failed to upload to IPFS" });
        }
    }))(); // IIFE (Immediately Invoked Async Function)
});
exports.default = router;
