export function calculateBMR(weight: number, height: number, age: number, gender: "male" | "female") {
  return gender === "male"
    ? 66 + 13.7 * weight + 5 * height - 6.8 * age
    : 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
}

export function calculateTDEE(bmr: number, activity: number) {
  return bmr * activity;
}

export function getMacroTargets(tdee: number, weight: number) {
  const proteinRatio = 0.25; // 25% kcal
  const carbsRatio = 0.50;   // 50% kcal
  const fatRatio = 0.25;     // 25% kcal

  return {
    protein: (tdee * proteinRatio) / 4,
    carbs: (tdee * carbsRatio) / 4,
    fat: (tdee * fatRatio) / 9,
  };
}
