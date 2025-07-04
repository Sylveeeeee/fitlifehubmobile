import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { useRegister } from './RegisterContext';

export default function RegisterStep4({ navigation }: { navigation: any }) {
  const { registerData, setRegisterData } = useRegister();
  const [goalRate, setGoalRate] = useState(0); // 0 lbs/week

  const handleMinus = () => setGoalRate(rate => Math.max(rate - 1, -2)); // จำกัดต่ำสุด -2
  const handlePlus = () => setGoalRate(rate => Math.min(rate + 1, 2));   // จำกัดสูงสุด +2

  const handleNext = () => {
    setRegisterData({ ...registerData, goalRate });
    navigation.navigate('step5-goal-overview');
  };
  const handleSkip = () => {
    navigation.navigate('step5-goal-overview');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set a Goal Rate</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We will calculate your daily calorie budget based on your goals.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <Text className="text-white text-lg font-bold mb-2">
          {goalRate === 0 ? 'Maintain Weight' : goalRate > 0 ? 'Gain Weight' : 'Lose Weight'}
        </Text>
        <View className="flex-row items-center justify-between w-full px-4 mt-2">
          <Pressable
            className="bg-white rounded-full w-10 h-10 items-center justify-center"
            onPress={handleMinus}
          >
            <Text className="text-[#ffb300] text-2xl">-</Text>
          </Pressable>
          <View className="bg-[#181929] rounded-xl px-8 py-4">
            <Text className="text-white text-lg">{goalRate} lbs / per week</Text>
          </View>
          <Pressable
            className="bg-white rounded-full w-10 h-10 items-center justify-center"
            onPress={handlePlus}
          >
            <Text className="text-[#ffb300] text-2xl">+</Text>
          </Pressable>
        </View>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <Pressable
          className="bg-[#ffb300] rounded-full py-3 items-center mb-2"
          onPress={handleNext}
        >
          <Text className="text-[#181929] text-lg font-bold">NEXT</Text>
        </Pressable>
        <Pressable className="items-center" onPress={handleSkip}>
          <Text className="text-[#38b2ac] text-base font-bold">SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}