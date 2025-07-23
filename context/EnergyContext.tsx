import React, { createContext, useContext, useState } from 'react';

// 1. สร้าง Type ให้กับ context
type EnergyTotals = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

type EnergyContextType = {
  totals: EnergyTotals;
  setTotals: React.Dispatch<React.SetStateAction<EnergyTotals>>;
};

// 2. สร้าง context พร้อมกำหนด type (ใช้ null ก่อนแล้วเช็คภายหลัง)
export const EnergyContext = createContext<EnergyContextType | null>(null);

// 3. Hook ใช้งาน context (พร้อมเช็ค null)
export function useEnergy() {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
}

// 4. Provider
export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [totals, setTotals] = useState<EnergyTotals>({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  return (
    <EnergyContext.Provider value={{ totals, setTotals }}>
      {children}
    </EnergyContext.Provider>
  );
}
