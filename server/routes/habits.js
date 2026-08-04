import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const habits = await prisma.habit.findMany({ where: { user_id }, orderBy: { created_at: 'asc' } });
  const completions = await prisma.habitCompletion.findMany({ where: { user_id } });
  const map = {};
  completions.forEach((c) => { map[`${c.habit_id}|${c.date}`] = true; });
  res.json({ habits, completions: map });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const h = await prisma.habit.create({ data: { user_id: req.userId, name: name || 'New Habit' } });
  res.json(h);
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  const h = await prisma.habit.update({
    where: { id: req.params.id, user_id: req.userId },
    data: { name: (name || '').trim() || 'Habit' },
  });
  res.json(h);
});

router.delete('/:id', async (req, res) => {
  await prisma.habit.delete({
    where: { id: req.params.id, user_id: req.userId },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const user_id = req.userId;
  const { habitId, date } = req.body;
  const existing = await prisma.habitCompletion.findUnique({
    where: { user_id_habit_id_date: { user_id, habit_id: habitId, date } },
  });
  if (existing) {
    await prisma.habitCompletion.delete({ where: { id: existing.id } });
    res.json({ ok: true, value: false });
  } else {
    await prisma.habitCompletion.create({ data: { user_id, habit_id: habitId, date } });
    res.json({ ok: true, value: true });
  }
});

export default router;
