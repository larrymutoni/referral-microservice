const express = require("express");
const app = express();
const referralRoutes = require("./routes/referralRoutes");

app.use(express.json());
app.use("/api/referrals", referralRoutes);

module.exports = app;
