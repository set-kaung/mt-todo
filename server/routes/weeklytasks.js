import { Router } from 'express';
import { prisma, ensureWeeklyTasks, weekDatesFromMonday, DAY_CODES } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const monday = req.query.weekStart;
  const dates = weekDatesFromMonday(monday);
  const out = {};
  for (let i = 0; i < 7; i++) {
    const date = dates[i];
    const items = await ensureWeeklyTasks(user_id, date);
    out[DAY_CODES[i]] = { date, items: items.map((x) => ({ text: x.text, done: x.done })) };
  }
  res.json(out);
});

router.post('/', async (req, res) => {
  const user_id = req.userId;
  const { date, index, text } = req.body;
  await ensureWeeklyTasks(user_id, date);
  await prisma.weeklyTask.updateMany({
    where: { user_id, date, index: Number(index) },
    data: { text },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const user_id = req.userId;
  const { date, index } = req.body;
  await ensureWeeklyTasks(user_id, date);
  const items = await prisma.weeklyTask.findMany({ where: { user_id, date, index: Number(index) } });
  const item = items[0];
  if (item) {
    await prisma.weeklyTask.update({ where: { id: item.id }, data: { done: !item.done } });
  }
  res.json({ ok: true });
});

export default router;
