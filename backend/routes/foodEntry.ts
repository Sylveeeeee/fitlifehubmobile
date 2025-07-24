import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/food-entry
router.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId; // ดึง userId จาก token
  const { foodId, quantity, mealType, date } = req.body;

  if (!foodId || !quantity || !mealType || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    const newEntry = await prisma.foodEntry.create({
      data: {
        userId,
        foodId,
        quantity,
        mealType,
        date: new Date(date),
      },
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/food-entry?date=2025-07-22
router.get('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { date } = req.query;

  try {
    const where: any = { userId };

    if (date) {
      const parsedDate = new Date(date as string);
      const start = new Date(parsedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(parsedDate);
      end.setHours(23, 59, 59, 999);

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

export default router;