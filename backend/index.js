"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ocrRoutes_1 = __importDefault(require("./routes/ocrRoutes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ipfs_upload_1 = __importDefault(require("./routes/ipfs-upload"));
dotenv_1.default.config(); // Load .env
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/ocr", ocrRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads")); // to serve cropped photo
app.use("/uploads", express_1.default.static("uploads"));
app.use("/python/cropped_faces", express_1.default.static("python/cropped_faces"));
app.use("/api/ipfs", ipfs_upload_1.default);
app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
