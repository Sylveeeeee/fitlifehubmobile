import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterStep7() {
  const [checked, setChecked] = useState([false, false, false, false]);

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Terms of Service</Text>
      <ScrollView className="mx-4 mb-8 bg-[#232433] rounded-2xl px-4 py-6">
        <Text className="text-white mb-4">
          Please accept the Terms of Service before continuing to your account.
        </Text>
        <CheckItem
          label="Check All"
          checked={checked[0]}
          onPress={() => setChecked([!checked[0], !checked[0], !checked[0], !checked[0]])}
        />
        <CheckItem
          label="I agree to the Cronometer Terms of Service."
          checked={checked[1]}
          onPress={() => setChecked([checked[0], !checked[1], checked[2], checked[3]])}
        />
        <CheckItem
          label="I agree to receive newsletters and promotional emails"
          checked={checked[2]}
          onPress={() => setChecked([checked[0], checked[1], !checked[2], checked[3]])}
        />
        <CheckItem
          label="I agree to receive personalized in-app ads."
          checked={checked[3]}
          onPress={() => setChecked([checked[0], checked[1], checked[2], !checked[3]])}
        />
        <Text className="text-gray-400 text-xs mt-4">
          *Users may receive informational emails from Cronometer
        </Text>
      </ScrollView>
      {/* Continue Button */}
      <View className="px-8">
        <View className="bg-gray-600 rounded-full py-3 items-center opacity-60">
          <Text className="text-gray-300 text-lg font-bold">CONTINUE</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function CheckItem({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return (
    <Pressable className="flex-row items-center mb-3" onPress={onPress}>
      <View className={`w-6 h-6 rounded border-2 mr-3 ${checked ? 'border-[#ffb300] bg-[#ffb300]' : 'border-[#ffb300]'}`} />
      <Text className="text-white">{label}</Text>
    </Pressable>
  );
}