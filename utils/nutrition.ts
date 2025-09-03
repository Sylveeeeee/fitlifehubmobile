// utils/nutrition.ts
export function calculateBMR(weight: number, height: number, age: number, gender: "male" | "female") {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activity: number) {
  // activity factor: sedentary 1.2, light 1.375, moderate 1.55, active 1.725, very active 1.9
  return bmr * activity;
}

export function getMacroTargets(tdee: number, weight: number) {
  const protein = Math.round(weight * 2); // 2 g/kg
  const fat = Math.round((tdee * 0.25) / 9); // 25% calories / 9 kcal per g
  const carbs = Math.round((tdee - (protein * 4 + fat * 9)) / 4); // ที่เหลือเป็นคาร์บ

  return { protein, fat, carbs };
}
