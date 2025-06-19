// models/ReferralCode.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ReferralCode = sequelize.define("ReferralCode", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "referral_codes",
  timestamps: false,
});

module.exports = ReferralCode;
