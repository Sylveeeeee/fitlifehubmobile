import { Router } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { calculateEnergyTarget } from '../utils/calculateEnergyTarget';


const router = Router();

// ฟังก์ชันตรวจสอบ email format
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex ง่ายๆ
  return re.test(email.toLowerCase());
}

// ฟังก์ชันตรวจสอบ password strength
function isStrongPassword(password: string): boolean {
  const minLength = 8;
  return (
    password.length >= minLength &&
    /[a-z]/.test(password) &&   // มีตัวพิมพ์เล็ก
    /[A-Z]/.test(password) &&   // มีตัวพิมพ์ใหญ่
    /[0-9]/.test(password) &&   // มีตัวเลข
    /[^A-Za-z0-9]/.test(password) // มีอักษรพิเศษ
  );
}

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
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profile/register
router.post('/register', async (req, res) => {
  let { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
    });
  }

  try {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Register successful',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
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
        bodyFat: true,
        activityLevel: true,
        goalRate: true,
        goalWeight: true,
        baseEnergyNeed: true,
        activityCalories: true,
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
  const {
    name, sex, birthday, height, weight, bodyFat,
    activityLevel, goalRate, goalWeight
  } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // อัปเดตข้อมูลพื้นฐานก่อน
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name, sex, birthday, height, weight, bodyFat,
        activityLevel, goalRate, goalWeight
      },
    });

    // คำนวณ target ใหม่
    const targets = calculateEnergyTarget({
      weight: updatedUser.weight,
      height: updatedUser.height,
      birthday: updatedUser.birthday?.toISOString().split('T')[0], // แปลงเป็น yyyy-mm-dd
      sex: updatedUser.sex,
      activityLevel: updatedUser.activityLevel,
      goalRate: updatedUser.goalRate,
      goalWeight: updatedUser.goalWeight,
      bodyFat: updatedUser.bodyFat,
      caloriesGoal: updatedUser.caloriesGoal,  
    });

    // อัปเดตค่าที่คำนวณใหม่
    const finalUser = await prisma.user.update({
      where: { id: userId },
      data: {
        caloriesGoal: targets.energyTarget,
        proteinGoal: targets.proteinGoal,
        fatGoal: targets.fatGoal,
        carbsGoal: targets.carbsGoal,
        baseEnergyNeed: targets.baseEnergyNeed,         // ✅ เพิ่ม
        activityCalories: targets.activityCalories,     // ✅ เพิ่ม
      },
      select: {
        id: true, email: true, name: true, sex: true, birthday: true,
        height: true, weight: true, bodyFat: true, activityLevel: true,
        goalRate: true, goalWeight: true,
        caloriesGoal: true, proteinGoal: true, fatGoal: true, carbsGoal: true,
        baseEnergyNeed: true,
        activityCalories: true,
      },
    });

    res.json(finalUser);
  } catch (error) {
    console.error('Update profile error:', error);
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
      data: { caloriesGoal, proteinGoal, fatGoal, carbsGoal, },
      select: {
        caloriesGoal: true,
        proteinGoal: true,
        fatGoal: true,
        carbsGoal: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// PUT /api/profile/change-password
router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;