const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // ✅ Correct Hostinger SMTP Server
  port: 465, // ✅ Use 465 for SSL, or 587 for TLS
  secure: true, // ✅ true for 465, false for 587
  auth: {
    // user: process.env.EMAIL_USER, // ✅ Your full Hostinger email
    user: "info@adlifetech.com", // ✅ Your full Ho stinger email
    pass: "life@@@123!A", // ✅ Your email password
    // pass: process.env.EMAIL_PASS, // ✅ Your email password
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is Ready to Send Emails");
  }
});
app.post("/send-query", async (req, res) => {
  const { firstName, lastName, number, email, message } = req.body;

  if (!firstName || !lastName || !number || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Query Received - Confirmation",
      text: `Hello ${
        (firstName, lastName)
      },\n\nThank you for reaching out to us. We appreciate your trust in AdLife Technologies.We have received your inquiry, and our team will get back to you shortly.\n\n If you require any further assistance, please feel free to contact us.
\n\nYour message: ${message}\n\nBest Regards,\nAdLife Technologies\nContact: info@adlifetech.com\nPhone: +91 7795974157`,
    });

    // Email to admin (your email)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Query Received",
      text: `Name: ${firstName}\nEmail: ${email}\nMessage: ${message}\nPhone:${number}`,
    });

    res.status(200).json({ message: "Query submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
