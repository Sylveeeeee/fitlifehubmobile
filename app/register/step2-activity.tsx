import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRegister } from './RegisterContext';

const activityLevels = [
  { label: 'No Activity', value: 'no_activity' },
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'very_active' },
];

export default function RegisterStep2({ navigation }: { navigation: any }) {
  const { registerData, setRegisterData } = useRegister();
  const [selected, setSelected] = useState(0);

  const handleNext = () => {
    setRegisterData({ ...registerData, activityLevel: activityLevels[selected].value });
    navigation.navigate('step3-weight-goal'); // ชื่อ route ต้องตรงกับ RegisterStack
  };
  const handleSkip = () => {
    setRegisterData({ ...registerData, activityLevel: 'no_activity' });
    navigation.navigate('step3-weight-goal');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set an Activity Level</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We recommend selecting a baseline level that best describes your day-to-day life.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-6 mx-4 mb-8 items-center">
        <View className="bg-[#35364a] rounded-full p-4 mb-3">
          <MaterialCommunityIcons name="run" size={36} color="#ffb300" />
        </View>
        <Text className="text-white text-xl font-bold mb-1">{activityLevels[selected].label}</Text>
        <Text className="text-gray-400 text-center mb-4">
          Health professionals monitoring comatose patients should select this activity level.
        </Text>
        <View className="flex-row justify-center items-center mt-4">
          {activityLevels.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => setSelected(i)}
              className={`w-6 h-6 rounded-full mx-1 border-2 ${i === selected ? 'border-[#ffb300] bg-[#ffb300]' : 'border-[#ffb300]'}`}
            />
          ))}
        </View>
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <Pressable
          className="bg-[#ffb300] rounded-full py-3 items-center mb-2"
          onPress={handleNext}
        >
          <Text className="text-[#181929] text-lg font-bold">NEXT</Text>
        </Pressable>
        <Pressable className="items-center" onPress={handleSkip}>
          <Text className="text-[#38b2ac] text-base font-bold">SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}