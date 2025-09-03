import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/food-entry
router.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { foodId, quantity, mealType, date } = req.body;

  if (!foodId || !quantity || !mealType || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // ✅ เก็บเป็น UTC
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const newEntry = await prisma.foodEntry.create({
      data: {
        userId,
        foodId,
        quantity,
        mealType,
        date: parsedDate,
      },
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/food-entry?date=2025-07-30
router.get('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { date } = req.query;

  try {
    const where: any = { userId };

    if (date) {
      const parsedDate = new Date(date as string);
      const start = new Date(parsedDate);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(parsedDate);
      end.setUTCHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    const entries = await prisma.foodEntry.findMany({
      where,
      include: { food: true },
      orderBy: { date: 'desc' },
    });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE /api/food-entry/:id
router.delete('/:id', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const entryId = Number(req.params.id);
  // ตรวจสอบว่า entry นี้เป็นของ user นี้จริง
  const entry = await prisma.foodEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  await prisma.foodEntry.delete({ where: { id: entryId } });
  res.json({ success: true });
});

// GET /api/food-entry/energy-history?range=7d | 14d | 1m
router.get('/energy-history', authenticateToken, async (req: any, res) => {
  const userId = req.user?.userId;
  const range = req.query.range || '7d';

  const endDate = new Date();
  const startDate = new Date();

  if (range === '7d') startDate.setDate(endDate.getDate() - 6);
  else if (range === '14d') startDate.setDate(endDate.getDate() - 13);
  else if (range === '1m') startDate.setMonth(endDate.getMonth() - 1);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const entries = await prisma.foodEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { food: true },
    });

    const dailyTotals: Record<string, { protein: number; carbs: number; fat: number }> = {};

    for (const entry of entries) {
      const dateKey = entry.date.toISOString().split('T')[0];
      const q = entry.quantity;
      const f = entry.food;

      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = { protein: 0, carbs: 0, fat: 0 };
      }

      dailyTotals[dateKey].protein += f.protein * q;
      dailyTotals[dateKey].carbs += f.carbs * q;
      dailyTotals[dateKey].fat += f.fat * q;
    }

    const history = Object.entries(dailyTotals).map(([date, values]) => ({
      date,
      ...values,
    }));

    res.json({ history });
  } catch (err) {
    console.error('🚨 Energy history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;