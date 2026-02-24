import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { register, login, me } from "./controllers/auth";
import { generateContent, getHistory } from "./controllers/generate";
import { authMiddleware } from "./middlewares/auth";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

app.get("/", (req, res) => res.send("Oqituvchi AI API is running..."));

// Routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/me", authMiddleware, me);

app.post("/api/generate", authMiddleware, generateContent);
app.get("/api/history", authMiddleware, getHistory);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
