import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterStep3() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set a Weight Goal</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We will calculate your daily calorie budget based on your goals.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <View className="bg-[#fbb6ce] rounded-full p-4 mb-3">
          <MaterialCommunityIcons name="scale-bathroom" size={36} color="#ffb300" />
        </View>
        <Text className="text-white text-xl font-bold mb-2">What is your weight goal?</Text>
        <View className="bg-[#181929] rounded-xl px-8 py-4 mt-4">
          <Text className="text-gray-400 text-lg">--</Text>
        </View>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <View className="bg-gray-600 rounded-full py-3 items-center opacity-60 mb-2">
          <Text className="text-gray-300 text-lg font-bold">NEXT</Text>
        </View>
        <Text className="text-[#38b2ac] text-base font-bold text-center">SKIP</Text>
      </View>
    </SafeAreaView>
  );
}