const sequelize = require("../config/db"); // 👈 Sequelize instance

const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate(); // 🧠 Check DB connection
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Protected routes with JWT
router.post("/generate", authenticateJWT, referralController.generateReferralCode);
router.post("/reset", authenticateJWT, referralController.resetReferralCode);
router.post("/use", authenticateJWT, referralController.useReferralCode);
router.get("/my", authenticateJWT, referralController.getMyReferralCode);
router.get("/referred-by", authenticateJWT, referralController.getWhoReferredMe);
router.get("/referrals", authenticateJWT, referralController.getPeopleIReferred);

module.exports = router;
