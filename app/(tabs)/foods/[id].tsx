import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  // UI states
  const [amount, setAmount] = useState('1');
  const [servingSize, setServingSize] = useState('cup – 258g');
  const [timestamp, setTimestamp] = useState('1:07');
  const [group, setGroup] = useState('Uncategorized');

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
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
        <Text className="text-white font-bold text-xl">
          <Text>⭐ </Text>
          {food.foodName}
        </Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </View>

      {/* Amount, Serving Size, Timestamp, Group */}
      <View className="bg-[#23243a] rounded-xl p-4 mb-4">
        <View className="mb-3">
          <Text className="text-white font-bold text-base mb-1">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="bg-[#2a2c3d] rounded-lg px-3 py-2 text-white"
            style={{ width: 80 }}
          />
        </View>
        <View className="mb-3">
          <Text className="text-white font-bold text-base mb-1">Serving Size</Text>
          <Text className="text-white">{servingSize}</Text>
        </View>
        <View className="mb-3 flex-row items-center">
          <Text className="text-white font-bold text-base mr-2">Timestamp</Text>
          <MaterialCommunityIcons name="lock" size={18} color="#ffb300" />
          <Text className="bg-[#2a2c3d] px-2 py-1 rounded-lg text-white mx-2">{timestamp}</Text>
          <Ionicons name="checkmark-circle" size={18} color="#ffb300" />
        </View>
        <View className="mb-1">
          <Text className="text-white font-bold text-base mb-1">Group</Text>
          <Text className="text-white">{group}</Text>
        </View>
      </View>

      {/* Nutrient Count & Data Source */}
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="flask-outline" size={20} color="#ff4d4f" />
        <Text className="text-[#ff4d4f] ml-1 mr-2 font-bold">81 Listed Nutrients</Text>
        <Text className="text-gray-400">Data Source: NCCDB</Text>
      </View>
      <Text className="text-white text-sm mb-2">
        Nutritional Information per 1 cup — 258g
      </Text>

      {/* Energy Summary */}
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
                {m.label} ({((m.value / total) * 100).toFixed(0)}%) - {m.value}g
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Macronutrient Targets */}
      <View className="bg-[#2a2c3d] rounded-xl p-4 mb-6">
        <Text className="text-white font-bold text-lg mb-2">Macronutrient Targets</Text>
        {[{ label: 'Energy', value: food.calories, target: targets.calories, unit: 'kcal', color: '#fff' }, ...macros.map(m => ({ label: m.label, value: m.value, target: m.target, color: m.color, unit: 'g' }))].map((item) => (
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

      {/* Add to Diary Button */}
      <Pressable onPress={() => console.log('Add to Diary')} className="bg-white py-3 rounded-full items-center mb-10">
        <Text className="text-black font-semibold text-lg">ADD TO DIARY</Text>
      </Pressable>
    </ScrollView>
  );
}