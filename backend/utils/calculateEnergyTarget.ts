export function calculateEnergyTarget(data: any) {
  const weight = parseFloat(data.weight);
  const height = parseFloat(data.height);
  const birthYear = data.birthday ? parseInt(data.birthday.split('-')[0]) : 2000;
  const age = new Date().getFullYear() - birthYear;

  let bmr = 0;
  if (data.sex === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const activityMap: any = {
    no_activity: 1.2,
    sedentary: 1.375,
    light: 1.55,
    moderate: 1.725,
    active: 1.9,
    very_active: 2.0,
  };
  const activityFactor = activityMap[data.activityLevel] || 1.2;

  const tdee = bmr * activityFactor; // รวมกิจกรรม แต่ยังไม่รวม goalRate
  const activityCalories = tdee - bmr; // ✅ พลังงานจากกิจกรรม
  const dailyDeficit = (data.goalRate || 0) * 500; // ปรับตามเป้าหมายลด/เพิ่มน้ำหนัก
  const energyTarget = Math.round(tdee + dailyDeficit); // ✅ เป้าหมายรวม

  const proteinGoal = Math.round(weight * 2); // g/day
  const fatGoal = Math.round((energyTarget * 0.25) / 9); // 25% kcal
  const carbsGoal = Math.round((energyTarget - (proteinGoal * 4 + fatGoal * 9)) / 4); // ส่วนที่เหลือ

  return {
    baseEnergyNeed: Math.round(bmr),            // ✅ พลังงานพื้นฐาน (BMR)
    activityCalories: Math.round(activityCalories), // ✅ พลังงานจากกิจกรรม
    energyTarget,                                // ✅ เป้าหมายรวม
    dailyDeficit,                                // ✅ ปรับตาม goalRate
    proteinGoal,
    fatGoal,
    carbsGoal,
  };
}