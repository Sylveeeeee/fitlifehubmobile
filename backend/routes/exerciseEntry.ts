import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/exercise-entry
router.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { category, type, duration, calories, note, timestamp, mealType } = req.body;

  console.log('ExerciseEntry payload:', req.body); // <--- log ตรงนี้


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
    console.error('Create ExerciseEntry error:', err); // <--- log ตรงนี้
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

router.delete('/:id', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const entryId = Number(req.params.id);
  // ตรวจสอบว่า entry นี้เป็นของ user นี้จริง
  const entry = await prisma.exerciseEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  await prisma.exerciseEntry.delete({ where: { id: entryId } });
  res.json({ success: true });
});

// GET /api/exercise-entry/energy-history?range=7d
router.get('/energy-history', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { range = '7d' } = req.query;

  // คำนวณช่วงเวลา
  const now = new Date();
  let startDate = new Date();
  if (range === '7d') startDate.setDate(now.getDate() - 6);
  if (range === '14d') startDate.setDate(now.getDate() - 13);
  if (range === '1m') startDate.setMonth(now.getMonth() - 1);

  startDate.setUTCHours(0, 0, 0, 0);

  try {
    const entries = await prisma.exerciseEntry.findMany({
      where: {
        userId,
        timestamp: { gte: startDate, lte: now },
      },
      orderBy: { timestamp: 'asc' },
    });

    // รวมแคลอรี่ต่อวัน
    const historyMap: Record<string, number> = {};
    entries.forEach((e) => {
      const dateKey = e.timestamp.toISOString().split('T')[0];
      historyMap[dateKey] = (historyMap[dateKey] || 0) + e.calories;
    });

    const history = Object.entries(historyMap).map(([date, burned]) => ({
      date,
      burned,
    }));

    res.json({ history });
  } catch (err) {
    console.error('🚨 Error fetching burned energy history:', err);
    res.status(500).json({ error: 'Failed to fetch burned energy history' });
  }
});
                                
export default router;