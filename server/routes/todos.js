import { Router } from 'express';
import { prisma, ensureTodos } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const date = req.query.date;
  const items = await ensureTodos(user_id, date);
  res.json(items.map((x) => ({ text: x.text, done: x.done })));
});

router.post('/', async (req, res) => {
  const user_id = req.userId;
  const { date, index, text } = req.body;
  await ensureTodos(user_id, date);
  await prisma.todoItem.updateMany({
    where: { user_id, date, index: Number(index) },
    data: { text },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const user_id = req.userId;
  const { date, index } = req.body;
  await ensureTodos(user_id, date);
  const items = await prisma.todoItem.findMany({ where: { user_id, date, index: Number(index) } });
  const item = items[0];
  if (item) {
    await prisma.todoItem.update({ where: { id: item.id }, data: { done: !item.done } });
  }
  res.json({ ok: true });
});

export default router;
