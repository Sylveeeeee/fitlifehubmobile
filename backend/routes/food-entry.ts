import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// POST /api/food-entry
router.post('/', async (req, res) => {
  const { userId, foodId, quantity = 1, date } = req.body;
  if (!userId || !foodId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // ดึงข้อมูลอาหารจาก Food
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    // คำนวณสารอาหารตามจำนวนที่กิน
    const entry = await prisma.foodEntry.create({
      data: {
        userId,
        name: food.name,
        calories: Math.round(food.calories * quantity),
        protein: food.protein * quantity,
        fat: food.fat * quantity,
        carbs: food.carbs * quantity,
        fiber: food.fiber ? food.fiber * quantity : null,
        date: new Date(date),
      },
    });
    res.json(entry);
  } catch (error) {
    console.error('Create food entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/food-entry?userId=1&date=2025-06-11
router.get('/', async (req, res) => {
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
      orderBy: { createdAt: 'asc' },
    });
    res.json(entries);
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;