import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

type DayData = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type WeekKey = "week1" | "week2";

const weekData: Record<WeekKey, DayData[]> = {
  week1: [
    { date: "1", calories: 2100, protein: 90, carbs: 250, fat: 70 },
    { date: "2", calories: 1900, protein: 80, carbs: 200, fat: 60 },
    { date: "3", calories: 2200, protein: 100, carbs: 260, fat: 75 },
    { date: "4", calories: 2050, protein: 85, carbs: 240, fat: 65 },
    { date: "5", calories: 2300, protein: 95, carbs: 270, fat: 80 },
    { date: "6", calories: 2100, protein: 88, carbs: 230, fat: 68 },
    { date: "7", calories: 2000, protein: 82, carbs: 210, fat: 62 },
  ],
  week2: [
    { date: "1", calories: 2250, protein: 95, carbs: 260, fat: 75 },
    { date: "2", calories: 2000, protein: 85, carbs: 220, fat: 68 },
    { date: "3", calories: 2350, protein: 105, carbs: 280, fat: 78 },
    { date: "4", calories: 2100, protein: 90, carbs: 250, fat: 70 },
    { date: "5", calories: 2400, protein: 100, carbs: 290, fat: 82 },
    { date: "6", calories: 2200, protein: 92, carbs: 245, fat: 72 },
    { date: "7", calories: 2050, protein: 86, carbs: 225, fat: 65 },
  ],
};

export default function Charts() {
  const [goal, setGoal] = useState(2300);
  const [selectedWeek, setSelectedWeek] = useState<WeekKey>("week1");

  // 🔹 state สำหรับเลือกช่วงวัน
  const [dayRange, setDayRange] = useState<[number, number]>([1, 7]);

  // ข้อมูลตามสัปดาห์
  const mockData = weekData[selectedWeek];

  // 🔹 กรองข้อมูลตามช่วงวัน
  const filteredData = mockData.filter((d) => {
    const dayNum = Number(d.date);
    return dayNum >= dayRange[0] && dayNum <= dayRange[1];
  });

  // ค่าเฉลี่ยของช่วงวันที่เลือก
  const avg = useMemo(() => {
    if (filteredData.length === 0)
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const total = filteredData.reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories,
        protein: acc.protein + d.protein,
        carbs: acc.carbs + d.carbs,
        fat: acc.fat + d.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    return {
      calories: Math.round(total.calories / filteredData.length),
      protein: Math.round(total.protein / filteredData.length),
      carbs: Math.round(total.carbs / filteredData.length),
      fat: Math.round(total.fat / filteredData.length),
    };
  }, [filteredData]);

  // 🔹 คำนวณแนวโน้มเทียบสัปดาห์ก่อน (ใช้ dayRange เดียวกัน)
  const trends = useMemo(() => {
    const weekKeys: WeekKey[] = Object.keys(weekData) as WeekKey[];
    const currentIndex = weekKeys.indexOf(selectedWeek);
    if (currentIndex <= 0) return null;

    const prevWeekKey = weekKeys[currentIndex - 1];
    const prevWeek = weekData[prevWeekKey];

    // กรองช่วงวันเดียวกันกับที่เลือก
    const prevFiltered = prevWeek.filter((d) => {
      const dayNum = Number(d.date);
      return dayNum >= dayRange[0] && dayNum <= dayRange[1];
    });

    if (prevFiltered.length === 0 || filteredData.length === 0) return null;

    const calcAvg = (data: DayData[]) => {
      const total = data.reduce(
        (acc, d) => ({
          calories: acc.calories + d.calories,
          protein: acc.protein + d.protein,
          carbs: acc.carbs + d.carbs,
          fat: acc.fat + d.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      return {
        calories: Math.round(total.calories / data.length),
        protein: Math.round(total.protein / data.length),
        carbs: Math.round(total.carbs / data.length),
        fat: Math.round(total.fat / data.length),
      };
    };

    const prevAvg = calcAvg(prevFiltered);

    const checkDiff = (current: number, prev: number, unit: string) => {
      const diff = current - prev;
      if (diff > 0) return `↑ เพิ่มขึ้น ${diff} ${unit}`;
      if (diff < 0) return `↓ ลดลง ${Math.abs(diff)} ${unit}`;
      return "คงที่";
    };

    return {
      calories: checkDiff(avg.calories, prevAvg.calories, "kcal"),
      protein: checkDiff(avg.protein, prevAvg.protein, "g"),
      carbs: checkDiff(avg.carbs, prevAvg.carbs, "g"),
      fat: checkDiff(avg.fat, prevAvg.fat, "g"),
    };
  }, [selectedWeek, avg, dayRange, filteredData]);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 rounded-2xl">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold">Nutrition Dashboard</Text>
        <Text className="text-gray-500">Macronutrient Charts</Text>
      </View>

      {/* Week Selector */}
      <View className="flex-row mb-4">
        {Object.keys(weekData).map((w) => (
          <TouchableOpacity
            key={w}
            onPress={() => setSelectedWeek(w as WeekKey)}
            className={`px-4 py-2 mr-2 rounded-xl ${
              selectedWeek === w ? "bg-indigo-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedWeek === w ? "text-white" : "text-gray-700"
              } font-semibold`}
            >
              {w.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day Range Selector */}
      <View className="flex-row items-center mb-6">
        <Text className="mr-2 text-gray-600">Day Range:</Text>
        <TextInput
          value={String(dayRange[0])}
          onChangeText={(t) => setDayRange([Number(t) || 1, dayRange[1]])}
          keyboardType="numeric"
          className="border rounded px-2 py-1 w-12 bg-white mr-2"
        />
        <Text className="mx-1">-</Text>
        <TextInput
          value={String(dayRange[1])}
          onChangeText={(t) => setDayRange([dayRange[0], Number(t) || 7])}
          keyboardType="numeric"
          className="border rounded px-2 py-1 w-12 bg-white"
        />
      </View>

      {/* Summary */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Avg Calories</Text>
          <Text className="text-lg font-semibold">{avg.calories} kcal</Text>
          {trends && <Text className="text-xs text-indigo-600">{trends.calories}</Text>}
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Protein</Text>
          <Text className="text-lg font-semibold">{avg.protein} g</Text>
          {trends && <Text className="text-xs text-indigo-600">{trends.protein}</Text>}
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Carbs</Text>
          <Text className="text-lg font-semibold">{avg.carbs} g</Text>
          {trends && <Text className="text-xs text-indigo-600">{trends.carbs}</Text>}
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Fat</Text>
          <Text className="text-lg font-semibold">{avg.fat} g</Text>
          {trends && <Text className="text-xs text-indigo-600">{trends.fat}</Text>}
        </View>
      </View>

      {/* Chart */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <Text className="font-semibold mb-2">
          Macronutrient Trends (Days {dayRange[0]} - {dayRange[1]})
        </Text>
        <LineChart
          data={{
            labels: filteredData.map((d) => d.date),
            datasets: [
              { data: filteredData.map((d) => d.protein), color: () => "#34d399" },
              { data: filteredData.map((d) => d.carbs), color: () => "#60a5fa" },
              { data: filteredData.map((d) => d.fat), color: () => "#f87171" },
            ],
            legend: ["Protein (g)", "Carbs (g)", "Fat (g)"],
          }}
          width={Dimensions.get("window").width - 40}
          height={260}
          yAxisSuffix=" g"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(31,41,55,${opacity})`,
            labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </ScrollView>
  );
}
