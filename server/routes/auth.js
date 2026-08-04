import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "./lib.js";
import { authenticate, generateToken } from "./authMiddleware.js";

const router = Router();
const SIGNUP_API_KEY = process.env.SIGNUP_API_KEY;

function requireSignupKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!SIGNUP_API_KEY) {
    return res.status(500).json({ error: "Signup is disabled: SIGNUP_API_KEY not set" });
  }
  if (key !== SIGNUP_API_KEY) {
    return res.status(401).json({ error: "Invalid signup key" });
  }
  next();
}

router.post("/signup", requireSignupKey, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: "Email and password (min 6 chars) required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});

router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.put("/email", authenticate, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and current password required" });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== req.userId) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const updated = await prisma.user.update({
    where: { id: req.userId },
    data: { email },
    select: { id: true, email: true, createdAt: true },
  });

  res.json(updated);
});

router.put("/password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Current password and new password (min 6 chars) required" });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid current password" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.userId },
    data: { passwordHash },
  });

  res.json({ ok: true });
});

export default router;
