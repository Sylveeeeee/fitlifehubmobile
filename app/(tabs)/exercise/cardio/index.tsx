import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const cardioItems = [
  { label: 'Walking', icon: 'walk', path: '/exercise/cardio/walking' },
  { label: 'Running', icon: 'walk-outline', path: '/exercise/cardio/running' },
  { label: 'Swimming', icon: 'water', path: '/exercise/cardio/swimming' },
];

export default function CardioScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#1A1B28]">
      {/* Header */}
      <View className="flex-row items-center pt-12 px-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg text-white font-semibold">Cardio</Text>
      </View>

      {/* Items */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row flex-wrap justify-between">
          {cardioItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[30%] bg-[#2B2C3C] rounded-xl p-4 mb-4 items-center"
              onPress={() => router.push(item.path as any)}
            >
              <Ionicons name={item.icon as any} size={40} color="#9CA3AF" />
              <Text className="text-white text-center text-xs mt-2">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
