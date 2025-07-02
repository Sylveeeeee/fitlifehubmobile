const { PrismaClient } = require('../app/generated/prisma');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/FoodData_Central_foundation_food_json_2025-04-24.json');
const outputPath = path.join(__dirname, '../data/foods.json');

const raw = fs.readFileSync(inputPath, 'utf-8');
const json = JSON.parse(raw);

const foods = json.FoundationFoods.map((item: any) => ({
  description: item.description,
  foodNutrients: (item.foodNutrients || []).map((n: any) => ({
    nutrientName: n.nutrient?.name,
    value: n.amount,
  })),
}));

fs.writeFileSync(outputPath, JSON.stringify(foods, null, 2), 'utf-8');
console.log('แปลงข้อมูลเสร็จแล้ว');

const prisma = new PrismaClient();

interface Nutrient {
  nutrientName: string;
  value: number;
}

interface FoodItem {
  description: string;
  foodNutrients: Nutrient[];
}

function getNutrient(nutrients: Nutrient[], name: string): number {
  const found = nutrients.find((n) => n.nutrientName === name);
  return found ? Number(found.value) : 0;
}

async function main() {
  const filePath = path.join(__dirname, '../data/foods.json');
  const file = fs.readFileSync(filePath, 'utf-8');
  const data: FoodItem[] = JSON.parse(file);

  for (const item of data) {
    const nutrients = item.foodNutrients || [];

    const calories = Math.round(getNutrient(nutrients, 'Energy'));
    const protein = getNutrient(nutrients, 'Protein');
    const fat = getNutrient(nutrients, 'Total lipid (fat)');
    const carbs = getNutrient(nutrients, 'Carbohydrate, by difference');
    const fiber = getNutrient(nutrients, 'Fiber, total dietary');

    await prisma.food.create({
      data: {
        name: item.description || 'ไม่ทราบชื่อ',
        calories,
        protein,
        fat,
        carbs,
        fiber,
      },
    });

    console.log(`✅ เพิ่ม ${item.description}`);
  }

  console.log('🎉 ข้อมูลอาหารถูกนำเข้าสำเร็จแล้ว');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
  })
  .finally(() => prisma.$disconnect());
