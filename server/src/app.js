import express from "express";
import cors from "cors";
import { ENV } from "./lib/ENV.js";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/auth.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
console.log("FRONTEND URL:", ENV.FRONTEND_URL);
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}))

app.use("/api/v1/auth", userRoutes);

app.use(errorMiddleware);

export default app;