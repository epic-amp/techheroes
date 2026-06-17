const express = require("express");
const { sql } = require("../db");
const { signToken, checkPassword, asyncHandler } = require("../auth");
const { authenticate } = require("../middleware");

const router = express.Router();

router.post(
  "/login/student",
  asyncHandler(async (req, res) => {
    const { studentId, password } = req.body || {};
    if (!studentId || !password) return res.status(400).json({ error: "studentId and password are required" });

    const rows = await sql`
      SELECT * FROM users WHERE role='student' AND student_id = ${String(studentId).toUpperCase()} LIMIT 1`;
    const user = rows[0];
    if (!user || !checkPassword(password, user.password))
      return res.status(401).json({ error: "Invalid student ID or password" });
    if (user.status !== "active") return res.status(403).json({ error: "Account is inactive" });

    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

router.post(
  "/login/tutor",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const rows = await sql`SELECT * FROM users WHERE role='tutor' AND lower(email)=lower(${email}) LIMIT 1`;
    const user = rows[0];
    if (!user || !checkPassword(password, user.password))
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

module.exports = router;
