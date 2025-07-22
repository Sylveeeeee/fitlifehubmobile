import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/foods?search=egg
router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    const foods = await prisma.food.findMany({
      where: search
        ? {
          foodName: {
            contains: search,
            mode: 'insensitive',
          },
        } as Prisma.FoodWhereInput // 👈 บอกชัด ๆ ไปเลย
        : undefined,
      take: 20,
    });


    res.json(foods);
  } catch (error) {
    console.error('❌ Error fetching foods:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
