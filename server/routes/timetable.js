import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const slots = await prisma.timetableSlot.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'asc' } });
  res.json(slots);
});

router.post('/', async (req, res) => {
  const { name, day, start, end, color, startDate, endDate } = req.body;
  const slot = await prisma.timetableSlot.create({
    data: {
      userId: req.userId,
      name: name || 'Untitled',
      day,
      start,
      end,
      color: color || '#c7d2fe',
      startDate: startDate || '',
      endDate: endDate || '',
    },
  });
  res.json(slot);
});

router.delete('/:id', async (req, res) => {
  await prisma.timetableSlot.delete({ where: { id: req.params.id, userId: req.userId } });
  res.json({ ok: true });
});

export default router;
