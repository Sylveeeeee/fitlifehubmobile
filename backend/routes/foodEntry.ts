import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/food-entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mealType, foodName, calories, protein, carbs, fat } = req.body;
    const userId = req.user.id;

    const entry = await prisma.foodEntry.create({
      data: {
        mealType,
        foodName,
        calories,
        protein,
        carbs,
        fat,
        user: { connect: { id: userId } },
      },
    });

    res.json(entry);
  } catch (error) {
    console.error('[AddFoodEntry] Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
