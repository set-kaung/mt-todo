import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const user_id = req.userId;
  const date = req.query.date;
  const items = await prisma.todoItem.findMany({
    where: { user_id, date },
    orderBy: { index: 'asc' },
  });
  res.json(items.map((x) => ({ index: x.index, text: x.text, done: x.done })));
});

router.post('/', async (req, res) => {
  const user_id = req.userId;
  const { date, index, text } = req.body;
  await prisma.todoItem.upsert({
    where: { user_id_date_index: { user_id, date, index: Number(index) } },
    update: { text },
    create: { user_id, date, index: Number(index), text, done: false },
  });
  res.json({ ok: true });
});

router.post('/toggle', async (req, res) => {
  const user_id = req.userId;
  const { date, index } = req.body;
  const item = await prisma.todoItem.findUnique({
    where: { user_id_date_index: { user_id, date, index: Number(index) } },
  });
  if (item) {
    await prisma.todoItem.update({ where: { id: item.id }, data: { done: !item.done } });
  } else {
    await prisma.todoItem.create({ data: { user_id, date, index: Number(index), text: '', done: true } });
  }
  res.json({ ok: true });
});

export default router;
