// generateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userId = process.argv[2]; // user_id from command line

if (!userId) {
  console.error("❌ Please provide a user_id.\nUsage: node generateToken.js <user_id>");
  process.exit(1);
}

const token = jwt.sign(
  { user_id: parseInt(userId) },
  process.env.JWT_SECRET,
  { expiresIn: "1h" } // token valid for 1 hour
);

console.log("✅ JWT Token:\n");
console.log(token);
