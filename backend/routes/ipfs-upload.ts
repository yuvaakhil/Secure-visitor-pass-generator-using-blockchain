import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("photo"), (req, res) => {
  (async () => {
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const data = new FormData();
      data.append("file", fs.createReadStream(filePath));

      const result = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(data as any)._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY || "",
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY || "",
        },
      });

      fs.unlinkSync(filePath); // Delete local file
      res.json({ cid: result.data.IpfsHash });
    } catch (err: any) {
      console.error("Upload error:", err?.response?.data || err.message);
      res.status(500).json({ error: "Failed to upload to IPFS" });
    }
  })(); // IIFE (Immediately Invoked Async Function)
});

export default router;
