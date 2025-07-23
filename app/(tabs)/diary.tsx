import React, { useEffect, useState } from 'react';
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

const { width } = Dimensions.get('window');

const initialMealData = {
  Uncategorized: [],
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: [],
};

export default function DiaryScreen() {
  const meals = ['Uncategorized', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
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

  const addFood = (
    meal: MealType,
    food: { name: string; calories: number; protein: number; fat: number; carbs: number }
  ) => {
    const updatedMealData = {
      ...mealData,
      [meal]: [...mealData[meal], food],
    };
    setMealData(updatedMealData);

    setTotals((prev) => ({
      calories: prev.calories + food.calories,
      protein: prev.protein + food.protein,
      fat: prev.fat + food.fat,
      carbs: prev.carbs + food.carbs,
    }));
  };

  const summarySlides = [
    {
      type: 'energy',
      data: [
        { label: 'Consumed', value: totals.calories },
        { label: 'Expenditure', value: 2108 },
        { label: 'Remaining', value: targets.calories - totals.calories },
      ],
    },
    {
      type: 'targets',
      data: [
        {
          label: 'Energy',
          value: `${totals.calories} / ${targets.calories} kcal`,
          percent: Math.min((totals.calories / targets.calories) * 100, 100),
        },
        {
          label: 'Protein',
          value: `${totals.protein} / ${targets.protein} g`,
          percent: Math.min((totals.protein / targets.protein) * 100, 100),
        },
        {
          label: 'Net Carbs',
          value: `${totals.carbs} / ${targets.carbs} g`,
          percent: Math.min((totals.carbs / targets.carbs) * 100, 100),
        },
        {
          label: 'Fat',
          value: `${totals.fat} / ${targets.fat} g`,
          percent: Math.min((totals.fat / targets.fat) * 100, 100),
        },
      ],
    },
  ];

  const pieData = [
    { value: totals.protein, color: '#4FD1C5' },
    { value: totals.carbs, color: '#63B3ED' },
    { value: totals.fat, color: '#F6AD55' },
  ];

  const toggleMeal = (meal: string) => {
    setExpanded(expanded === meal ? null : meal);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#15161f]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-4">
        {/* ลบ pt-12 เพราะ SafeAreaView จัดให้ */}
        <Text className="text-white text-base font-semibold">✔</Text>
        <Text className="text-white text-xl font-bold">Today</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={() =>
              addFood('Lunch', {
                name: 'Grilled Chicken',
                calories: 250,
                protein: 30,
                fat: 8,
                carbs: 0,
              })
            }
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Carousel */}
      <View className="h-52">
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
                  <View className="flex-row justify-center">
                    <AnimatedCircularProgress
                      size={140}
                      width={14}
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
                </View>
              ) : (
                <View>
                  <Text className="text-gray-400 font-semibold text-xs mb-1">TARGETS</Text>
                  {item.data.map((d, i) => (
                    <View key={i} className="mb-2">
                      <View className="flex-row justify-between">
                        <Text className="text-white font-semibold text-sm">{d.label}</Text>
                        <Text className="text-white text-sm">{d.value}</Text>
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
                className="bg-[#292b40] rounded-xl px-4 py-4 flex-row justify-between items-center"
              >
                <Text className="text-white font-bold">{typedMeal}</Text>
                <Ionicons
                  name={expanded === typedMeal ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              {expanded === typedMeal && (
                <View className="bg-[#1f2133] px-4 py-2 rounded-b-xl">
                  {mealData[typedMeal].length === 0 ? (
                    <Text className="text-gray-400">No entries</Text>
                  ) : (
                    mealData[typedMeal].map((item, index) => (
                      <Text key={index} className="text-white">
                        {item.name}
                      </Text>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 bg-[#1a1b2e] border-t border-gray-700">
        {['Discover', 'Diary', 'Add', 'Foods', 'More'].map((tab, idx) => (
          <TouchableOpacity key={idx} className="items-center">
            <Ionicons
              name={
                tab === 'Discover'
                  ? 'bar-chart'
                  : tab === 'Diary'
                  ? 'book'
                  : tab === 'Add'
                  ? 'add-circle'
                  : tab === 'Foods'
                  ? 'nutrition'
                  : 'ellipsis-horizontal'
              }
              size={tab === 'Add' ? 36 : 24}
              color={tab === 'Diary' ? '#ff7a1a' : '#fff'}
            />
            {tab !== 'Add' && <Text className="text-white text-xs mt-1">{tab}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
