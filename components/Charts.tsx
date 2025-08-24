import React, { useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, Dimensions } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
// import { styled } from "nativewind";
import { LineChart } from "react-native-chart-kit"; // ใช้ chart-kit แทน recharts

// const Circle = styled(AnimatedCircularProgress);

const mockData = [
  { date: "Mon", calories: 2100, protein: 90, carbs: 250, fat: 70, micros: { VitaminC: 0.7, Calcium: 0.6, Iron: 0.5 } },
  { date: "Tue", calories: 1900, protein: 80, carbs: 200, fat: 60, micros: { VitaminC: 0.8, Calcium: 0.7, Iron: 0.6 } },
  { date: "Wed", calories: 2200, protein: 100, carbs: 260, fat: 75, micros: { VitaminC: 0.9, Calcium: 0.65, Iron: 0.55 } },
];

export default function Charts() {
  const [goal, setGoal] = useState(2300);

  const avg = useMemo(() => {
    const total = mockData.reduce(
      (acc, d) => {
        acc.calories += d.calories;
        acc.protein += d.protein;
        acc.carbs += d.carbs;
        acc.fat += d.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    const days = mockData.length;
    return {
      calories: Math.round(total.calories / days),
      protein: Math.round(total.protein / days),
      carbs: Math.round(total.carbs / days),
      fat: Math.round(total.fat / days),
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 rounded-2xl ">
      {/* Header */}
      <View className="mb-6 ">
        <Text className="text-2xl font-bold">Nutrition Dashboard</Text>
        <Text className="text-gray-500">Charts</Text>
      </View>

      {/* Goal Input */}
      <View className="flex-row items-center mb-6">
        <Text className="text-gray-600 mr-2">Calorie Goal:</Text>
        <TextInput
          value={String(goal)}
          onChangeText={(t) => setGoal(Number(t))}
          keyboardType="numeric"
          className="border rounded px-2 py-1 w-24 bg-white"
        />
      </View>

      {/* Summary */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Avg Calories</Text>
          <Text className="text-lg font-semibold">{avg.calories} kcal</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Protein</Text>
          <Text className="text-lg font-semibold">{avg.protein} g</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Carbs</Text>
          <Text className="text-lg font-semibold">{avg.carbs} g</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow items-center flex-1 mx-1">
          <Text className="text-sm text-gray-500">Fat</Text>
          <Text className="text-lg font-semibold">{avg.fat} g</Text>
        </View>
      </View>

      {/* Circular Progress */}
      <View className="items-center mb-6">
        <Text className="text-xl font-bold mb-4">Vitamin C</Text>
        <AnimatedCircularProgress
          size={150}
          width={15}
          fill={70}
          tintColor="#4F46E5"
          backgroundColor="#E5E7EB"
          rotation={0}
          lineCap="round"
        >
          {() => <Text className="text-lg font-semibold">70%</Text>}
        </AnimatedCircularProgress>
      </View>

      {/* Calories Trend Chart */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <Text className="font-semibold mb-2">Calories Trend</Text>
        <LineChart
          data={{
            labels: mockData.map((d) => d.date),
            datasets: [
              { data: mockData.map((d) => d.calories) },
              { data: mockData.map(() => goal), color: () => "#f87171" },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisSuffix=" kcal"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(96,165,250,${opacity})`,
            labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </ScrollView>
  );
}
