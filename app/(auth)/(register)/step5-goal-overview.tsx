import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRegister } from './RegisterContext';

function calculateEnergyTarget(data: any) {
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
  let tdee = bmr * activityFactor;
  const dailyDeficit = (data.goalRate || 0) * 500;
  tdee += dailyDeficit;

  const energyTarget = Math.round(tdee);
  const proteinGoal = Math.round(weight * 2); // g/day
  const fatGoal = Math.round((energyTarget * 0.25) / 9); // 25% kcal
  const carbsGoal = Math.round((energyTarget - (proteinGoal * 4 + fatGoal * 9)) / 4); // คำนวณส่วนที่เหลือ

  return { energyTarget, dailyDeficit, proteinGoal, fatGoal, carbsGoal };
}

function estimateBodyFat(data: any): number {
  const weight = parseFloat(data.weight); // kg
  const height = parseFloat(data.height) / 100; // m
  const birthYear = data.birthday ? parseInt(data.birthday.split('-')[0]) : 2000;
  const age = new Date().getFullYear() - birthYear;
  const bmi = weight / (height * height);

  if (data.sex === 'male') {
    return Math.round((1.20 * bmi + 0.23 * age - 16.2) * 10) / 10;
  } else {
    return Math.round((1.20 * bmi + 0.23 * age - 5.4) * 10) / 10;
  }
  
}

function getGoalText(goalRate: number) {
  if (goalRate === 0) return 'Maintain Weight';
  if (goalRate > 0) return 'Gain Weight';
  return 'Lose Weight';
}

function getGoalRateText(goalRate: number) {
  if (goalRate === 0) return '0 lbs per week';
  return `${goalRate > 0 ? '+' : ''}${goalRate * 0.25} lbs per week`;
}

function getGoalForecast(currentWeight: number, goalWeight: number, goalRate: number) {
  // goalRate: lbs/week, 1 kg ≈ 2.2 lbs
  if (!goalWeight || !currentWeight || !goalRate) return '-';
  const diffLbs = Math.abs((goalWeight - currentWeight) * 2.2);
  const weeks = Math.abs(goalRate) > 0 ? diffLbs / Math.abs(goalRate * 0.25) : 0;
  if (weeks === 0) return '-';
  const forecastDate = new Date();
  forecastDate.setDate(forecastDate.getDate() + Math.round(weeks * 7));
  return forecastDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function RegisterStep5({ navigation }: { navigation: any }) {
  const { registerData, setRegisterData } = useRegister();
  const goalRate = registerData.goalRate || 0;
  const {
    energyTarget,
    dailyDeficit,
    proteinGoal,
    fatGoal,
    carbsGoal,
  } = calculateEnergyTarget(registerData);


  // 🟡 เก็บข้อมูลเข้า context (เฉพาะตอนโหลดครั้งแรก)
  useEffect(() => {
    const bodyFat = estimateBodyFat(registerData);
    setRegisterData({
      ...registerData,
      caloriesGoal: energyTarget,
      dailyDeficit,
      proteinGoal,
      fatGoal,
      carbsGoal,
      bodyFat,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Goal Overview</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        Here is your plan and goal forecast based on the information provided.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <Text className="text-white text-base font-bold mb-4">Weight Goal Overview</Text>
        <View className="items-center mb-4">
          <MaterialCommunityIcons name="clipboard-check-outline" size={36} color="#ffb300" />
          <Text className="text-white text-xl font-bold mt-2">{getGoalText(goalRate)}</Text>
          <Text className="text-gray-400 text-base">{getGoalRateText(goalRate)}</Text>
        </View>
        <View className="items-center mb-4">
          <FontAwesome5 name="flag-checkered" size={28} color="#ffb300" />
          <Text className="text-white text-lg font-bold mt-2">Goal Forecast</Text>
          <Text className="text-gray-400 text-base">
            {getGoalForecast(registerData.weight, registerData.goalWeight, goalRate)}
          </Text>
        </View>
        <View className="w-full border-t border-gray-700 my-2" />
        <Text className="text-white text-lg font-bold mt-2">Energy Target</Text>
        <Text className="text-white text-lg">{energyTarget} kcal</Text>
        <Text className="text-white text-lg mt-2">Daily Energy Deficit</Text>
        <Text className="text-white text-lg">{dailyDeficit > 0 ? '+' : ''}{dailyDeficit} kcal</Text>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <Pressable
          className="bg-[#ffb300] rounded-full py-3 items-center mb-2"
          onPress={() => navigation.navigate('step6-account')}
        >
          <Text className="text-[#181929] text-lg font-bold">NEXT</Text>
        </Pressable>
        <Pressable className="items-center" onPress={() => navigation.navigate('step6-account')}>
          <Text className="text-[#38b2ac] text-base font-bold">SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}