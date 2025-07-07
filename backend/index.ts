import express from "express";
import ocrRoutes from "./routes/ocrRoutes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ocr", ocrRoutes);
app.use("/uploads", express.static("uploads")); // to serve cropped photo
app.use("/uploads", express.static("uploads"));
app.use("/python/cropped_faces", express.static("python/cropped_faces"));

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
