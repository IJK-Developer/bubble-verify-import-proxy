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
    // Log detailed error info and raw HTML response body if possible
    console.error("Error:", error.response?.status, error.response?.data || error.message);

    // Log the raw HTML (if it’s an HTML error page, you’ll see it here)
    if (error.response?.data) {
      console.error("Raw response body:", error.response.data);
    }

    // Send an error response to the frontend
    res.status(500).json({
      error: "Failed to connect to Shopify API.",
      details: error.response?.data || error.message, // Sending error details for debugging
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`bubble-verify-import-proxy running on port ${PORT}`));
