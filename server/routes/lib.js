import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const FIXED_BULLETS = 6;
export const FIXED_TODOS = 8;

export async function ensureWeeklyTasks(date, n = FIXED_BULLETS) {
  const existing = await prisma.weeklyTask.findMany({ where: { date }, orderBy: { index: 'asc' } });
  if (existing.length >= n) return existing;
  const toCreate = [];
  for (let i = 0; i < n; i++) {
    if (!existing.find((x) => x.index === i)) toCreate.push({ date, index: i });
  }
  if (toCreate.length) {
    await prisma.weeklyTask.createMany({ data: toCreate });
  }
  return prisma.weeklyTask.findMany({ where: { date }, orderBy: { index: 'asc' } });
}

export async function ensureTodos(date, n = FIXED_TODOS) {
  const existing = await prisma.todoItem.findMany({ where: { date }, orderBy: { index: 'asc' } });
  if (existing.length >= n) return existing;
  const toCreate = [];
  for (let i = 0; i < n; i++) {
    if (!existing.find((x) => x.index === i)) toCreate.push({ date, index: i });
  }
  if (toCreate.length) {
    await prisma.todoItem.createMany({ data: toCreate });
  }
  return prisma.todoItem.findMany({ where: { date }, orderBy: { index: 'asc' } });
}

export async function ensureDefaultHabits() {
  const names = ['Exercise', 'Water', 'Reading', 'Language', 'Drawing'];
  const existing = await prisma.habit.findMany({ where: { name: { in: names } } });
  const missing = names.filter((n) => !existing.find((h) => h.name === n));
  for (const name of missing) {
    await prisma.habit.create({ data: { name } });
  }
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
