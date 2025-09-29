import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory-native';
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

export default function EnergySummaryCard() {
  const [history, setHistory] = useState<EnergyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<EnergyEntry | null>(null);

  const fetchEnergyHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/food-entry/energy-history?range=7d`, {
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
  }, []);

  useEffect(() => {
    fetchEnergyHistory();
  }, [fetchEnergyHistory]);

  const stackedData = history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(d => ({
      date: formatDate(d.date),
      protein: d.protein, // ใช้ค่าจริงจาก DB
      carbs: d.carbs,
      fat: d.fat,
      calories: d.calories,
      caloriesGoal: d.caloriesGoal,
      original: d,
    }));

  return (
    <View className="bg-[#232433] rounded-2xl p-5 mb-5 shadow-lg shadow-black/40 w-[100%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 border-b border-white/10 pb-2">
        <Text className="text-white text-lg font-extrabold tracking-wide">Retroactive Energy</Text>
        <TouchableOpacity
          className="bg-[#ffb300]/20 px-3 py-1 rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-[#ffb300] text-xs font-semibold">SEE ALL</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {loading ? (
        <View className="py-[2px] items-center">
          <ActivityIndicator size="small" color="#ffb300" />
          <Text className="text-white/70 text-xs mt-2">Loading data...</Text>
        </View>
      ) : history.length === 0 ? (
        <View className="py-6 items-center">
          <Text className="text-white/60 text-sm italic">No data available</Text>
        </View>
      ) : (
        <View className="items-center">
          <VictoryChart
            domainPadding={{ x: 25, y: 5 }}
            height={180}
            width={screenWidth * 0.9}
            padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
          >
            <VictoryAxis
              tickValues={stackedData.map((d) => d.date)}
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
              {['protein', 'carbs', 'fat'].map((key) => (
                <VictoryBar
                  key={key}
                  cornerRadius={2}
                  data={stackedData}
                  x="date"
                  y={key}
                  events={[
                    {
                      target: "data",
                      eventHandlers: {
                        onPressIn: (evt, clickedProps) => {
                          setSelectedData(history[clickedProps.index]);
                          setModalVisible(true);
                        },
                      },
                    },
                  ]}
                />
              ))}
            </VictoryStack>
          </VictoryChart>

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
        </View>
      )}

      {/* Modal */}
      {modalVisible && selectedData && (
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-[#232433] p-4 rounded-xl w-[80%]">
              <Text className="text-white font-bold text-lg mb-2">
                {formatDate(selectedData.date)}
              </Text>
              <Text className="text-white text-sm">Protein: {Math.round(selectedData.protein)} g</Text>
              <Text className="text-white text-sm">Carbs: {Math.round(selectedData.carbs)} g</Text>
              <Text className="text-white text-sm">Fat: {Math.round(selectedData.fat)} g</Text>
              <Text className="text-white text-sm mt-2 font-semibold">Total Calories: {Math.round(selectedData.calories)} kcal</Text>
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
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}
