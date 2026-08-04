import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const FIXED_BULLETS = 6;
export const FIXED_TODOS = 8;

export async function ensureWeeklyTasks(userId, date, n = FIXED_BULLETS) {
  const existing = await prisma.weeklyTask.findMany({ where: { userId, date }, orderBy: { index: 'asc' } });
  if (existing.length >= n) return existing;
  const toCreate = [];
  for (let i = 0; i < n; i++) {
    if (!existing.find((x) => x.index === i)) toCreate.push({ userId, date, index: i });
  }
  if (toCreate.length) {
    await prisma.weeklyTask.createMany({ data: toCreate });
  }
  return prisma.weeklyTask.findMany({ where: { userId, date }, orderBy: { index: 'asc' } });
}

export async function ensureTodos(userId, date, n = FIXED_TODOS) {
  const existing = await prisma.todoItem.findMany({ where: { userId, date }, orderBy: { index: 'asc' } });
  if (existing.length >= n) return existing;
  const toCreate = [];
  for (let i = 0; i < n; i++) {
    if (!existing.find((x) => x.index === i)) toCreate.push({ userId, date, index: i });
  }
  if (toCreate.length) {
    await prisma.todoItem.createMany({ data: toCreate });
  }
  return prisma.todoItem.findMany({ where: { userId, date }, orderBy: { index: 'asc' } });
}

export function weekDatesFromMonday(mondayStr) {
  const start = new Date(mondayStr + 'T00:00:00');
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const DAY_CODES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
