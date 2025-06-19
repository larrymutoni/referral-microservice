const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const authenticateJWT = require("../middleware/authenticateJWT");

// Protected routes with JWT
router.post("/generate", authenticateJWT, referralController.generateReferralCode);
router.post("/reset", authenticateJWT, referralController.resetReferralCode);
router.post("/use", authenticateJWT, referralController.useReferralCode);
router.get("/my", authenticateJWT, referralController.getMyReferralCode);
router.get("/referred-by", authenticateJWT, referralController.getWhoReferredMe);
router.get("/referrals", authenticateJWT, referralController.getPeopleIReferred);

module.exports = router;
