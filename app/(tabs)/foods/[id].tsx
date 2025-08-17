import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Picker } from '@react-native-picker/picker';

type ServingOption = {
  label: string;
  value: number;
};

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const mealOptions = [
    { label: 'Uncategorized', value: 'Uncategorized' },
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Snacks', value: 'Snacks' },
  ];

  const servingOptions: ServingOption[] = [
    { label: '100 g', value: 100 },
    { label: '1 cup (258g)', value: 258 },
    { label: '1 tbsp (15g)', value: 15 },
  ];

  const handleSelectServing = (option: ServingOption) => {
    setSelectedServing(option);
    setAmount(String(option.value));
    setIsServingOpen(false);
  };

  // และตอน map
  servingOptions.map((option: ServingOption) => (
    <TouchableOpacity key={option.value} onPress={() => handleSelectServing(option)}>
      <Text>{option.label}</Text>
    </TouchableOpacity>
  ));

  // UI states
  const [amount, setAmount] = useState('1'); // 1 = 100g
  const [selectedServing, setSelectedServing] = useState<ServingOption>(servingOptions[0]);
  const [group, setGroup] = useState('Uncategorized');
  const [isOpen, setIsOpen] = useState(false);
  const [isServingOpen, setIsServingOpen] = useState(false);


  const handleAddToDiary = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/food-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: food.id,
          quantity: Number(amount),
          mealType: group, // หรือ mealType ที่เลือก
          date: new Date(Date.now()).toISOString(),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        console.log('Add to diary failed:', error);
        return;
      }
      // ไปหน้า Diary ทันที
      router.replace('/diary');
    } catch (e) {
      // handle error
    }
  };

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
      <View
        style={{ flex: 1, backgroundColor: '#1a1b2e', justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#ff7a1a" />
      </View>
    );
  }

  // 1 amount = selectedServing.value (g)
  const multiplier = Number(amount) * (selectedServing.value / 100);
  // เช่น ถ้าเลือก 1 cup (258g) => multiplier = 1 * 2.58 = 2.58

  const adjustedCalories = (food?.calories || 0) * multiplier;
  const adjustedProtein = (food?.protein || 0) * multiplier;
  const adjustedCarbs = (food?.carbs || 0) * multiplier;
  const adjustedFat = (food?.fat || 0) * multiplier;

  const total = adjustedProtein + adjustedCarbs + adjustedFat || 1;

  const proteinPercent = (adjustedProtein / total) * 100;
  const carbsPercent = (adjustedCarbs / total) * 100;
  const fatPercent = (adjustedFat / total) * 100;
  // คำนวณตัวคูณตามกรัมที่กรอก


  const macros = [
    { label: 'Protein', value: adjustedProtein, color: '#22c55e', target: targets.protein },
    { label: 'Net Carbs', value: adjustedCarbs, color: '#06b6d4', target: targets.carbs },
    { label: 'Fat', value: adjustedFat, color: '#f97316', target: targets.fat },
  ];

  return (
    <View className="flex-1 bg-[#1a1b2e] ">
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>
            <Text>⭐ </Text>
            {food.foodName}
          </Text>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </View>

        {/* Amount, Serving Size, Group */}
        <View
          style={{
            backgroundColor: '#23243a',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {/* Amount */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{
                backgroundColor: '#2a2c3d',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                color: 'white',
                width: 80,
              }}
            />
          </View>

          {/* Serving Size */}
          <View className="mb-5">
            <Text className="text-white font-bold text-lg mb-2">Serving Size</Text>

            {/* ปุ่ม Dropdown */}
            <TouchableOpacity
              onPress={() => setIsServingOpen(!isServingOpen)}
              className="bg-[#2a2c3d] rounded-md px-3 py-2 flex-row justify-between items-center"
            >
              <Text className="text-white text-base">{selectedServing.label}</Text>
              <Ionicons
                name={isServingOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="white"
              />
            </TouchableOpacity>

            {/* ตัวเลือก */}
            {isServingOpen && (
              <View className="bg-[#2a2c3d] rounded-md mt-1">
                {servingOptions
                  .filter((option: ServingOption) => option.value !== selectedServing.value)
                  .map((option: ServingOption) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setSelectedServing(option);
                        setIsServingOpen(false);
                      }}
                      className="py-2 px-3 border-t border-[#23243a]"
                    >
                      <Text className="text-white text-md">{option.label}</Text>
                    </TouchableOpacity>
                  ))}

              </View>
            )}
          </View>


          {/* Group (Picker) */}
          <View className="mb-5 ">
            <Text className="text-white font-bold text-lg mb-2">Group</Text>

            {/* ปุ่ม Dropdown */}
            <TouchableOpacity
              onPress={() => setIsOpen(!isOpen)}
              className="bg-[#2a2c3d] rounded-md px-3 py-2 flex-row justify-between items-center"
            >
              {/* ✅ แสดงเฉพาะตัวที่เลือก */}
              <Text className="text-white text-base">{group}</Text>
              <Ionicons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="white"
              />
            </TouchableOpacity>

            {/* ตัวเลือก */}
            {isOpen && (
              <View className="bg-[#2a2c3d] rounded-md mt-1">
                {mealOptions
                  // ✅ ซ่อนตัวเลือกที่เลือกอยู่
                  .filter((item) => item.value !== group)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => {
                        setGroup(item.value);
                        setIsOpen(false);
                      }}
                      className="py-2 px-3 border-t border-[#23243a]"
                    >
                      <Text className="text-white text-md">{item.label}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        </View>

        {/* Energy Summary */}
        <View
          style={{
            backgroundColor: '#2a2c3d',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Circle */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={100}
              tintColor="#444"
              backgroundColor="#1a1b2e"
              rotation={0}
            >
              {() => null}
            </AnimatedCircularProgress>

            {/* Protein */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(proteinPercent, 100)}
              tintColor="#22c55e"
              backgroundColor="transparent"
              rotation={0}
              style={{ position: 'absolute' }}
            />

            {/* Carbs */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(carbsPercent, 100)}
              tintColor="#06b6d4"
              backgroundColor="transparent"
              rotation={(Math.min(proteinPercent, 100) / 100) * 360}
              style={{ position: 'absolute' }}
            />

            {/* Fat */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(fatPercent, 100)}
              tintColor="#f97316"
              backgroundColor="transparent"
              rotation={((Math.min(proteinPercent, 100) + Math.min(carbsPercent, 100)) / 100) * 360}
              style={{ position: 'absolute' }}
            />

            {/* Center Text */}
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>
                {adjustedCalories.toFixed(0)}
              </Text>
              <Text style={{ color: 'white', fontSize: 12 }}>kcal</Text>
            </View>
          </View>

          <View style={{ marginLeft: 16 }}>
            {macros.map((m) => (
              <Text key={m.label} style={{ color: m.color, fontSize: 14, marginBottom: 6 }}>
                {m.label} ({((m.value / total) * 100).toFixed(0)}%) - {m.value.toFixed(0)}g
              </Text>
            ))}
          </View>
        </View>

        {/* Macronutrient Targets */}
        <View
          style={{
            backgroundColor: '#2a2c3d',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Text
            style={{ color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 12 }}
          >
            Macronutrient Targets
          </Text>
          {[
            {
              label: 'Energy',
              value: adjustedCalories,
              target: targets.calories,
              unit: 'kcal',
              color: '#fff',
            },
            ...macros.map((m) => ({
              label: m.label,
              value: m.value,
              target: m.target,
              color: m.color,
              unit: 'g',
            })),
          ].map((item) => {
            const percent = Math.min((item.value / (item.target || 1)) * 100, 100);
            return (
              <View key={item.label} style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 14, marginBottom: 6 }}>
                  {item.label} – {item.value.toFixed(0)} / {item.target} {item.unit} (
                  {percent.toFixed(0)}%)
                </Text>
                <View
                  style={{
                    height: 8,
                    width: '100%',
                    backgroundColor: '#374151',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color || '#fff',
                      height: 8,
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>


      {/* Add to Diary Button */}
      <View className="absolute left-0 right-0 bottom-0 px-4 pb-8 bg-[#1a1b2e] pt-5 ">
        <Pressable onPress={handleAddToDiary} className="bg-white py-2 rounded-full items-center mb-10">
          <Text className="text-black font-semibold text-lg">ADD TO DIARY</Text>
        </Pressable>
      </View>
    </View>
  );
}
