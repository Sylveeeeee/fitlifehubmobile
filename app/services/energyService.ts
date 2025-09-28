import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

export async function getTotals(date?: string) {
  const token = await getToken();

  const foodRes = await fetch(`${API_URL}/api/food-entry?date=${date ?? ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const exerciseRes = await fetch(`${API_URL}/api/exercise-entry?date=${date ?? ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const foodJson = await foodRes.json();
  const exerciseJson = await exerciseRes.json();

  console.log('📦 getTotals raw food:', foodJson);
  console.log('📦 getTotals raw exercise:', exerciseJson);

  // ✅ ดึงค่า kcal/protein/fat/carbs ตรงจาก DB
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  (foodJson || []).forEach((f: any) => {
    calories += (f.food?.calories || 0) * f.quantity;
    protein += (f.food?.protein || 0) * f.quantity;
    carbs += (f.food?.carbs || 0) * f.quantity;
    fat += (f.food?.fat || 0) * f.quantity;
  });

  // ✅ รวม calories จาก exercise
  let burned = 0;
  (exerciseJson || []).forEach((e: any) => {
    burned += e.calories || 0;
  });

  const result = { calories, protein, carbs, fat, burned };
  console.log('✅ getTotals computed:', result);

  return result;
}

export async function getTargets(date?: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/daily-goal?date=${date ?? ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  console.log('📦 getTargets raw:', data);
  console.log('✅ getTargets goal:', data.goal);

  return data.goal; // { calories, protein, fat, carbs, exerciseCalories }
}
