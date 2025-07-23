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
    <View className="w-[92%] self-center my-3 bg-[#232433] rounded-2xl p-4 shadow-lg items-center" style={{ minHeight: 340 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2 w-full">
        <Text className="text-white text-lg font-bold">Energy History (kcal)</Text>
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>

      {/* รายละเอียดพลังงาน */}
      <View className="w-full mb-4">
        <Text className="text-white text-base">Calories: {totals.calories}</Text>
        <Text className="text-[#22c55e] text-base">Protein: {totals.protein}g</Text>
        <Text className="text-[#2dd4bf] text-base">Carbs: {totals.carbs}g</Text>
        <Text className="text-[#f87171] text-base">Fat: {totals.fat}g</Text>
      </View>

      {/* Bar Chart */}
      <View className="w-full items-center mb-4">
        <BarChart
          data={{
            labels: ['Protein', 'Carbs', 'Fat', 'Alcohol'],
            datasets: [
              {
                data: [totals.protein, totals.carbs, totals.fat, 0],
                colors: [
                  () => '#22c55e', // Protein
                  () => '#2dd4bf', // Carbs
                  () => '#f87171', // Fat
                  () => '#fbbf24', // Alcohol
                ],
              },
            ],
          }}
          width={screenWidth * 0.85}
          height={240}
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
          segments={4} // 0g, 30g, 60g, 90g, 120g (4 ช่อง = 30g ต่อช่อง)
          style={{
            borderRadius: 12,
          }} yAxisLabel={''}        />
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
