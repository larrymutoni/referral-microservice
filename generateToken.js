// generateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const uuid = process.argv[2]; // Pass uuid from CLI

if (!uuid) {
  console.error("❌ Please provide a UUID.\nUsage: node generateToken.js <uuid>");
  process.exit(1);
}

const payload = {
  uuid,
  email: "user@example.com",
  userType: "customer",
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

console.log("\n✅ JWT Token:\n");
console.log(token);
