import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { VictoryChart, VictoryAxis, VictoryBar, VictoryLine, VictoryStack } from 'victory-native';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

const screenWidth = Dimensions.get('window').width;

type EnergyEntry = {
  date: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  caloriesGoal: number;
};

const RANGE_OPTIONS = [
  { label: '7 day', value: '7d' },
  { label: '14 day', value: '14d' },
  { label: '1 month', value: '1m' },
];

export default function EnergySummaryCard() {
  const [range, setRange] = useState('7d');
  const [history, setHistory] = useState<EnergyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<EnergyEntry | null>(null);

  const fetchEnergyHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/food-entry/energy-history?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) {
      console.error('🚨 Error fetching energy history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchEnergyHistory();
  }, [fetchEnergyHistory]);

  const chartData = history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d) => ({
      date: formatDate(d.date),
      calories: d.calories,
      caloriesGoal: d.caloriesGoal,
      original: d,
      protein: d.protein,
      carbs: d.carbs,
      fat: d.fat,
    }));

  // stackedChartData
  const stackedChartData = chartData.map(d => {
    const totalMacroKcal = d.protein * 4 + d.carbs * 4 + d.fat * 9;
    const proteinKcal = (d.protein * 4 / totalMacroKcal) * d.calories;
    const carbsKcal = (d.carbs * 4 / totalMacroKcal) * d.calories;
    const fatKcal = (d.fat * 9 / totalMacroKcal) * d.calories;

    return {
      date: d.date,
      proteinKcal,
      carbsKcal,
      fatKcal,
      caloriesGoal: d.caloriesGoal,
      original: d.original,
    };
  });

  return (
    <>
      <View className="bg-[#232433] rounded-2xl p-5 mb-5 shadow-lg shadow-black/40 w-[100%]">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3 border-b border-white/10 pb-2">
          <Text className="text-white text-lg font-extrabold tracking-wide">
            Retroactive Energy
          </Text>
        </View>

        {/* Range Selector */}
        <View className="flex-row gap-x-2 mb-2 justify-center">
          {RANGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setRange(opt.value)}
              className={`px-3 py-1 rounded-full ${range === opt.value ? 'bg-[#ffb300]' : 'bg-[#3a3b4d]'
                }`}
            >
              <Text className="text-white text-xs">{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        {!loading && history.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <VictoryChart
              domainPadding={{ x: 25, y: 5 }}
              height={180}
              width={range === '1m' ? screenWidth * 2  : screenWidth * 0.9} // เพิ่มความกว้างเมื่อ 1 เดือน
              padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
            >
              <VictoryAxis
                tickValues={chartData.map((d) => d.date)}
                tickFormat={(t) => t}
                style={{
                  tickLabels: { fill: 'white', fontSize: 10, fontWeight: 'bold' },
                  axis: { stroke: 'white', strokeWidth: 0.5 },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => `${t}`}
                style={{
                  tickLabels: { fill: 'white', fontSize: 9 },
                  axis: { stroke: 'white', strokeWidth: 0.5 },
                  grid: { stroke: '#444', strokeDasharray: '4,4' },
                }}
              />

              <VictoryStack colorScale={['#22c55e', '#f97316', '#3b82f6']}>
                {['proteinKcal', 'carbsKcal', 'fatKcal'].map((key) => (
                  <VictoryBar
                    key={key}
                    data={stackedChartData}
                    x="date"
                    y={key}
                    style={{
                      data: { width: range === '1m' ? 20 : 15 }, // กว้างขึ้นเมื่อ 1 เดือน
                    }}
                    events={[{
                      target: 'data',
                      eventHandlers: {
                        onPressIn: (evt, props) => {
                          setSelectedData(stackedChartData[props.index].original);
                          setModalVisible(true);
                        }
                      }
                    }]}
                  />
                ))}
              </VictoryStack>

              {/* Goal Line */}
              <VictoryLine
                data={chartData.map((d) => ({ date: d.date, y: d.caloriesGoal || 0 }))}
                x="date"
                y="y"
                style={{
                  data: { stroke: '#fff', strokeDasharray: '4,4', strokeWidth: 1 },
                }}
              />
            </VictoryChart>
          </ScrollView>
        )}

        {/* Legend */}
        <View className="flex-row justify-center mt-2 space-x-4">
          <View className="flex-row items-center mr-2">
            <View className="w-3 h-3 bg-[#22c55e] rounded-sm" />
            <Text className="text-white text-xs">Protein</Text>
          </View>
          <View className="flex-row items-center mr-2">
            <View className="w-3 h-3 bg-[#f97316] rounded-sm" />
            <Text className="text-white text-xs">Carbs</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 bg-[#3b82f6] rounded-sm" />
            <Text className="text-white text-xs">Fat</Text>
          </View>
        </View>

        {/* Modal */}
        {modalVisible && selectedData && (
          <Modal transparent animationType="fade" visible={modalVisible}>
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-[#232433] p-4 rounded-xl w-[80%]">
                <Text className="text-white font-bold text-lg mb-2">{formatDate(selectedData.date)}</Text>
                <Text className="text-white text-sm">Protein: {Math.round(selectedData.protein)} g</Text>
                <Text className="text-white text-sm">Carbs: {Math.round(selectedData.carbs)} g</Text>
                <Text className="text-white text-sm">Fat: {Math.round(selectedData.fat)} g</Text>
                <Text className="text-white text-sm mt-2 font-semibold">
                  Total Calories: {Math.round(selectedData.calories)} kcal
                </Text>
                <TouchableOpacity
                  className="mt-3 bg-[#ffb300] p-2 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-black text-center font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}