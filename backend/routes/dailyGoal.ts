import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { calculateEnergyTarget } from '../utils/calculateEnergyTarget';

const router = express.Router();
const prisma = new PrismaClient();

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0,0,0,0);
  return d;
}
function endOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(23,59,59,999);
  return d;
}

// GET /api/daily-goal?date=YYYY-MM-DD
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const dateParam = req.query.date || new Date().toISOString().slice(0,10);
    const date = new Date(dateParam);
    const start = startOfDay(date);

    // หาในตาราง DailyGoal ก่อน
    const existing = await prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date: start } }
    });
    if (existing) {
      return res.json({ goal: {
        date: dateParam,
        calories: existing.calories,
        protein: existing.protein,
        fat: existing.fat,
        carbs: existing.carbs,
        exerciseCalories: existing.exerciseCalories ?? 0
      }, source: 'db' });
    }

    // ถ้าไม่มี ให้คำนวณ: ดึง user, exercise ของวันนั้น แล้วคำนวณ
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userData = {
      weight: user.weight,
      height: user.height,
      birthday: user.birthday ? user.birthday.toISOString().slice(0,10) : undefined,
      sex: user.sex,
      activityLevel: user.activityLevel,
      goalRate: user.goalRate,
    };
    const target = calculateEnergyTarget(userData); // คาดว่าคืน { energyTarget, proteinGoal, fatGoal, carbsGoal }

    const exercises = await prisma.exerciseEntry.findMany({
      where: { userId, timestamp: { gte: start, lte: endOfDay(date) } }
    });
    const exerciseCalories = exercises.reduce((s, e) => s + (e.calories || 0), 0);

    // รวม exercise ลงไป
    const calories = Math.round((target.energyTarget || 0) + exerciseCalories);

    // ปรับ macros โดยสัดส่วนจาก target หรือคำนวณใหม่ตามนโยบาย
    const protein = target.proteinGoal ?? Math.round((calories * 0.20) / 4);
    const fat = target.fatGoal ?? Math.round((calories * 0.25) / 9);
    const carbs = target.carbsGoal ?? Math.round((calories - (protein * 4 + fat * 9)) / 4);

    // บันทึกลง DB (upsert)
    await prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: start } },
      update: { calories, protein, fat, carbs, exerciseCalories },
      create: { userId, date: start, calories, protein, fat, carbs, exerciseCalories },
    });

    return res.json({
      goal: { date: dateParam, calories, protein, fat, carbs, exerciseCalories },
      source: 'computed'
    });
  } catch (err) {
    console.error('ERROR /api/daily-goal', err); // <-- เพิ่มบันทึกเต็ม
    res.status(500).json({ error: 'Internal server error', detail: String(err) });
  }
});

export default router;