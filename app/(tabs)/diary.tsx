import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useEnergy } from '@/context/EnergyContext';
import { SafeAreaView } from 'react-native-safe-area-context'; // เพิ่ม
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DiaryScreen() {
  const meals = ['Uncategorized', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    totals,
    setTotals,
  } = useEnergy() as {
    totals: { calories: number; protein: number; fat: number; carbs: number };
    setTotals: React.Dispatch<
      React.SetStateAction<{ calories: number; protein: number; fat: number; carbs: number }>
    >;
  };
  const [targets, setTargets] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  type MealType = 'Uncategorized' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

  const [mealData, setMealData] = useState<Record<MealType, any[]>>({
    Uncategorized: [],
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const fetchEntries = async (dateObj = selectedDate) => {
    const token = await getToken();
    const utc7 = new Date(dateObj.getTime());
    const today = utc7.toISOString().slice(0, 10); // YYYY-MM-DD
    console.log('fetching for date:', today);
    const res = await fetch(`${API_URL}/api/food-entry?date=${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const entries = await res.json();
    console.log('📦 Raw entries from API:', entries);

    entries.forEach((entry: any, index: number) => {
      console.log(`🔹 Entry ${index + 1}:`, {
        id: entry.id,
        mealType: entry.mealType,
        date: entry.date,
        quantity: entry.quantity,
        food: entry.food,
      });
    });
    // จัดหมวดหมู่
    const newMealData: Record<MealType, any[]> = {
      Uncategorized: [],
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: [],
    };
    entries.forEach((entry: any) => {
      const meal = (entry.mealType || 'Uncategorized') as MealType;
      newMealData[meal] = [...(newMealData[meal] || []), entry];
    });
    setMealData(newMealData);

    // รวม total
    setTotals({
      calories: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.calories || 0) * e.quantity) / 100, 0
      ),
      protein: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.protein || 0) * e.quantity) / 100, 0
      ),
      fat: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.fat || 0) * e.quantity) / 100, 0
      ),
      carbs: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.carbs || 0) * e.quantity) / 100, 0
      ),

    });
  };

  useEffect(() => {
    fetchEntries(selectedDate);
  }, [selectedDate]);

  const handleDeleteEntry = async (entryId: number) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/food-entry/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
      // ลบออกจาก state ทันที (optional)
      setMealData((prev) => {
        const newData = { ...prev };
        (Object.keys(newData) as MealType[]).forEach((meal) => {
          newData[meal] = newData[meal].filter((item) => item.id !== entryId);
        });
        return newData;
      });
    } catch (e) {
      // handle error
    }
  };


  useEffect(() => {
    const fetchTargets = async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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



  const summarySlides = [
    {
      type: 'energy',
      data: [
        { label: 'Consumed', value: totals.calories },
        { label: 'Expenditure', value: targets.calories },
        { label: 'Remaining', value: targets.calories - totals.calories },
      ],
    },
    {
      type: 'targets',
      data: [
        {
          label: 'Energy',
          value: `${totals.calories} / ${targets.calories}`,
          percent: Math.min((totals.calories / targets.calories) * 100, 100),
        },
        {
          label: 'Protein',
          value: `${totals.protein} / ${targets.protein} `,
          percent: Math.min((totals.protein / targets.protein) * 100, 100),
        },
        {
          label: 'Net Carbs',
          value: `${totals.carbs} / ${targets.carbs} `,
          percent: Math.min((totals.carbs / targets.carbs) * 100, 100),
        },
        {
          label: 'Fat',
          value: `${totals.fat} / ${targets.fat} `,
          percent: Math.min((totals.fat / targets.fat) * 100, 100),
        },
      ],
    },
  ];

  // คำนวณยอดรวม
  const sum = totals.protein + totals.carbs + totals.fat;

  // คำนวณเปอร์เซ็นต์แต่ละอัน
  const proteinPercent = sum ? (totals.protein / sum) * 100 : 0;
  const carbsPercent = sum ? (totals.carbs / sum) * 100 : 0;
  const fatPercent = sum ? (totals.fat / sum) * 100 : 0;

  const toggleMeal = (meal: string) => {
    setExpanded(expanded === meal ? null : meal);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-[#15161f]">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          {/* ลบ pt-12 เพราะ SafeAreaView จัดให้ */}
          <Text className="text-white text-base font-semibold">✔</Text>
          <View className="flex-row items-center justify-center mb-2">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-[#292b40] rounded-xl px-4 py-2"
            >
              <Text className="text-white font-semibold">
                {selectedDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
              maximumDate={new Date()}
            />
          )}
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Carousel */}
        <View className="h-54">
          <FlatList
            data={summarySlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            renderItem={({ item }) => (
              <View style={{ width }} className="px-6 py-2">
                {item.type === 'energy' ? (
                  <View>
                    <Text className="text-gray-400 font-semibold text-xs mb-1">
                      ENERGY SUMMARY
                    </Text>
                    <View className="flex-row justify-center items-end grid-cols-3 gap-4 mb-4">
                      <View style={{ width: 110, height: 110, justifyContent: 'center', alignItems: 'center' }}>
                        {/* วงโปรตีน */}
                        <AnimatedCircularProgress
                          size={110}
                          width={10}
                          fill={proteinPercent}
                          tintColor="#22c55e"
                          backgroundColor="#23243a"
                          rotation={0}
                          style={{ position: 'absolute' }}
                        />
                        {/* วงคาร์บ */}
                        <AnimatedCircularProgress
                          size={110}
                          width={10}
                          fill={carbsPercent}
                          tintColor="#06b6d4"
                          backgroundColor="transparent"
                          rotation={(proteinPercent / 100) * 360}
                          style={{ position: 'absolute' }}
                        />
                        {/* วงไขมัน */}
                        <AnimatedCircularProgress
                          size={110}
                          width={10}
                          fill={fatPercent}
                          tintColor="#f97316"
                          backgroundColor="transparent"
                          rotation={((proteinPercent + carbsPercent) / 100) * 360}
                          style={{ position: 'absolute' }}
                        />
                        {/* ตรงกลาง */}
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
                          <Text className="text-white font-bold text-xl">{totals.calories}</Text>
                          <Text className="text-gray-400 text-sm">kcal</Text>
                          <Text className="text-gray-500 text-xs mt-1">Total</Text>
                        </View>
                      </View>
                      <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={Math.min((totals.calories / targets.calories) * 100, 100) || 0}
                        tintColor="#F6AD55"
                        backgroundColor="#2D3748"
                        rotation={0}
                        lineCap="round"
                      >
                        {(fill: number) => (
                          <View className="items-center">
                            <Text className="text-white font-bold text-xl">{totals.calories}</Text>
                            <Text className="text-gray-400 text-sm">kcal</Text>
                            <Text className="text-gray-500 text-xs mt-1">
                              of {targets.calories} kcal
                            </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>
                      <AnimatedCircularProgress
                        size={110}
                        width={10}
                        fill={Math.min((totals.calories / targets.calories) * 100, 100) || 0}
                        tintColor="#F6AD55"
                        backgroundColor="#2D3748"
                        rotation={0}
                        lineCap="round"
                      >
                        {(fill: number) => (
                          <View className="items-center">
                            <Text className="text-white font-bold text-xl">{totals.calories}</Text>
                            <Text className="text-gray-400 text-sm">kcal</Text>
                            <Text className="text-gray-500 text-xs mt-1">
                              of {targets.calories} kcal
                            </Text>
                          </View>
                        )}
                      </AnimatedCircularProgress>

                    </View>
                    <View className=' flex-row justify-between items-center px-3'>
                      <Text className='font-semibold text-white'>Consumed</Text>
                      <Text className='font-semibold text-white'>Expenditure</Text>
                      <Text className='font-semibold text-white'>Remaining</Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text className="text-gray-400 font-semibold text-xs mb-1">TARGETS</Text>
                    {item.data.map((d, i) => (
                      <View key={i} className="mb-2">
                        <View className="flex-row justify-between">
                          <View className="flex-row ">
                            <Text className="text-white font-semibold text-sm">{d.label}</Text>
                            <Text className="text-white text-sm ml-2">
                              {typeof d.value === 'number'
                                ? d.value.toFixed(1)
                                :
                                typeof d.value === 'string' && d.value.includes('/')
                                  ? d.value
                                    .split('/')
                                    .map((v) =>
                                      !isNaN(Number(v.trim()))
                                        ? Number(v.trim()).toFixed(1)
                                        : v.trim()
                                    )
                                    .join(' / ')
                                  : d.value}
                            </Text>
                          </View>
                          {'percent' in d && (
                            <Text className="text-white text-xs">{d.percent.toFixed(0)}%</Text>
                          )}
                        </View>
                        {'percent' in d && (
                          <View className="h-2 bg-gray-700 rounded-full mt-1">
                            <View
                              style={{ width: `${d.percent}%` }}
                              className="h-2 bg-teal-400 rounded-full"
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          />

        </View>

        {/* Water & Meals */}
        <TouchableOpacity className="bg-[#292b40] rounded-xl px-4 py-4 flex-row justify-between items-center my-4 mx-4">
          <Text className="text-white font-semibold">Water 0 / 64 fl oz</Text>
        </TouchableOpacity>

        <ScrollView className="flex-1 px-4 pb-6">
          {meals.map((meal) => {
            const typedMeal = meal as MealType;
            return (
              <View key={typedMeal} className="mb-2">
                <TouchableOpacity
                  onPress={() => toggleMeal(typedMeal)}
                  className={` px-4 py-4 flex-row justify-between items-center bg-[#292b40] ${expanded === typedMeal ? 'rounded-t-xl' : 'rounded-xl'
                    }`}
                >
                  <Text className="text-white font-bold">{typedMeal}</Text>
                  <Ionicons
                    name={expanded === typedMeal ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
                {expanded === typedMeal && (
                  <View className="bg-[#1f2133]  rounded-b-xl  ">
                    {mealData[typedMeal].length === 0 ? (
                      <View className="flex-1 px-4 py-2">
                        <Text className="text-gray-400">No entries</Text>
                      </View>
                    ) : (
                      mealData[typedMeal].map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center px-4 py-2 border-t border-[#15161f]">
                          <TouchableOpacity
                            onPress={() => router.push(`/foods/${item.foodId}`)}
                            className="flex-1"
                          >
                            <Text className="text-white">{item.food?.foodName || item.food?.name || '-'}</Text>
                            <Text className="text-gray-400 text-xs">
                              {item.quantity} x {item.food?.calories || 0} kcal
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteEntry(item.id)}
                          >
                            <Ionicons name="trash" size={18} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
