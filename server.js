// Tiny Express receiver for contact form submissions
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  // Basic CORS for local testing
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let mailer = null;
try {
  const nodemailer = require("nodemailer");
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    mailer = transporter;
    console.log("Mailer configured (SMTP_HOST present)");
  }
} catch (e) {
  console.log("nodemailer not installed or failed to load — email disabled");
}

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  console.log("[contact] received", { name, email, message });
  if (!name || !email || !message) {
    return res.status(400).json({ error: "missing_fields" });
  }

  if (mailer) {
    const from =
      process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@localhost";
    const to = process.env.TO_EMAIL || process.env.SMTP_USER || from;
    const subject = `Website contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    try {
      await mailer.sendMail({ from, to, subject, text });
      return res.json({ status: "ok" });
    } catch (err) {
      console.error("Failed to send email", err);
      return res.status(502).json({ error: "email_send_failed" });
    }
  }

  // Fallback: no SMTP configured — just acknowledge and log
  console.log("[contact] SMTP not configured — logged only");
  return res.json({ status: "ok", note: "no_smtp_configured" });
});

app.get("/ping", (req, res) => res.send("pong"));

app.listen(port, () =>
  console.log(`Contact API listening on http://localhost:${port}`),
);
