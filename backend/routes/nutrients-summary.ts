import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /api/nutrients/summary?userId=1&date=2025-06-11
router.get('/summary', async (req, res) => {
  const { userId, date } = req.query;
  if (!userId || !date) {
    return res.status(400).json({ error: 'Missing userId or date' });
  }
  try {
    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: Number(userId),
        date: {
          gte: new Date(date as string),
          lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    // รวมสารอาหาร
    const summary = entries.reduce(
        (
            acc: { calories: number; protein: number; fat: number; carbs: number; fiber: number },
            cur: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
        ) => ({
            calories: acc.calories + cur.calories,
            protein: acc.protein + cur.protein,
            fat: acc.fat + cur.fat,
            carbs: acc.carbs + cur.carbs,
            fiber: acc.fiber + (cur.fiber || 0),
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
        );

    res.json(summary);
  } catch (error) {
    console.error('Get nutrients summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;