import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { calculateEnergyTarget } from '../utils/calculateEnergyTarget';

const router = express.Router();
const prisma = new PrismaClient();

async function updateDailyGoal(userId: number, date: Date) {
  // ดึง user profile
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const userData = {
    weight: user.weight,
    height: user.height,
    birthday: user.birthday?.toISOString().split('T')[0],
    sex: user.sex,
    activityLevel: user.activityLevel,
    goalRate: user.goalRate,
  };

  const target = calculateEnergyTarget(userData);

  // ดึง exercise ของวันนั้น
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  const exerciseEntries = await prisma.exerciseEntry.findMany({
    where: {
      userId,
      timestamp: { gte: start, lte: end },
    },
  });

  // รวม calories จาก exercise
  const exerciseCalories = exerciseEntries.reduce((sum, e) => sum + (e.calories || 0), 0);

  const caloriesGoal = target.energyTarget + exerciseCalories;

  const weight = user.weight || 0;
  const proteinGoal = Math.round(weight * 2); // g
  const fatGoal = Math.round((caloriesGoal * 0.25) / 9); // g
  const carbsGoal = Math.round((caloriesGoal - (proteinGoal * 4 + fatGoal * 9)) / 4); // g

  // upsert DailyGoal
  await prisma.dailyGoal.upsert({
    where: { userId_date: { userId, date: start } },
    update: {
      calories: caloriesGoal,
      protein: proteinGoal,
      fat: fatGoal,
      carbs: carbsGoal,
    },
    create: {
      userId,
      date: start,
      calories: caloriesGoal,
      protein: proteinGoal,
      fat: fatGoal,
      carbs: carbsGoal,
    },
  });
}

// POST /api/exercise-entry
router.post('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { category, type, duration, calories, note, timestamp, mealType } = req.body;

  console.log('ExerciseEntry payload:', req.body); // <--- log ตรงนี้


  if (!category || !type || !duration || !calories || !timestamp || !mealType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const entry = await prisma.exerciseEntry.create({
      data: {
        userId,
        category,
        type,
        duration,
        calories,
        note,
        timestamp: new Date(timestamp),
        mealType,
      },
    });
    const entryDate = new Date(timestamp);
    entryDate.setUTCHours(0, 0, 0, 0);
    await updateDailyGoal(userId, entryDate);
    res.json(entry);
  } catch (err) {
    console.error('Create ExerciseEntry error:', err); // <--- log ตรงนี้
    res.status(500).json({ error: 'Failed to create exercise entry' });
  }
});

// GET /api/exercise-entry?date=YYYY-MM-DD
router.get('/', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { date } = req.query;

  try {
    const where: any = { userId };
    if (date) {
      const parsedDate = new Date(date as string);
      const start = new Date(parsedDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(parsedDate);
      end.setUTCHours(23, 59, 59, 999);
      where.timestamp = { gte: start, lte: end };
    }
    const entries = await prisma.exerciseEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise entries' });
  }
});

router.delete('/:id', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const entryId = Number(req.params.id);
  // ตรวจสอบว่า entry นี้เป็นของ user นี้จริง
  const entry = await prisma.exerciseEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  await prisma.exerciseEntry.delete({ where: { id: entryId } });
  const entryDate = entry.timestamp;
  entryDate.setUTCHours(0, 0, 0, 0);
  await updateDailyGoal(userId, entryDate);
  res.json({ success: true });;
});

// GET /api/exercise-entry/energy-history?range=7d
router.get('/energy-history', authenticateToken, async (req: any, res) => {
  const userId = req.user.userId;
  const { range = '7d' } = req.query;

  // คำนวณช่วงเวลา
  const now = new Date();
  let startDate = new Date();
  if (range === '7d') startDate.setDate(now.getDate() - 6);
  if (range === '14d') startDate.setDate(now.getDate() - 13);
  if (range === '1m') startDate.setMonth(now.getMonth() - 1);

  startDate.setUTCHours(0, 0, 0, 0);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        baseEnergyNeed: true,
        activityCalories: true,
        caloriesGoal: true,
        dailyGoals: { select: { date: true, calories: true } }
      },
    });

    const entries = await prisma.exerciseEntry.findMany({
      where: {
        userId,
        timestamp: { gte: startDate, lte: now },
      },
      orderBy: { timestamp: 'asc' },
    });

    // รวมแคลอรี่ต่อวัน
    const historyMap: Record<string, number> = {};
    entries.forEach((e) => {
      const dateKey = e.timestamp.toISOString().split('T')[0];
      historyMap[dateKey] = (historyMap[dateKey] || 0) + e.calories;
    });

    // สร้าง array ของวันที่ทั้งหมดในช่วงเวลา
    const dateArray: string[] = [];
    const tmpDate = new Date(startDate);
    while (tmpDate <= now) {
      dateArray.push(tmpDate.toISOString().split('T')[0]);
      tmpDate.setDate(tmpDate.getDate() + 1);
    }

    // สร้าง history สำหรับทุกวันในช่วงเวลา
    const history = dateArray.map(dateKey => ({
      date: dateKey,
      burned: historyMap[dateKey] || 0,
      baseEnergyNeed: user?.baseEnergyNeed || 0,
      activityCalories: user?.activityCalories || 0,
      caloriesGoal:
        user?.dailyGoals.find(d =>
          d.date.toISOString().split('T')[0] === dateKey
        )?.calories || 0,
    }));

    res.json({ history });
  } catch (err) {
    console.error('🚨 Error fetching burned energy history:', err);
    res.status(500).json({ error: 'Failed to fetch burned energy history' });
  }
});

export default router;