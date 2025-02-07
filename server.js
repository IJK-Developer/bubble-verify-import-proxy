require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// Shopify Admin API URL and Access Token
const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_STORE}/admin/api/2025-01/graphql.json`;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Proxy route for Shopify Admin API
app.post("/bubble-verify-import-proxy", async (req, res) => {
  try {
    const response = await axios.post(SHOPIFY_API_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ACCESS_TOKEN,
      },
    });
    res.json(response.data); // Send Shopify response back to frontend
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to connect to Shopify API." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`bubble-verify-import-proxy running on port ${PORT}`));
