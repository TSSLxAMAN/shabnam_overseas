// src/routes/vipSignup.ts
import express from "express";
import sendEmail from "../utils/sendEmail";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const subject = "New Shabnam VIP Signup";
    const html = `
      <h3>A new user has joined the VIP list!</h3>
      <p><b>Email:</b> ${email}</p>
    `;

    // Send email to the admin
    await sendEmail("shabnammzp@gmail.com", subject, html);

    res.status(200).json({ message: "VIP signup successful!" });
  } catch (error) {
    // console.error("VIP signup email error:", error);
    res.status(500).json({ message: "Failed to process VIP signup" });
  }
});

export default router;
