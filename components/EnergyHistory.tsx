import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function EnergyHistory() {
  return (
    <View className="w-[92%] self-center my-3 bg-[#232433] rounded-2xl p-4 shadow-lg items-center" style={{ minHeight: 260 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2 w-full">
        <Text className="text-white text-lg font-bold">Energy History (kcal)</Text>
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>
      {/* Mock Chart */}
      <View className="w-full" style={{ height: 150, position: 'relative', marginBottom: 8 }}>
        {/* เส้นกราฟแนวนอน */}
        {[10, 8, 6, 4, 2, 0].map((val, idx) => (
          <View key={val} className="flex-row items-center" style={{ position: 'absolute', top: idx * 25, left: 0, right: 0 }}>
            <View className="border-t border-gray-400 opacity-40 w-full absolute left-0 right-0" />
            <Text className="text-gray-300 text-xs" style={{ width: 24 }}>{val}</Text>
          </View>
        ))}
        {/* เส้นแกน X (mock) */}
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between px-2">
          <Text className="text-gray-300 text-xs">Jul 15</Text>
          <Text className="text-gray-300 text-xs">Jul 18</Text>
          <Text className="text-gray-300 text-xs">Jul 21</Text>
        </View>
      </View>
      {/* Legend */}
      <View className="flex-row justify-center mt-2 space-x-4">
        <View className="flex-row items-center">
          <View className="w-3 h-1.5 rounded bg-[#22c55e] mr-1" />
          <Text className="text-white text-xs">Protein</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1.5 rounded bg-[#2dd4bf] mr-1" />
          <Text className="text-white text-xs">Carbs</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1.5 rounded bg-[#f87171] mr-1" />
          <Text className="text-white text-xs">Fat</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-1.5 rounded bg-[#fbbf24] mr-1" />
          <Text className="text-white text-xs">Alcohol</Text>
        </View>
      </View>
    </View>
  );
}