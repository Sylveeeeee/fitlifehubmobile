import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/food-entry
router.post('/', async (req, res) => {
  const { userId, foodId, quantity, mealType, date } = req.body;

  if (!userId || !foodId || !quantity || !mealType || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ตรวจสอบว่า foodId ที่ส่งมามีอยู่ในฐานข้อมูลหรือไม่
    const food = await prisma.food.findUnique({ where: { id: foodId } });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // สร้าง food entry ใหม่
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


// GET /api/food-entry?userId=1&date=2025-07-22
router.get('/', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const where: any = {
      userId: Number(userId),
    };

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
      include: {
        food: true, // รวมข้อมูลอาหาร
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
export default router;
