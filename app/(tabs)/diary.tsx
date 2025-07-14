import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mocked meal data for now; later replace with data from backend
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
  const [mealData, setMealData] = useState(initialMealData);

  const toggleMeal = (meal: string) => {
    setExpanded(expanded === meal ? null : meal);
  };

  const summarySlides = [
    {
      type: 'energy',
      data: [
        { label: 'Consumed', value: 0 },
        { label: 'Expenditure', value: 2108 },
        { label: 'Remaining', value: 2108 },
      ],
    },
    {
      type: 'targets',
      data: [
        { label: 'Energy', value: '0.0 / 2107.6 kcal', percent: 0 },
        { label: 'Protein', value: '0.0 / 131.7 g', percent: 0 },
        { label: 'Net Carbs', value: '0.0 / 237.1 g', percent: 0 },
        { label: 'Fat', value: '0.0 / 70.3 g', percent: 0 },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-[#1a1b2e]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
        <Text className="text-white text-base font-semibold">✔</Text>
        <Text className="text-white text-xl font-bold">Today</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
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
                  <Text className="text-gray-400 font-semibold text-xs mb-1">ENERGY SUMMARY</Text>
                  <View className="flex-row justify-between">
                    {item.data.map((d, i) => (
                      <View key={i} className="items-center">
                        <View className="w-20 h-20 rounded-full border-4 border-gray-700 justify-center items-center">
                          <Text className="text-white text-lg font-bold">{d.value}</Text>
                          <Text className="text-white text-xs">kcal</Text>
                        </View>
                        <Text className="text-white mt-1 text-xs">{d.label}</Text>
                      </View>
                    ))}
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
                      <View className="h-2 bg-gray-700 rounded-full mt-1">
                        <View style={{ width: `${d.percent}%` }} className="h-2 bg-teal-400 rounded-full" />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      </View>

      {/* Water */}
      <TouchableOpacity className="px-6 py-4 border-b border-gray-700">
        <Text className="text-white font-semibold">Water  0 / 64 fl oz</Text>
      </TouchableOpacity>

      {/* Meal Sections */}
      <ScrollView className="flex-1 px-4 pb-6">
        {meals.map((meal, idx) => (
          <View key={idx} className="mb-2">
            <TouchableOpacity
              onPress={() => toggleMeal(meal)}
              className="bg-[#292b40] rounded-xl px-4 py-4 flex-row justify-between items-center"
            >
              <Text className="text-white font-bold">{meal}</Text>
              <Ionicons
                name={expanded === meal ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            {expanded === meal && (
              <View className="bg-[#1f2133] px-4 py-2 rounded-b-xl">
                {mealData[meal].length === 0 ? (
                  <Text className="text-gray-400">No entries</Text>
                ) : (
                  mealData[meal].map((item: any, index: number) => (
                    <Text key={index} className="text-white">{item.name}</Text>
                  ))
                )}
              </View>
            )}
          </View>
        ))}
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
    </View>
  );
}
