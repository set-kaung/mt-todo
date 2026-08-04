import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const date = req.query.date;
  let where = { user_id };
  if (date) where = { user_id, date };
  const sessions = await prisma.focusSession.findMany({ where, orderBy: { created_at: 'asc' } });
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
      user_id: req.userId,
      date,
      category: category || 'General',
      minutes: Number(minutes) || 0,
      type: type || 'focus',
      start_time: startTime || '',
      end_time: endTime || '',
    },
  });
  res.json(s);
});

router.delete('/:id', async (req, res) => {
  await prisma.focusSession.delete({ where: { id: req.params.id, user_id: req.userId } });
  res.json({ ok: true });
});

export default router;
