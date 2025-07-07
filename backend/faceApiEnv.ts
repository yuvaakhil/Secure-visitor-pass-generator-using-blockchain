// faceApiEnv.ts
import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";

// 🛑 Fully disable TS checking for the monkey patch line
// @ts-ignore
faceapi.env.monkeyPatch({
  Canvas: canvas.Canvas,
  Image: canvas.Image,
  ImageData: canvas.ImageData
});
