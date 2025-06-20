// scripts/dropTables.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false,
    },
    logging: false,
  }
);

async function dropTables() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");

    await sequelize.query("DROP TABLE IF EXISTS referral_usages");
    console.log("✅ Dropped table: referral_usages");

    await sequelize.query("DROP TABLE IF EXISTS referral_codes");
    console.log("✅ Dropped table: referral_codes");

    await sequelize.close();
    console.log("✅ Done. Connection closed.");
  } catch (err) {
    console.error("❌ Failed to drop tables:", err);
    process.exit(1);
  }
}

dropTables();
