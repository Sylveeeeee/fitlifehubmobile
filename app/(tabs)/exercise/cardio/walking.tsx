import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WalkingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#1A1B28] pt-12 px-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold">General Walking</Text>
      </View>

      {/* Effort Level */}
      <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3">
        <Text className="text-gray-300 mb-1">Effort Level</Text>
        <Text className="text-white text-base">Light</Text>
        <Text className="text-gray-400 text-xs mt-1">
          Requires some effort but not enough to speed up breathing.
        </Text>
      </View>

      {/* Duration */}
      <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3">
        <Text className="text-gray-300">Duration</Text>
        <Text className="text-white text-lg">30 min</Text>
      </View>

      {/* Energy Burned */}
      <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3">
        <Text className="text-gray-300">Energy Burned</Text>
        <Text className="text-white text-lg">73.5 kcal</Text>
      </View>

      {/* Timestamp */}
      <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-300">Timestamp</Text>
          <Text className="text-white">23:35</Text>
        </View>
        <Ionicons name="lock-closed" size={20} color="#FBBF24" />
      </View>

      {/* Group */}
      <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3">
        <Text className="text-gray-300">Group</Text>
        <Text className="text-white">Uncategorized</Text>
      </View>

      <Text className="text-gray-400 text-xs mb-6">
        Based on your current weight of 70kg.
      </Text>

      {/* Add to Diary */}
      <TouchableOpacity className="bg-gray-100 py-3 rounded-xl items-center">
        <Text className="text-black text-base font-bold">ADD TO DIARY</Text>
      </TouchableOpacity>
    </View>
  );
}
