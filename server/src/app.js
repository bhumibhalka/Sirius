import express from "express";
import cors from "cors";
import { ENV } from "./lib/ENV.js";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
console.log("FRONTEND URL:", ENV.FRONTEND_URL);
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}))

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);

app.use(errorMiddleware);

export default app;