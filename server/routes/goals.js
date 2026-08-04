import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.userId;
  const month = req.query.month;
  const goals = await prisma.goal.findMany({ where: { userId, month }, orderBy: { position: 'asc' } });
  const out = [];
  for (let i = 0; i < 3; i++) out.push(goals.find((g) => g.position === i)?.text || '');
  res.json(out);
});

router.put('/', async (req, res) => {
  const userId = req.userId;
  const { month, goals } = req.body;
  const list = (goals || []).slice(0, 3);
  while (list.length < 3) list.push('');
  for (let i = 0; i < 3; i++) {
    await prisma.goal.upsert({
      where: { userId_month_position: { userId, month, position: i } },
      update: { text: list[i] },
      create: { userId, month, position: i, text: list[i] },
    });
  }
  res.json({ ok: true });
});

export default router;
