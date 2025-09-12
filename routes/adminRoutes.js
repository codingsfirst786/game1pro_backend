import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Dashboard route
router.get("/dashboard", getDashboardStats);

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//  withdrawals

router.get("/withdrawals", async (req, res) => {
  try {
    // Find users who have at least one withdrawal
    const users = await User.find({ "withdrawals.0": { $exists: true } });

    // Flatten withdrawals with user info
    const allWithdrawals = [];
    users.forEach((user) => {
      user.withdrawals.forEach((w) => {
        allWithdrawals.push({
          _id: w._id,
          userNumber: user.userNumber,
          username: user.username,
          bank: w.account.bank,
          accountNumber: w.account.number,
          accountHolder: w.account.holder,
          country: w.account.country,
          amount: w.amount,
          status: w.status,
          createdAt: w.createdAt,
        });
      });
    });

    res.json({ success: true, withdrawals: allWithdrawals });
  } catch (err) {
    console.error("Error fetching withdrawals:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update user status (block ↔ active)
router.put("/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "block"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
