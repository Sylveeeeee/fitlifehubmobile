import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const categories = [
  { label: 'Cardio', icon: 'fitness', path: '/exercise/cardio' },
  { label: 'Gym', icon: 'barbell', path: '/exercise/gym' },
];

export default function AddExerciseScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#1A1B28]">
      {/* Header */}
      <View className="flex-row items-center pt-12 px-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg text-white font-semibold">All Categories</Text>
      </View>

      {/* Categories */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row flex-wrap ">
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[30%] bg-[#2B2C3C] rounded-xl p-4 mb-4 items-center mr-5"
              onPress={() => router.push(item.path as any)} // ใช้ as any ป้องกัน ts error
            >
              <Ionicons name={item.icon as any} size={42} color="#9CA3AF" />
              <Text className="text-white text-center text-xs mt-2 pt-[2px]">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
