import React from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRegister } from './RegisterContext';

function calculateEnergyTarget(data: any) {
  // สมมติข้อมูลครบ: sex, weight, height, birthday, activityLevel, goalRate
  const weight = parseFloat(data.weight);
  const height = parseFloat(data.height);
  // birthday format: 'YYYY-MM-DD'
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
  // goalRate: -2 ถึง +2 (lbs/week), 1 lbs fat ≈ 3500 kcal, 1 week = 7 วัน
  // 1 lbs/week = 500 kcal/วัน
  const dailyDeficit = (data.goalRate || 0) * 500;
  tdee += dailyDeficit;
  return { energyTarget: Math.round(tdee), dailyDeficit };
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
  const { registerData } = useRegister();
  const { energyTarget, dailyDeficit } = calculateEnergyTarget(registerData);
  const goalRate = registerData.goalRate || 0;

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