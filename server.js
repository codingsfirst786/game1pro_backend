import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bankRoutes from "./routes/bankRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import agentHistoryRoutes from "./routes/agentHistoryRoutes.js";
import removeCoinRoutes from "./routes/removeCoinRoutes.js";
import adminRoutesauth from "./routes/adminRoutesauth.js";
import agentRoutes_v2 from "./routes/agentRoutes_v2.js";
import coinRoutes_v2 from "./routes/coinRoutes_v2.js";
import orderRoutes from "./routes/orderRoutes.js";
import agentRoutesV2 from "./routes/agentRoutes_v2.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();
const app = express();

// enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/accounts", bankRoutes);
app.use("/api/users", userRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", agentRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/agents/history", agentHistoryRoutes); 
app.use("/api/remove-coins", removeCoinRoutes);
app.use("/api/admins", adminRoutesauth);
app.use("/api/v2/agents-v2", agentRoutesV2);
app.use("/api/game", gameRoutes);


// 🔥 Fix here → use /api/agents-v2 (matches your frontend)
app.use("/api/agents-v2", agentRoutes_v2);

// if you still need coinRoutes_v2, mount properly
app.use("/api/coins-v2", coinRoutes_v2);

app.use("/api/orders", orderRoutes);

// ✅ Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
