import { Router } from 'express';
import { prisma, ensureDefaultHabits } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.userId;
  await ensureDefaultHabits(userId);
  const habits = await prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  const completions = await prisma.habitCompletion.findMany({ where: { userId } });
  const map = {};
  completions.forEach((c) => { map[`${c.habitId}|${c.date}`] = true; });
  res.json({ habits, completions: map });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const h = await prisma.habit.create({ data: { userId: req.userId, name: name || 'New Habit' } });
  res.json(h);
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const h = await prisma.habit.update({
    where: { id: req.params.id, userId: req.userId },
    data: { name: (name || '').trim() || 'Habit' },
  });
  res.json(h);
});

router.post('/toggle', async (req, res) => {
  const userId = req.userId;
  const { habitId, date } = req.body;
  const existing = await prisma.habitCompletion.findUnique({
    where: { userId_habitId_date: { userId, habitId, date } },
  });
  if (existing) {
    await prisma.habitCompletion.delete({ where: { id: existing.id } });
    res.json({ ok: true, value: false });
  } else {
    await prisma.habitCompletion.create({ data: { userId, habitId, date } });
    res.json({ ok: true, value: true });
  }
});

export default router;
