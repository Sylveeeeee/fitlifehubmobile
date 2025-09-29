import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import RecommendationCard from "@/components/RecommendationCard";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useEnergy } from '@/context/EnergyContext';
import { SafeAreaView } from 'react-native-safe-area-context'; // เพิ่ม
import { useRouter } from 'expo-router';
import { registerForPushNotifications, scheduleDailyNotifications } from '../services/notificationService';
import { ToastProvider, useToast } from '@/components/ToastProvider';
import RecommendationNotification from '@/components/RecommendationCard';

const { width } = Dimensions.get('window');

export default function DiaryScreen() {
  useEffect(() => {
    async function setupNotifications() {
      await registerForPushNotifications();
      await scheduleDailyNotifications();
    }
    setupNotifications();
  }, []);
  const meals = ['Uncategorized', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exerciseEntries, setExerciseEntries] = useState<any[]>([]);
  const { showToast } = useToast();
  const [showRecommendation, setShowRecommendation] = useState(false);

  const {
    totals,
    setTotals,
  } = useEnergy() as {
    totals: { calories: number; protein: number; fat: number; carbs: number };
    setTotals: React.Dispatch<
      React.SetStateAction<{ calories: number; protein: number; fat: number; carbs: number }>
    >;
  };
  const [targets, setTargets] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0, activityCalories: 0, baseEnergyNeed: 0 });
  const [dailyGoal, setDailyGoal] = useState<{ calories: number; protein: number; fat: number; carbs: number } | null>(null);

  const fetchDailyGoal = async (dateObj = selectedDate) => {
    try {
      const token = await getToken();
      const today = new Date(dateObj.getTime()).toISOString().slice(0, 10);
      // ปรับ endpoint ถ้า backend ของคุณต่างออกไป (เช่น /api/profile/daily-goal หรือ /api/daily-goal)
      const res = await fetch(`${API_URL}/api/daily-goal?date=${today}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setDailyGoal(null);
        console.log('fetchDailyGoal: no goal, status', res.status);

        return;
      }

      const json = await res.json();
      const goal = json.goal ?? json;
      setDailyGoal({
        calories: goal.calories ?? 0,
        protein: goal.protein ?? 0,
        fat: goal.fat ?? 0,
        carbs: goal.carbs ?? 0,
      });
      console.log('fetchDailyGoal: from API', goal);
    } catch (e) {
      setDailyGoal(null);
    }
  };

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
    const resEx = await fetch(`${API_URL}/api/exercise-entry?date=${today}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const exerciseEntries = await resEx.json();
    setExerciseEntries(exerciseEntries);

    await fetchDailyGoal(dateObj);

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

    // รวม exercise เข้าแต่ละ meal ด้วย
    exerciseEntries.forEach((entry: any) => {
      const meal = (entry.mealType || 'Uncategorized') as MealType;
      // เพิ่ม property เพื่อแยกประเภท
      newMealData[meal] = [
        ...(newMealData[meal] || []),
        { ...entry, isExercise: true }
      ];
    });
    setMealData(newMealData);

    // รวม total
    const foodTotals = {
      calories: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.calories || 0) * e.quantity), 0
      ),
      protein: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.protein || 0) * e.quantity), 0
      ),
      fat: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.fat || 0) * e.quantity), 0
      ),
      carbs: entries.reduce((sum: number, e: any) =>
        sum + ((e.food?.carbs || 0) * e.quantity), 0
      ),
    };

    const exerciseCalories = exerciseEntries.reduce((sum: number, e: any) =>
      sum + (e.calories || 0), 0
    );
    // รวม calories ทั้งหมด (อาหาร - exercise)
    setTotals({
      calories: foodTotals.calories,
      protein: foodTotals.protein,
      fat: foodTotals.fat,
      carbs: foodTotals.carbs,
    });

    const totalTarget = targets.calories + exerciseCalories;


  };

  const exerciseCalories = exerciseEntries.reduce((sum: number, e: any) =>
    sum + (e.calories || 0), 0
  );

  useEffect(() => {
    fetchEntries(selectedDate);
    fetchDailyGoal(selectedDate);

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
      showToast('Added to diary', 'success');
    } catch (e) {
      showToast('Failed to add to diary', 'error');
    }
  };

  const handleDeleteExercise = async (entryId: number) => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/exercise-entry/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries(selectedDate); // รีเฟรชข้อมูลหลังลบ
      await fetchEntries(selectedDate);
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
        activityCalories: user.activityCalories,
        baseEnergyNeed: user.baseEnergyNeed,
      });
    };

    fetchTargets();
  }, []);

  const totalTarget = Math.max(
    dailyGoal?.calories ?? (targets.baseEnergyNeed + targets.activityCalories + exerciseCalories),
    1
  );

  const displayTargets = {
    calories: dailyGoal?.calories ?? targets.calories,
    protein: dailyGoal?.protein ?? targets.protein,
    fat: dailyGoal?.fat ?? targets.fat,
    carbs: dailyGoal?.carbs ?? targets.carbs,
  };

  const energyDenominator = Math.max(dailyGoal?.calories ?? totalTarget, 1);

  const summarySlides = [
    {
      type: 'energy',
      data: [
        { label: 'Consumed', value: totals.calories },
        { label: 'Expenditure', value: totalTarget },
        // Remaining เทียบกับ dailyGoal ถ้ามี ถ้าไม่มีก็เทียบกับ totalTarget
        { label: 'Remaining', value: (dailyGoal?.calories ?? totalTarget) - totals.calories },
      ],
    },

    {
      type: 'targets',
      data: [
        {
          label: 'Energy',
          value: `${totals.calories} / ${energyDenominator}`,
          percent: Math.min((totals.calories / energyDenominator) * 100, 100),
        },
        {
          label: 'Protein',
          value: `${totals.protein} / ${displayTargets.protein}`,
          percent: displayTargets.protein ? Math.min((totals.protein / displayTargets.protein) * 100, 100) : 0,
        },
        {
          label: 'Net Carbs',
          value: `${totals.carbs} / ${displayTargets.carbs}`,
          percent: displayTargets.carbs ? Math.min((totals.carbs / displayTargets.carbs) * 100, 100) : 0,
        },
        {
          label: 'Fat',
          value: `${totals.fat} / ${displayTargets.fat}`,
          percent: displayTargets.fat ? Math.min((totals.fat / displayTargets.fat) * 100, 100) : 0,
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

  const baseEnergyNeed = targets.baseEnergyNeed;
  const activityCalories = targets.activityCalories;

  const basePercent = (baseEnergyNeed / totalTarget) * 100;
  const activityPercent = (activityCalories / totalTarget) * 100;
  const exercisePercent = (exerciseCalories / totalTarget) * 100;

  const remainingCalories = (dailyGoal?.calories ?? targets.calories) - totals.calories;
  const [showNotification, setShowNotification] = useState(false);
  const [hasNotification, setHasNotification] = useState(remainingCalories !== 0);

  // คำนวณข้อความแจ้งเตือน
  const remaining = remainingCalories;

  let message = "";
  let type: "success" | "error";

  if (remaining > 100) {
    message = `You still need ${remaining} kcal to reach your daily goal. Keep going! 💪`;
    type = "success";
  } else if (remaining >= -100 && remaining <= 100) {
    message = "Congrats! You've reached your daily goal 🎉";
    type = "success";
  } else {
    message = `You exceeded your daily goal by ${Math.abs(
      remaining
    )} kcal. Try to balance next meal! ⚖️`;
    type = "error";
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-[#15161f]">

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
          <View className="flex justify-center items-center ">
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false); // ✅ ปิดทันที
                if (date) setSelectedDate(date);
              }}
              maximumDate={new Date()}
            />
          </View>

          {/* ปุ่มกระดิ่ง */}
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => setShowRecommendation(true)} >

              <View style={{ position: 'relative' }}>
                <Ionicons name="notifications-outline" size={28} color="#fff" />
                {hasNotification && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'red',
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Overlay แสดงข้อความ */}
          {showRecommendation && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowRecommendation(false)}
              style={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                bottom: -50,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999,
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 10,
                  width: '90%',
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* ข้อความจาก remaining */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: type === 'error' ? 'red' : 'green',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}
                >
                  {message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
                          width={8}
                          fill={proteinPercent}
                          tintColor="#27ff76"
                          backgroundColor="#23243a"
                          rotation={0}
                          style={{ position: 'absolute' }}
                        />
                        {/* วงคาร์บ */}
                        <AnimatedCircularProgress
                          size={110}
                          width={8}
                          fill={carbsPercent}
                          tintColor="#00d9ff"
                          backgroundColor="transparent"
                          rotation={(proteinPercent / 100) * 360}
                          style={{ position: 'absolute' }}
                        />
                        {/* วงไขมัน */}
                        <AnimatedCircularProgress
                          size={110}
                          width={8}
                          fill={fatPercent}
                          tintColor="#ff974c"
                          backgroundColor="transparent"
                          rotation={((proteinPercent + carbsPercent) / 100) * 360}
                          style={{ position: 'absolute' }}
                        />
                        {/* ตรงกลาง */}
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
                          <Text className="text-white font-bold text-xl">{totals.calories}</Text>
                          <Text className="text-gray-400 text-sm">kcal</Text>
                        </View>
                      </View>

                      {/* Exersice*/}
                      <View style={{ width: 110, height: 110, justifyContent: 'center', alignItems: 'center' }}>
                        {/* วง base energy (สีม่วง) */}
                        <AnimatedCircularProgress
                          size={116}
                          width={8}
                          fill={Math.min(basePercent, 100)}
                          tintColor="#775bce"
                          rotation={0}
                          style={{ position: 'absolute' }}
                        />

                        {/* วง activity (สีม่วงเข้ม) */}
                        <AnimatedCircularProgress
                          size={116}
                          width={8}
                          fill={Math.min(activityPercent, 100)}
                          tintColor="#372474"
                          rotation={(basePercent / 100) * 360}
                          style={{ position: 'absolute' }}
                        />

                        {/* วง exercise (สีส้ม) */}
                        <AnimatedCircularProgress
                          size={116}
                          width={8}
                          fill={Math.min(exercisePercent, 100)}
                          tintColor="#F6AD55"

                          rotation={((basePercent + activityPercent) / 100) * 360}
                          style={{ position: 'absolute' }}
                        />

                        {/* ตรงกลาง */}
                        <View style={{
                          position: 'absolute',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 120,
                          height: 120,
                        }}>
                          <Text className="text-white font-bold text-xl">{totalTarget}</Text>
                          <Text className="text-gray-400 text-sm">kcal</Text>
                        </View>
                      </View>

                      {/* Remaining*/}
                      <AnimatedCircularProgress
                        size={110}
                        width={8}
                        fill={Math.min((totals.calories / totalTarget) * 100, 100) || 0}
                        tintColor="#fff"
                        backgroundColor="#23243a"
                        rotation={0}
                      >
                        {(fill: number) => (
                          <View className="items-center">
                            <Text className="text-white font-bold text-xl">{totalTarget}</Text>
                            <Text className="text-gray-400 text-sm">kcal</Text>
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

        <View className="flex-row justify-center ">
          <View className='flex-row justify-center items-center space-x-2 bg-[#292b40] rounded-xl px-2 py-2'>
            {summarySlides.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                  backgroundColor: index === activeSlide ? '#ffb300' : '#4B5563', // active = ส้ม, inactive = เทา
                }}
              />
            ))}
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pb-6 mt-5">
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
                          {item.isExercise ? (
                            // แสดง exercise entry
                            <View className="flex-1">
                              <Text className="text-teal-400 font-bold">{item.type || '-'}</Text>
                              <Text className="text-gray-400 text-xs">
                                {item.duration} min, {item.calories} kcal
                              </Text>
                              {item.note && (
                                <Text className="text-gray-500 text-xs">{item.note}</Text>
                              )}
                            </View>
                          ) : (
                            // แสดง food entry
                            <TouchableOpacity
                              onPress={() => router.push(`/foods/${item.foodId}`)}
                              className="flex-1"
                            >
                              <Text className="text-white">{item.food?.foodName || item.food?.name || '-'}</Text>
                              <Text className="text-gray-400 text-xs">
                                {item.quantity} x {item.food?.calories || 0} kcal
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => item.isExercise
                              ? handleDeleteExercise(item.id)
                              : handleDeleteEntry(item.id)
                            }
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
