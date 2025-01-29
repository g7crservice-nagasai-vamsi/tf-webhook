// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 4000;

// // Middleware to parse JSON payload
// app.use(bodyParser.json());

// // Webhook endpoint (Terraform will send data here)
// app.post("/webhook", (req, res) => {
//   console.log("🔔 Terraform Webhook Received!");
//   console.log("📥 Payload:", res);

//   // Respond to Terraform
//   res.status(200).json({ message: "Webhook received successfully!", res });
// });

// app.get("/test", (req, res) => {
//   res.status(200).json({ message: "✅ Webhook server is live!" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Webhook server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();

// Middleware to get raw body for HMAC validation
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Webhook endpoint
app.post("/tf-webhook", (req, res) => {
  const secret = "vamsi"; // Replace with your Terraform Cloud secret
  const signature = req.headers["x-tfc-notification-signature"];

  // Validate HMAC
  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(req.rawBody);
  const computedSignature = hmac.digest("hex");

  if (signature !== computedSignature) {
    console.error("Invalid signature! Potential security issue.");
    return res.status(403).send("Forbidden");
  }

  // If valid, process the payload
  const payload = req.body;
  console.log("Received Terraform Cloud Webhook:", payload);

  // Extract run ID and status
  const runId = payload.payload.run_id;
  const status = payload.payload.status;

  // Send acknowledgment
  res.status(200).send("Webhook received!");

  // Optional: Fetch detailed run data using Terraform Cloud API
  // fetchRunDetails(runId);
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "✅ Webhook server is live!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
