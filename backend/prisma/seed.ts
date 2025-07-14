// prisma/seed.ts
import { PrismaClient } from '../generated/prisma'; // เส้นทางที่คุณใช้
import fs from 'fs';
import path from 'path';

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
        foodName: item.description || 'ไม่ทราบชื่อ',
        calories,
        protein,
        fat,
        carbs,
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
