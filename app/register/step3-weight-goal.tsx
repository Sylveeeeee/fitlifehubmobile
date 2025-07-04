import React, { useState } from 'react';
import { View, Text, SafeAreaView, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRegister } from './RegisterContext';

export default function RegisterStep3({ navigation }: { navigation: any }) {
  const { registerData, setRegisterData } = useRegister();
  const [goalWeight, setGoalWeight] = useState('');

  const handleNext = () => {
    if (goalWeight) {
      setRegisterData({ ...registerData, goalWeight });
      navigation.navigate('step4-goal-rate');
    }
  };
  const handleSkip = () => {
    navigation.navigate('step4-goal-rate');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set Your Goal Weight</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        Enter your target weight you want to achieve.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-8 mx-4 mb-8 items-center">
        <View className="bg-[#fbb6ce] rounded-full p-4 mb-3">
          <MaterialCommunityIcons name="scale-bathroom" size={36} color="#ffb300" />
        </View>
        <Text className="text-white text-xl font-bold mb-2">Goal Weight (kg)</Text>
        <TextInput
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
          placeholder="Enter weight"
          placeholderTextColor="#aaa"
          className="bg-[#35364a] text-white text-lg rounded-xl px-4 py-2 mt-4 w-40 text-center"
        />
      </View>
      {/* Next/Skip */}
      <View className="px-8">
        <Pressable
          className={`rounded-full py-3 items-center mb-2 ${goalWeight ? 'bg-[#ffb300]' : 'bg-gray-600 opacity-60'}`}
          disabled={!goalWeight}
          onPress={handleNext}
        >
          <Text className="text-gray-900 text-lg font-bold">NEXT</Text>
        </Pressable>
        <Pressable className="items-center" onPress={handleSkip}>
          <Text className="text-[#38b2ac] text-base font-bold">SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}