const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// Middleware to parse JSON payload
app.use(bodyParser.json());

// Webhook endpoint (Terraform will send data here)
app.post("/webhook", (req, res) => {
  console.log("🔔 Terraform Webhook Received!");
  console.log("📥 Payload:", res);

  // Respond to Terraform
  res.status(200).json({ message: "Webhook received successfully!", res });
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "✅ Webhook server is live!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server is running on http://localhost:${PORT}`);
});
