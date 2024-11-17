import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import questionPackageRoutes from "./routes/QuestionPackageRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import videoRoutes from "./routes/videoRoutes";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

const mongoUrl = process.env.MONGOOSE_URL as string;
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB bağlantısı başarıyla sağlandı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// Yalnızca yetkilendirme gerektiren yollarda authMiddleware kullan
app.use("/api/admin", adminRoutes);

app.use(cookieParser());

app.use(authMiddleware);

app.use("/api", questionPackageRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World from app.ts!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});

export default app;
