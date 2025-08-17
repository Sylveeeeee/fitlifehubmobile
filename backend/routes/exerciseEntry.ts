import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/exercise-entry
router.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { category, type, duration, calories, note, timestamp, mealType  } = req.body;

  if (!category || !type || !duration || !calories || !timestamp || !mealType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const entry = await prisma.exerciseEntry.create({
      data: {
        userId,
        category,
        type,
        duration,
        calories,
        note,
        timestamp: new Date(timestamp),
        mealType,
      },
    });
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create exercise entry' });
  }
});

// GET /api/exercise-entry?date=YYYY-MM-DD
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
      where.timestamp = { gte: start, lte: end };
    }
    const entries = await prisma.exerciseEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise entries' });
  }
});

export default router;