// models/ReferralUsage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ReferralUsage = sequelize.define("ReferralUsage", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  referred_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code_used: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: "referral_usages",
  timestamps: false,
});

module.exports = ReferralUsage;
