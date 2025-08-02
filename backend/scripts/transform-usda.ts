import fs from 'fs';

interface FoodNutrient {
  nutrient: {
    name: string;
    unitName: string;
  };
  amount: number;
}

interface FoodItem {
  description: string;
  foodNutrients: FoodNutrient[];
}

interface USDAData {
  FoundationFoods: FoodItem[];
}

const raw = fs.readFileSync('data/FoodData_Central_foundation_food_json_2025-04-24.json', 'utf-8'); // ไฟล์ USDA ดิบ
const data: USDAData = JSON.parse(raw);

const simplifiedData = data.FoundationFoods.map((food) => ({
  description: food.description,
  foodNutrients: food.foodNutrients.map((nutrient) => ({
    nutrientName: nutrient.nutrient.name,
    value: nutrient.amount,
    unitName: nutrient.nutrient.unitName,
  })),
}));

fs.writeFileSync('data/foods.json', JSON.stringify(simplifiedData, null, 2));
console.log('✅ แปลงข้อมูลเสร็จแล้ว → data/foods.json');
