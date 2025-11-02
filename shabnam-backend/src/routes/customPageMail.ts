// routes/customPageMail.ts
import express from "express";
import multer from "multer";
import sendEmail from "../utils/sendEmail";

const router = express.Router();

// Configure multer for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    // Extract data from req.body
    const {
      firstName,
      lastName,
      email,
      country,
      phoneCode,
      phoneNumber,
      appointmentDateTime,
      timeZone,
      designDescription,
    } = req.body;

    // Validate input (basic)
    if (!firstName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prepare attachments from the uploaded files
    const attachments = req.files
      ? (req.files as Express.Multer.File[]).map((file) => ({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        }))
      : [];

    // Email content
    const subject = "Custom Page Submission";
    const html = `
      <h2>New Custom Page Submission</h2>
      <p><b>Name:</b> ${firstName} ${lastName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Country:</b> ${country}</p>
      <p><b>Phone Number:</b> ${phoneCode} ${phoneNumber}</p>
      <p><b>Appointment Date/Time:</b> ${appointmentDateTime}</p>
      <p><b>Timezone:</b> ${timeZone}</p>
      <p><b>Design Description:</b> ${designDescription}</p>
    `;

    // Send email
    // The sendEmail function now expects an array of attachments
    await sendEmail("shabnammzp@gmail.com", subject, html, attachments);

    res.status(200).json({ message: "Submission successful and email sent!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send custom page email" });
  }
});

export default router;
