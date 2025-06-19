const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Generate referral code (one per user)
exports.generateReferralCode = async (req, res) => {
  const userId = req.user.id; // 🔐 from JWT

  try {
    const [existing] = await db.query(
      "SELECT * FROM referral_codes WHERE user_id = ?",
      [userId]
    );
    if (existing.length) return res.status(200).json(existing[0]);

    const code = uuidv4().slice(0, 10); // Short UUID
    await db.query("INSERT INTO referral_codes (user_id, code) VALUES (?, ?)", [
      userId,
      code,
    ]);

    res.status(201).json({ user_id: userId, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset referral code
exports.resetReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const newCode = uuidv4().slice(0, 10);
    await db.query("UPDATE referral_codes SET code = ? WHERE user_id = ?", [
      newCode,
      userId,
    ]);

    res.status(200).json({ user_id: userId, new_code: newCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Use someone’s referral code
exports.useReferralCode = async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;

  try {
    // Check if already used a code
    const [existing] = await db.query(
      "SELECT * FROM referral_usages WHERE user_id = ?",
      [userId]
    );
    if (existing.length)
      return res.status(400).json({ message: "You already used a referral code." });

    // Check if code exists
    const [rows] = await db.query(
      "SELECT * FROM referral_codes WHERE code = ?",
      [code]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Referral code not found." });

    const referrerId = rows[0].user_id;

    if (referrerId === userId)
      return res.status(400).json({ message: "Cannot refer yourself." });

    await db.query(
      "INSERT INTO referral_usages (user_id, referred_by, code_used) VALUES (?, ?, ?)",
      [userId, referrerId, code]
    );

    res.status(201).json({ message: `Referred by user ${referrerId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See your own referral code
exports.getMyReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM referral_codes WHERE user_id = ?",
      [userId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "No referral code found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See who referred you
exports.getWhoReferredMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM referral_usages WHERE user_id = ?",
      [userId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Not referred by anyone" });

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// See who you referred
exports.getPeopleIReferred = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM referral_usages WHERE referred_by = ?",
      [userId]
    );

    res.status(200).json({ count: rows.length, referred: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
