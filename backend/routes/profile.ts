import { Router } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profile/login
router.post('/login',  async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // สร้าง JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /api/profile/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // เช็ค email ซ้ำ
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    // สร้าง JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ message: 'Register successful', user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/profile/goal
router.get('/goal', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        caloriesGoal: true,
        proteinGoal: true,
        fatGoal: true,
        carbsGoal: true,
        fiberGoal: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile/goal
router.put('/goal', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { caloriesGoal, proteinGoal, fatGoal, carbsGoal, fiberGoal } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { caloriesGoal, proteinGoal, fatGoal, carbsGoal, fiberGoal },
      select: {
        caloriesGoal: true,
        proteinGoal: true,
        fatGoal: true,
        carbsGoal: true,
        fiberGoal: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;