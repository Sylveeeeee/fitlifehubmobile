import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';

export default function RegisterStep4() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set a Goal Rate</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We will calculate your daily calorie budget based on your goals.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <Text className="text-white text-lg font-bold mb-2">Maintain Weight</Text>
        <View className="flex-row items-center justify-between w-full px-4 mt-2">
          <Pressable className="bg-white rounded-full w-10 h-10 items-center justify-center">
            <Text className="text-[#ffb300] text-2xl">-</Text>
          </Pressable>
          <View className="bg-[#181929] rounded-xl px-8 py-4">
            <Text className="text-white text-lg">0 lbs / per week</Text>
          </View>
          <Pressable className="bg-white rounded-full w-10 h-10 items-center justify-center">
            <Text className="text-[#ffb300] text-2xl">+</Text>
          </Pressable>
        </View>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <View className="bg-gray-200 rounded-full py-3 items-center mb-2">
          <Text className="text-[#181929] text-lg font-bold">NEXT</Text>
        </View>
        <Text className="text-[#38b2ac] text-base font-bold text-center">SKIP</Text>
      </View>
    </SafeAreaView>
  );
}