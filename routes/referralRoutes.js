const express = require("express");
const router = express.Router();
const sequelize = require("../config/db");
const referralController = require("../controllers/referralController");
const authenticateJWT = require("../middleware/authenticateJWT");
const ReferralCode = require("../models/ReferralCode");
const ReferralUsage = require("../models/ReferralUsage");

/**
 * @swagger
 * /api/referrals/health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * @swagger
 * /api/referrals/generate:
 *   post:
 *     summary: Generate a referral code
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Referral code created
 */
router.post("/generate", authenticateJWT, referralController.generateReferralCode);

/**
 * @swagger
 * /api/referrals/reset:
 *   post:
 *     summary: Reset your referral code
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code reset
 */
router.post("/reset", authenticateJWT, referralController.resetReferralCode);

/**
 * @swagger
 * /api/referrals/use:
 *   post:
 *     summary: Use someone else's referral code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referral code used
 */
router.post("/use", authenticateJWT, referralController.useReferralCode);

/**
 * @swagger
 * /api/referrals/my:
 *   get:
 *     summary: View your referral code
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns your referral code
 */
router.get("/my", authenticateJWT, referralController.getMyReferralCode);

/**
 * @swagger
 * /api/referrals/referred-by:
 *   get:
 *     summary: See who referred you
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referrer info
 */
router.get("/referred-by", authenticateJWT, referralController.getWhoReferredMe);

/**
 * @swagger
 * /api/referrals/referrals:
 *   get:
 *     summary: See who you referred
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: People you referred
 */
router.get("/referrals", authenticateJWT, referralController.getPeopleIReferred);

/**
 * @swagger
 * /api/referrals/all-codes:
 *   get:
 *     summary: Get all referral codes (admin)
 *     responses:
 *       200:
 *         description: All referral codes
 */
router.get("/all-codes", async (req, res) => {
  try {
    const codes = await ReferralCode.findAll();
    res.status(200).json(codes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/referrals/all-usages:
 *   get:
 *     summary: Get all referral usages (admin)
 *     responses:
 *       200:
 *         description: All referral usages
 */
router.get("/all-usages", async (req, res) => {
  try {
    const usages = await ReferralUsage.findAll();
    res.status(200).json(usages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;









// const sequelize = require("../config/db"); // 👈 Sequelize instance

// const express = require("express");
// const router = express.Router();
// const referralController = require("../controllers/referralController");
// const authenticateJWT = require("../middleware/authenticateJWT");

// router.get("/health", async (req, res) => {
//   try {
//     await sequelize.authenticate(); // 🧠 Check DB connection
//     res.status(200).json({ status: "ok", db: "connected" });
//   } catch (err) {
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

// // Protected routes with JWT
// router.post("/generate", authenticateJWT, referralController.generateReferralCode);
// router.post("/reset", authenticateJWT, referralController.resetReferralCode);
// router.post("/use", authenticateJWT, referralController.useReferralCode);
// router.get("/my", authenticateJWT, referralController.getMyReferralCode);
// router.get("/referred-by", authenticateJWT, referralController.getWhoReferredMe);
// router.get("/referrals", authenticateJWT, referralController.getPeopleIReferred);

// module.exports = router;
