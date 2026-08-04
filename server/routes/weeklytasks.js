import { Router } from 'express';
import { prisma, ensureWeeklyTasks, weekDatesFromMonday, DAY_CODES } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const monday = req.query.weekStart;
  const dates = weekDatesFromMonday(monday);
  const out = {};
  for (let i = 0; i < 7; i++) {
    const date = dates[i];
    const items = await ensureWeeklyTasks(date);
    out[DAY_CODES[i]] = { date, items: items.map((x) => ({ text: x.text, done: x.done })) };
  }
  res.json(out);
});

router.post('/', async (req, res) => {
  const { date, index, text } = req.body;
  await ensureWeeklyTasks(date);
  await prisma.weeklyTask.updateMany({
    where: { date, index: Number(index) },
    data: { text },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const { date, index } = req.body;
  await ensureWeeklyTasks(date);
  const items = await prisma.weeklyTask.findMany({ where: { date, index: Number(index) } });
  const item = items[0];
  if (item) {
    await prisma.weeklyTask.update({ where: { id: item.id }, data: { done: !item.done } });
  }
  res.json({ ok: true });
});

export default router;
