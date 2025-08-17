import { View, Text, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

type Totals = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

interface EnergyHistoryProps {
  totals: Totals;
}

const screenWidth = Dimensions.get('window').width;

export default function EnergyHistory({ totals }: EnergyHistoryProps) {
  return (
    <View
      className="w-[92%] self-center my-3 bg-[#232433] rounded-2xl p-4 shadow-lg items-center"
      style={{ minHeight: 300 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2 w-full">
        <Text className="text-[#ffb300] text-lg font-bold">Energy History</Text>
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>

      {/* Calories */}
      <View className="w-full mb-2">
        <Text className="text-white text-base">Calories: {totals.calories} kcal</Text>
      </View>

      {/* Bar Chart */}
      <View className="w-full items-center mb-1">
        <BarChart
          data={{
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [
              {
                data: [totals.protein, totals.carbs, totals.fat],
                colors: [
                  () => '#22c55e', // Protein
                  () => '#2dd4bf', // Carbs
                  () => '#f87171', // Fat
                ],
              },
            ],
          }}
          width={screenWidth * 0.85}
          height={180}
          yAxisSuffix="g"
          fromZero={true}
          withCustomBarColorFromData={true}
          flatColor={true}
          chartConfig={{
            backgroundColor: '#232433',
            backgroundGradientFrom: '#232433',
            backgroundGradientTo: '#232433',
            decimalPlaces: 0,
            color: () => '#ffffff',
            labelColor: () => '#ffffff',
            propsForBackgroundLines: {
              stroke: '#444',
            },
          }}
          verticalLabelRotation={0}
          segments={4}
          style={{
            borderRadius: 12,
          }}
          yAxisLabel=""
        />
      </View>

      {/* ตัวเลขใต้กราฟแท่งแบบแม่นยำ */}
      <View
        className="relative w-[85%] self-center mt-[-12px] mb-4"
        style={{ height: 24 }}
      >
        <Text
          className="text-xs text-center absolute"
          style={{
            left: (screenWidth * 0.85) * (1 / 6) - 10,
            color: '#22c55e',
            top: 4,
          }}
        >
          {totals.protein}g
        </Text>
        <Text
          className="text-xs text-center absolute"
          style={{
            left: (screenWidth * 0.85) * (3 / 6) - 30, // ลดจาก -10 เป็น -30 เพื่อขยับมาทางซ้าย
            color: '#2dd4bf',
            top: 4,
          }}
        >
          {totals.carbs}g
        </Text>
        <Text
          className="text-xs text-center absolute"
          style={{
            left: (screenWidth * 0.85) * (5 / 6) - 45,
            color: '#f87171',
            top: 4,
          }}
        >
          {totals.fat}g
        </Text>
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
      </View>
    </View>
  );
}
