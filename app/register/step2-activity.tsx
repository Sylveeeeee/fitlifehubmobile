import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterStep2() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress เหมือน step1 */}
      {/* ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set an Activity Level</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We recommend selecting a baseline level that best describes your day-to-day life.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-6 mx-4 mb-8 items-center">
        <View className="bg-[#35364a] rounded-full p-4 mb-3">
          <MaterialCommunityIcons name="run" size={36} color="#ffb300" />
        </View>
        <Text className="text-white text-xl font-bold mb-1">No Activity</Text>
        <Text className="text-gray-400 text-center mb-4">
          Health professionals monitoring comatose patients should select this activity level.
        </Text>
        {/* วาดวงกลมเลือก activity level */}
        <View className="flex-row justify-center items-center mt-4">
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              className={`w-6 h-6 rounded-full mx-1 border-2 ${i === 0 ? 'border-[#ffb300] bg-[#ffb300]' : 'border-[#ffb300]'}`}
            />
          ))}
        </View>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <View className="bg-gray-200 rounded-full py-3 items-center mb-2">
          <Text className="text-[#181929] text-lg font-bold">NEXT</Text>
        </View>
        <Pressable className="items-center">
          <Text className="text-[#38b2ac] text-base font-bold">SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}