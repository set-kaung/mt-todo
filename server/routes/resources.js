import { Router } from 'express';
import { prisma } from './lib.js';

const router = Router();

router.get('/', async (req, res) => {
  const resources = await prisma.resource.findMany({ where: { userId: req.userId }, orderBy: { name: 'asc' } });
  res.json(resources);
});

router.post('/', async (req, res) => {
  const { name, link } = req.body;
  const r = await prisma.resource.create({
    data: { userId: req.userId, name: name || 'Resource', link: link || '#' },
  });
  res.json(r);
});

router.delete('/:id', async (req, res) => {
  await prisma.resource.delete({ where: { id: req.params.id, userId: req.userId } });
  res.json({ ok: true });
});

export default router;
