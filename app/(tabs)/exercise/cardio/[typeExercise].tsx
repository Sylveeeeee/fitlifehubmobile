import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';


const cardioTypes = {
  walking: {
    label: 'Walking',
    effortLevels: [
      { label: 'Light', desc: 'เดินช้า/เดินเล่น', factor: 2.8 },
      { label: 'Moderate', desc: 'เดินเร็ว', factor: 3.8 },
      { label: 'Vigorous', desc: 'เดินขึ้นเนิน/เดินเร็วมาก', factor: 5.0 },
    ],
  },
  running: {
    label: 'Running',
    effortLevels: [
      { label: 'Light', desc: 'วิ่งช้า (jogging)', factor: 7.0 },
      { label: 'Moderate', desc: 'วิ่งปานกลาง', factor: 9.8 },
      { label: 'Vigorous', desc: 'วิ่งเร็ว/interval', factor: 11.0 },
    ],
  },
  swimming: {
    label: 'Swimming',
    effortLevels: [
      { label: 'Light', desc: 'ว่ายน้ำช้า', factor: 6.0 },
      { label: 'Moderate', desc: 'ว่ายน้ำออกกำลัง', factor: 8.0 },
      { label: 'Vigorous', desc: 'ว่ายน้ำเร็ว/แข่ง', factor: 10.0 },
    ],
  },
  // เพิ่มประเภทอื่นๆ ได้ที่นี่
};

const durationOptions = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
];

const mealOptions = [
  { label: 'Uncategorized', value: 'Uncategorized' },
  { label: 'Breakfast', value: 'Breakfast' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Dinner', value: 'Dinner' },
  { label: 'Snacks', value: 'Snacks' },
];

export default function CardioScreen() {
  const router = useRouter();
  const { typeExercise } = useLocalSearchParams();
  const typeKey =
    typeof typeExercise === 'string'
      ? typeExercise.toLowerCase()
      : Array.isArray(typeExercise) && typeof typeExercise[0] === 'string'
      ? typeExercise[0].toLowerCase()
      : undefined;
  const cardioType =
    typeKey && cardioTypes[typeKey as keyof typeof cardioTypes]
      ? cardioTypes[typeKey as keyof typeof cardioTypes]
      : cardioTypes.walking;

  const [selectedDuration, setSelectedDuration] = useState(durationOptions[1]);
  const [selectedEffort, setSelectedEffort] = useState(cardioType.effortLevels[0]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState('Uncategorized');
  const [userWeight, setUserWeight] = useState(70);
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedEffort(cardioType.effortLevels[0]);
  }, [cardioType]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await res.json();
        if (user.weight) setUserWeight(user.weight);
      } catch (e) {}
    };
    fetchProfile();
  }, []);

  // สูตรคำนวณ kcal: MET x weight(kg) x duration(hr)
  const energyBurned = (selectedEffort.factor * userWeight * (selectedDuration.value / 60)).toFixed(1);

  const handleAddToDiary = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/api/exercise-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: 'Cardio',
          type: cardioType.label,
          duration: selectedDuration.value,
          calories: Number(energyBurned),
          mealType: group,
          effort: selectedEffort.label,
          timestamp: new Date().toISOString(),
          note,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        console.log('Add to diary failed:', error);
        return;
      }
      router.replace('/diary');
    } catch (e) {}
    setLoading(false);
  };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-[#1A1B28] pt-12 px-4">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl text-white font-bold">General Walking</Text>
            </View>

        {/* Effort Level */}
        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Effort Level</Text>
          <View className="flex-row">
            {cardioType.effortLevels.map((level) => (
              <TouchableOpacity
                key={level.label}
                className={`px-4 py-2 rounded-xl mr-2 ${selectedEffort.label === level.label ? 'bg-[#ffb300]' : 'bg-[#292b40]'}`}
                onPress={() => setSelectedEffort(level)}
              >
                <Text className="text-white">{level.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-gray-400 text-xs mt-1">{selectedEffort.desc}</Text>
        </View>

        {/* Duration */}
        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Duration</Text>
          <View className="flex-row">
            {durationOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`px-4 py-2 rounded-xl mr-2 ${selectedDuration.value === option.value ? 'bg-[#ffb300]' : 'bg-[#292b40]'}`}
                onPress={() => setSelectedDuration(option)}
              >
                <Text className="text-white">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Energy Burned */}
        <View className="bg-[#292b40] rounded-lg px-4 py-3 mb-3">
          <Text className="text-gray-300">Energy Burned</Text>
          <Text className="text-white text-lg">{energyBurned} kcal</Text>
        </View>

        {/* Group */}
        <View className="mb-5 ">
          <Text className="text-white font-bold text-lg mb-2">Group</Text>
          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            className="bg-[#2a2c3d] rounded-md px-3 py-2 flex-row justify-between items-center"
          >
            <Text className="text-white text-base">{group}</Text>
            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="white"
            />
          </TouchableOpacity>
          {isOpen && (
            <View className="bg-[#2a2c3d] rounded-md mt-1">
              {mealOptions
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

        <View className="mb-5">
          <Text className="text-white font-bold text-lg mb-2">Note</Text>
          <TextInput
            className="bg-[#2a2c3d] text-white rounded-md px-3 py-2"
            value={note}
            onChangeText={setNote}
            placeholder=" Add additional notes "
            placeholderTextColor="#888"
            multiline
          />
        </View>

        {/* Add to Diary */}
        <TouchableOpacity
          className="bg-gray-100 py-3 rounded-xl items-center"
          onPress={handleAddToDiary}
          disabled={loading}
        >
          <Text className="text-black text-base font-bold">{loading ? 'Saving...' : 'ADD TO DIARY'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}