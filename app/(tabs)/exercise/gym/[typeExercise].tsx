import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';

// กำหนดข้อมูลแต่ละประเภท
const gymTypes = {
  weighttraining: {
    label: 'Weight Training',
    effortLevels: [
      { label: 'Beginner', desc: 'น้ำหนักเบา/ท่าพื้นฐาน', factor: 3.5 },
      { label: 'Intermediate', desc: 'น้ำหนักปานกลาง/ท่าผสม', factor: 5.0 },
      { label: 'Advanced', desc: 'น้ำหนักมาก/ท่ายาก', factor: 6.0 },
    ],
  },
  bodyweight: {
    label: 'Bodyweight',
    effortLevels: [
      { label: 'Beginner', desc: 'ท่าง่าย เช่น push-up, squat', factor: 3.8 },
      { label: 'Intermediate', desc: 'ท่าผสม, plank, burpee', factor: 5.0 },
      { label: 'Advanced', desc: 'ท่ายาก เช่น muscle-up', factor: 6.0 },
    ],
  },
  hiit: {
    label: 'HIIT',
    effortLevels: [
      { label: 'Light', desc: 'Interval เบา', factor: 6.0 },
      { label: 'Moderate', desc: 'Interval ปานกลาง', factor: 8.0 },
      { label: 'Intense', desc: 'Interval หนัก', factor: 10.0 },
    ],
  },
  crossfit: {
    label: 'CrossFit',
    effortLevels: [
      { label: 'Beginner', desc: 'WOD เบา', factor: 5.0 },
      { label: 'Intermediate', desc: 'WOD ปานกลาง', factor: 7.0 },
      { label: 'Advanced', desc: 'WOD หนัก', factor: 9.0 },
    ],
  },
  stretching: {
    label: 'Stretching',
    effortLevels: [
      { label: 'Light', desc: 'ยืดเหยียดเบา', factor: 2.3 },
      { label: 'Moderate', desc: 'ยืดเหยียดปานกลาง', factor: 3.0 },
      { label: 'Intense', desc: 'ยืดเหยียดเข้มข้น', factor: 3.8 },
    ],
  },
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

const gymTypeKeys = ['weighttraining', 'bodyweight', 'hiit', 'crossfit', 'stretching'] as const;
type GymTypeKey = typeof gymTypeKeys[number];

export default function GymExerciseScreen() {
  const router = useRouter();
  const { typeExercise } = useLocalSearchParams();
  const typeKey =
    typeof typeExercise === 'string'
      ? typeExercise.toLowerCase()
      : Array.isArray(typeExercise) && typeof typeExercise[0] === 'string'
      ? typeExercise[0].toLowerCase()
      : undefined;

  const gymType =
    (typeKey && gymTypeKeys.includes(typeKey as GymTypeKey)
      ? gymTypes[typeKey as GymTypeKey]
      : gymTypes.weighttraining);

  const [selectedDuration, setSelectedDuration] = useState(durationOptions[1]);
  const [selectedEffort, setSelectedEffort] = useState(gymType.effortLevels[0]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState('Uncategorized');
  const [userWeight, setUserWeight] = useState(70);
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedEffort(gymType.effortLevels[0]);
  }, [typeExercise]);

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
          category: 'Gym',
          type: gymType.label,
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
        Alert.alert('Add to diary failed', error.message || 'Unknown error');
        setLoading(false);
        return;
      }
      router.replace('/diary');
    } catch (e) {
      Alert.alert('Error', 'Something went wrong');
    }
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
          <Text className="text-xl text-white font-bold">{gymType.label}</Text>
        </View>

        {/* Effort Level */}
        <View className="mb-3">
          <Text className="text-gray-300 mb-1">Effort Level</Text>
          <View className="flex-row">
            {gymType.effortLevels.map((level) => (
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