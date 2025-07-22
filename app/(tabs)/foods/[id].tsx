import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  useEffect(() => {
    const fetchTargets = async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setTargets({
        calories: user.caloriesGoal,
        protein: user.proteinGoal,
        fat: user.fatGoal,
        carbs: user.carbsGoal,
      });
    };
    fetchTargets();
  }, []);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/foods/${id}`);
        const data = await res.json();
        setFood(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFood();
  }, [id]);

  if (loading || !food) {
    return (
      <View className="flex-1 bg-[#1a1b2e] justify-center items-center">
        <ActivityIndicator size="large" color="#ff7a1a" />
      </View>
    );
  }

  const protein = food.protein || 0;
  const carbs = food.carbs || 0;
  const fat = food.fat || 0;
  const total = protein + carbs + fat || 1;

  const proteinPercent = (protein / total) * 100;
  const carbsPercent = (carbs / total) * 100;
  const fatPercent = (fat / total) * 100;

  const macros = [
    { label: 'Protein', value: protein, color: '#22c55e', target: targets.protein },
    { label: 'Net Carbs', value: carbs, color: '#06b6d4', target: targets.carbs },
    { label: 'Fat', value: fat, color: '#f97316', target: targets.fat },
  ];

  return (
    <ScrollView className="flex-1 bg-[#1a1b2e] px-4 pt-10">
      <View className="flex-row justify-between items-center mb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
        <Text className="text-white font-bold text-xl">⭐ {food.foodName}</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </View>

      <View className="mb-4">
        <Text className="text-white text-sm">Group: <Text className="text-gray-400">{food.category || 'Uncategorized'}</Text></Text>
        <Text className="text-white text-sm">Data Source: <Text className="text-gray-400">{food.source || 'N/A'}</Text></Text>
        <Text className="text-white text-sm">Nutritional Information per 100g</Text>
      </View>

      <View className="bg-[#2a2c3d] rounded-xl p-4 mb-4">
        <Text className="text-white font-bold text-lg mb-2">Energy Summary</Text>
        <View className="flex-row items-center justify-around">
          <View className="relative items-center justify-center">
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={100}
              tintColor="#444"
              backgroundColor="#1a1b2e"
              rotation={0}
            >{() => null}</AnimatedCircularProgress>
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={proteinPercent}
              tintColor="#22c55e"
              backgroundColor="transparent"
              rotation={0}
              style={{ position: 'absolute' }}
            />
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={carbsPercent}
              tintColor="#06b6d4"
              backgroundColor="transparent"
              rotation={(proteinPercent / 100) * 360}
              style={{ position: 'absolute' }}
            />
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={fatPercent}
              tintColor="#f97316"
              backgroundColor="transparent"
              rotation={((proteinPercent + carbsPercent) / 100) * 360}
              style={{ position: 'absolute' }}
            />
            <View className="absolute items-center">
              <Text className="text-white font-bold text-xl">{food.calories}</Text>
              <Text className="text-white text-xs">kcal</Text>
            </View>
          </View>

          <View className="ml-4">
            {macros.map((m) => (
              <Text key={m.label} style={{ color: m.color }} className="text-sm mb-1">
                {m.label} ({((m.value / total) * 100).toFixed(0)}%) – {m.value}g
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View className="bg-[#2a2c3d] rounded-xl p-4 mb-6">
        <Text className="text-white font-bold text-lg mb-2">Macronutrient Targets</Text>
        {[{ label: 'Energy', value: food.calories, target: targets.calories, unit: 'kcal',color: '#fff' }, ...macros.map(m => ({ label: m.label, value: m.value, target: m.target, color: m.color, unit: 'g' }))].map((item) => (
          <View key={item.label} className="mb-3">
            <Text className="text-white text-sm mb-1">
              {item.label} – {item.value} / {item.target} {item.unit} ({((item.value / (item.target || 1)) * 100).toFixed(0)}%)
            </Text>
            <View className="h-2 w-full bg-gray-700 rounded-full">
              <View style={{ width: `${(item.value / (item.target || 1)) * 100}%`, backgroundColor: item.color || '#fff', height: 8, borderRadius: 5 }} />
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={() => console.log('Add to Diary')} className="bg-white py-3 rounded-full items-center mb-10">
        <Text className="text-black font-semibold text-lg">ADD TO DIARY</Text>
      </Pressable>
    </ScrollView>
  );
}