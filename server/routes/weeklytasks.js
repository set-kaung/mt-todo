import { Router } from 'express';
import { prisma, weekDatesFromMonday, DAY_CODES } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const monday = req.query.weekStart;
  const dates = weekDatesFromMonday(monday);
  const out = {};
  for (let i = 0; i < 7; i++) {
    const date = dates[i];
    const items = await prisma.weeklyTask.findMany({
      where: { user_id, date },
      orderBy: { index: 'asc' },
    });
    out[DAY_CODES[i]] = { date, items: items.map((x) => ({ index: x.index, text: x.text, done: x.done })) };
  }
  res.json(out);
});

router.post('/', async (req, res) => {
  const user_id = req.userId;
  const { date, index, text } = req.body;
  await prisma.weeklyTask.upsert({
    where: { user_id_date_index: { user_id, date, index: Number(index) } },
    update: { text },
    create: { user_id, date, index: Number(index), text, done: false },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const user_id = req.userId;
  const { date, index } = req.body;
  const item = await prisma.weeklyTask.findUnique({
    where: { user_id_date_index: { user_id, date, index: Number(index) } },
  });
  if (item) {
    await prisma.weeklyTask.update({ where: { id: item.id }, data: { done: !item.done } });
  } else {
    await prisma.weeklyTask.create({ data: { user_id, date, index: Number(index), text: '', done: true } });
  }
  res.json({ ok: true });
});

export default router;
