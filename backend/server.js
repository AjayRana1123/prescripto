import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminroute.js";
import doctorRouter from "./routes/doctorroute.js";
import userRouter from "./routes/userroute.js";

// Initialize app
const app = express();

// Connect Database & Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));
// Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("API Working");
});

// IMPORTANT: Export app for Vercel
export default app;