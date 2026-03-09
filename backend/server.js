import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminroute.js";
import doctorRouter from "./routes/doctorroute.js";
import userRouter from "./routes/userroute.js";

const app = express();

connectDB();
connectCloudinary();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://prescripto-admin.vercel.app",
      "https://prescripto-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

export default app;