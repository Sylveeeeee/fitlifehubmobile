import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterStep5() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Goal Overview</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        Here is your plan and goal forecast based on the information provided.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <Text className="text-white text-lg font-bold mb-2">Maintain Weight</Text>
        <View className="bg-[#181929] rounded-xl px-8 py-6 items-center">
          <MaterialCommunityIcons name="clipboard-check-outline" size={36} color="#ffb300" />
          <Text className="text-white text-lg font-bold mt-2">Energy Target</Text>
          <Text className="text-white text-lg">1902 kcal</Text>
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