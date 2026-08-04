import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.userId;
  const date = req.query.date;
  let where = { userId };
  if (date) where = { userId, date };
  const sessions = await prisma.focusSession.findMany({ where, orderBy: { createdAt: 'asc' } });
  const totalMinutes = sessions.filter((s) => s.type === 'focus').reduce((a, s) => a + s.minutes, 0);
  const byCategory = {};
  sessions.filter((s) => s.type === 'focus').forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] || 0) + s.minutes;
  });
  res.json({ sessions, totalMinutes, byCategory });
});

router.post('/', async (req, res) => {
  const { date, category, minutes, type, startTime, endTime } = req.body;
  const s = await prisma.focusSession.create({
    data: {
      userId: req.userId,
      date,
      category: category || 'General',
      minutes: Number(minutes) || 0,
      type: type || 'focus',
      startTime: startTime || '',
      endTime: endTime || '',
    },
  });
  res.json(s);
});

router.delete('/:id', async (req, res) => {
  await prisma.focusSession.delete({ where: { id: req.params.id, userId: req.userId } });
  res.json({ ok: true });
});

export default router;
