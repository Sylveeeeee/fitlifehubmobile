import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface Nutrient {
  nutrientName: string;
  value: number;
  unitName?: string;
}

interface FoodItem {
  description: string;
  foodNutrients: Nutrient[];
}

function getEnergyKcal(nutrients: Nutrient[]): number {
  // กรองเฉพาะพลังงานทั้งหมด
  const energyItems = nutrients.filter(
    (n) => n.nutrientName.includes('Energy') && n.unitName === 'kcal'
  );

  if (energyItems.length === 0) return 0;

  // ให้เลือก General Factors ก่อน ถ้ามี
  const general = energyItems.find((n) =>
    n.nutrientName.includes('General Factors')
  );
  if (general) return Number(general.value);

  // ถ้าไม่มี General ใช้ Specific Factors
  const specific = energyItems.find((n) =>
    n.nutrientName.includes('Specific Factors')
  );
  if (specific) return Number(specific.value);

  // fallback: ใช้ตัวแรกที่เหลือ
  return Number(energyItems[0].value);
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

    const calories = Math.round(getEnergyKcal(nutrients));
    const protein = getNutrient(nutrients, 'Protein');
    const fat = getNutrient(nutrients, 'Total lipid (fat)');
    const carbs = getNutrient(nutrients, 'Carbohydrate, by difference');

    await prisma.food.upsert({
      where: { foodName: item.description },
      update: {
        calories,
        protein,
        fat,
        carbs,
      },
      create: {
        foodName: item.description || 'ไม่ทราบชื่อ',
        calories,
        protein,
        fat,
        carbs,
      },
    });

    console.log(`✅ เพิ่ม/อัปเดต ${item.description}`);
  }

  console.log('🎉 ข้อมูลอาหารถูกนำเข้าสำเร็จแล้ว');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
  })
  .finally(() => prisma.$disconnect());
