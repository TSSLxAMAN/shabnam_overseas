import express from "express";
import sendEmail from "../utils/sendEmail";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, city, country, mobile, timezone, date, time } =
      req.body;

    // Validate input (basic)
    if (!name || !email || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Email content
    const subject = "New Appointment Booking";
    const html = `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Timezone:</strong> ${timezone}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    `;

    // Send email
    await sendEmail("shabnammzp@gmail.com", subject, html);

    res.status(200).json({ message: "Appointment booked and email sent!" });
  } catch (error) {
    // console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send appointment email" });
  }
});

export default router;
