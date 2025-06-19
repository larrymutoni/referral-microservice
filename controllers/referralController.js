const { v4: uuidv4 } = require("uuid");
const ReferralCode = require("../models/ReferralCode");
const ReferralUsage = require("../models/ReferralUsage");

// Generate referral code
exports.generateReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const existing = await ReferralCode.findOne({ where: { user_id: userId } });
    if (existing) return res.status(200).json(existing);

    const code = uuidv4().slice(0, 10);
    const newCode = await ReferralCode.create({ user_id: userId, code });

    res.status(201).json(newCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset referral code
exports.resetReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const newCode = uuidv4().slice(0, 10);
    const [updated] = await ReferralCode.update(
      { code: newCode },
      { where: { user_id: userId } }
    );

    if (!updated) return res.status(404).json({ message: "No referral code found" });

    res.status(200).json({ user_id: userId, new_code: newCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Use someone's referral code
exports.useReferralCode = async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  try {
    const existingUsage = await ReferralUsage.findOne({ where: { user_id: userId } });
    if (existingUsage) {
      return res.status(400).json({ message: "You already used a referral code." });
    }

    const referrer = await ReferralCode.findOne({ where: { code } });
    if (!referrer) {
      return res.status(404).json({ message: "Referral code not found." });
    }

    if (referrer.user_id === userId) {
      return res.status(400).json({ message: "Cannot refer yourself." });
    }

    await ReferralUsage.create({
      user_id: userId,
      referred_by: referrer.user_id,
      code_used: code,
    });

    res.status(201).json({ message: `Referred by user ${referrer.user_id}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See your own referral code
exports.getMyReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const code = await ReferralCode.findOne({ where: { user_id: userId } });
    if (!code) {
      return res.status(404).json({ message: "No referral code found" });
    }

    res.status(200).json(code);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See who referred you
exports.getWhoReferredMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const usage = await ReferralUsage.findOne({ where: { user_id: userId } });
    if (!usage) {
      return res.status(404).json({ message: "Not referred by anyone" });
    }

    res.status(200).json(usage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See who you referred
exports.getPeopleIReferred = async (req, res) => {
  const userId = req.user.id;

  try {
    const referrals = await ReferralUsage.findAll({ where: { referred_by: userId } });

    res.status(200).json({
      count: referrals.length,
      referred: referrals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
