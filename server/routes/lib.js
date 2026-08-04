import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

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
