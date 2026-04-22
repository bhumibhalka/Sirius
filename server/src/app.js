import express from "express";
import cors from "cors";
import { ENV } from "./lib/ENV.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: [ENV.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}))

export default app;