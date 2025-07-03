import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const GLASS_SIZE_ML = 250;

export default function WaterCount() {
  const [count, setCount] = useState(0);

  const addGlass = () => setCount(count + 1);
  const removeGlass = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <View className="w-[92%] self-center my-6 bg-[#181d2b] border-2 border-[#22b6ff] rounded-3xl shadow-lg px-6 py-7 items-center">
      {/* Sport Icon & Title */}
      <View className="flex-row items-center mb-3">
        <Text className="text-2xl font-extrabold text-[#22b6ff] mr-2">💪</Text>
        <Text className="text-xl font-bold text-white tracking-wider">WATER TRACKER</Text>
      </View>
      {/* Glass Count */}
      <View className="flex-row items-end mb-1">
        <Text className="text-6xl font-extrabold text-[#ffb300] drop-shadow-lg">{count}</Text>
        <Text className="text-lg font-bold text-[#22b6ff] ml-2 mb-2">GLASS</Text>
      </View>
      {/* ml */}
      <Text className="text-base text-[#b2cdfa] mb-4 font-semibold tracking-wide">
        {count * GLASS_SIZE_ML} ml
      </Text>
      {/* Buttons */}
      <View className="flex-row items-center gap-x-10 mt-2">
        <TouchableOpacity
          className="bg-[#232738] border-2 border-[#ffb300] rounded-full w-16 h-16 items-center justify-center active:scale-95"
          onPress={removeGlass}
          activeOpacity={0.8}
        >
          <Text className="text-[#ffb300] text-4xl font-extrabold">-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gradient-to-tr from-[#22b6ff] to-[#38e7ff] border-2 border-[#22b6ff] rounded-full w-16 h-16 items-center justify-center shadow-lg active:scale-95"
          onPress={addGlass}
          activeOpacity={0.8}
        >
          <Text className="text-white text-4xl font-extrabold">+</Text>
        </TouchableOpacity>
      </View>
      {/* Note */}
      <Text className="text-xs text-[#b2cdfa] mt-5 italic">
        1 GLASS = {GLASS_SIZE_ML} ml • Stay hydrated, stay strong!
      </Text>
    </View>
  );
}