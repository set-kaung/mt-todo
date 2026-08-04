import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const userId = req.userId;
  const month = req.query.month;
  let where = { userId };
  if (month) where = { userId, date: { startsWith: month } };
  const events = await prisma.event.findMany({ where, orderBy: [{ priority: 'asc' }, { date: 'asc' }] });
  res.json(events);
});

router.post('/', async (req, res) => {
  const { name, date, time, priority, color } = req.body;
  const ev = await prisma.event.create({
    data: {
      userId: req.userId,
      name: name || 'Untitled',
      date,
      time: time || '',
      priority: Number(priority) || 2,
      color: color || '#f9a8d4',
    },
  });
  res.json(ev);
});

router.delete('/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id, userId: req.userId } });
  res.json({ ok: true });
});

export default router;
