import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// POST /api/foods (เพิ่มอาหารใหม่)
router.post('/', async (req, res) => {
  const { name, calories, protein, fat, carbs, fiber } = req.body;
  if (!name || calories == null || protein == null || fat == null || carbs == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const food = await prisma.food.create({
      data: { name, calories, protein, fat, carbs, fiber },
    });
    res.json(food);
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/foods?search=ข้าว (ค้นหาอาหาร)
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    const foods = await prisma.food.findMany({
      where: search
        ? { name: { contains: search as string, mode: 'insensitive' } }
        : {},
      orderBy: { name: 'asc' },
      take: 30,
    });
    res.json(foods);
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;