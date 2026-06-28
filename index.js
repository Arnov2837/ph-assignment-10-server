import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
// const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/api", dashboardRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", startupRoutes);
app.use("/api", opportunityRoutes);
app.use("/api", applicationRoutes);
app.use("/api", paymentRoutes);

app.get("/", (req, res) => {
  res.send("StartupForge Server is running");
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

export default app;