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
router.post('/login', async (req, res) => {
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
  console.log('register req.body', req.body); // log ข้อมูลที่รับมา
  if (!email || !password || !name) {
    console.log('Missing:', { email, password, name }); // log field ที่ขาด
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    console.log('exist:', exist);
    if (exist) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ message: 'Register successful', user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/me
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        sex: true,
        birthday: true,
        height: true,
        weight: true,
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

// PUT /api/profile/me
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { name, sex, birthday, height, weight } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, sex, birthday, height, weight },
      select: {
        id: true,
        email: true,
        name: true,
        sex: true,
        birthday: true,
        height: true,
        weight: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error); // เพิ่มบรรทัดนี้
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