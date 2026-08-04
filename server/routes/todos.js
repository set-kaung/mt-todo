import { Router } from 'express';
import { prisma, ensureTodos } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const date = req.query.date;
  const items = await ensureTodos(date);
  res.json(items.map((x) => ({ text: x.text, done: x.done })));
});

router.post('/', async (req, res) => {
  const { date, index, text } = req.body;
  await ensureTodos(date);
  await prisma.todoItem.updateMany({
    where: { date, index: Number(index) },
    data: { text },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const { date, index } = req.body;
  await ensureTodos(date);
  const items = await prisma.todoItem.findMany({ where: { date, index: Number(index) } });
  const item = items[0];
  if (item) {
    await prisma.todoItem.update({ where: { id: item.id }, data: { done: !item.done } });
  }
  res.json({ ok: true });
});

export default router;
