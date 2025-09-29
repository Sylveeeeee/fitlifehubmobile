import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/foods?search=egg
router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    let where: Prisma.FoodWhereInput | undefined = undefined;

    if (search && typeof search === 'string') {
      where = {
        OR: [
          { foodName: { contains: search, mode: 'insensitive' } } as Prisma.FoodWhereInput,
          { category: { contains: search } } as Prisma.FoodWhereInput,
        ],
      };
    }

    const foods = await prisma.food.findMany({
      where,
      take: 20,
      orderBy: { foodName: 'asc' },
    });

    res.json(foods);
  } catch (error) {
    console.error('❌ Error fetching foods:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/foods/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const food = await prisma.food.findUnique({
      where: { id },
    });

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
