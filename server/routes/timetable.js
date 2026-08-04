import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const slots = await prisma.timetableSlot.findMany({ where: { user_id: req.userId }, orderBy: { created_at: 'asc' } });
  res.json(slots);
});

router.post('/', async (req, res) => {
  const { name, day, start, end, color, startDate, endDate } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
  if (!day) return res.status(400).json({ error: 'Day is required.' });
  if (!start) return res.status(400).json({ error: 'Start time is required.' });
  if (!end) return res.status(400).json({ error: 'End time is required.' });
  const slot = await prisma.timetableSlot.create({
    data: {
      user_id: req.userId,
      name: name.trim(),
      day,
      start,
      end,
      color: color || '#c7d2fe',
      start_date: startDate || '',
      end_date: endDate || '',
    },
  });
  res.json(slot);
});

router.delete('/:id', async (req, res) => {
  await prisma.timetableSlot.delete({ where: { id: req.params.id, user_id: req.userId } });
  res.json({ ok: true });
});

export default router;
