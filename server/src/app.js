import express from "express";
import cors from "cors";
import path from 'path';
import { ENV } from "./lib/ENV.js";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import paymentRoutes from "./routes/payment.route.js";
import postRoutes from "./routes/social-media-routes/post.route.js";
import profileRoutes from "./routes/social-media-routes/profile.route.js";
import socialUserRoutes from "./routes/social-media-routes/user.route.js"
import commentRoutes from "./routes/social-media-routes/comment.route.js";
import saveRoutes from "./routes/social-media-routes/save.route.js";
import orderRoutes from "./routes/order.route.js";
import adminRoutes from "./routes/admin.route.js";
import followRoutes from "./routes/social-media-routes/follow.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import { handleStripeWebhook } from "./controllers/payment.controller.js";


const app = express();
app.use(cors({
  origin: [ENV.FRONTEND_URL, "shopconnect-psi.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}))

app.post('/api/v1/payment/stripe/webhook',
  express.raw({type: "application/json"}),
  handleStripeWebhook
)

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
  parseNested: true, 
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/user", socialUserRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/save", saveRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/follow", followRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "client", "dist")));


app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(errorMiddleware);

export default app;