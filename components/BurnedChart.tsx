import { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory-native';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

const screenWidth = Dimensions.get('window').width;

type BurnedEntry = {
  date: string;
  baseEnergyNeed: number;
  activityCalories: number;
  burned: number;
};

const RANGE_OPTIONS = [
  { label: '7 day', value: '7d' },
  { label: '14 day', value: '14d' },
  { label: '1 month', value: '1m' },
];

export default function BurnedChart() {
  const [range, setRange] = useState('7d');
  const [history, setHistory] = useState<BurnedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<BurnedEntry | null>(null);

  const fetchBurnedHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/exercise-entry/energy-history?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) {
      console.error('🚨 Error fetching burned history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchBurnedHistory();
  }, [fetchBurnedHistory]);

  const stackedData = history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d) => ({
      date: formatDate(d.date),
      baseKcal: d.baseEnergyNeed || 0,
      activityKcal: d.activityCalories || 0,
      burnedKcal: d.burned || 0,
    }));

  return (
    <>
      <View className="bg-[#232433] rounded-2xl p-5 mb-5 shadow-lg shadow-black/40 w-[100%] justify-center items-center">
        <Text className="text-white text-lg font-extrabold mb-3">Burned Energy</Text>

        {/* Range Selector */}
        <View className="flex-row gap-x-2 mb-2">
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

        {loading ? (
          <View className="py-6 items-center">
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : history.length === 0 ? (
          <View className="py-6 items-center">
            <Text className="text-white/60 italic">No data available</Text>
          </View>
        ) : (
          <>
            <VictoryChart
              domainPadding={{ x: 25, y: 5 }}
              height={200}
              width={screenWidth * 0.92}
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
              <VictoryStack colorScale={['#ef4444', '#a855f7', '#facc15']}>
                {['baseKcal', 'activityKcal', 'burnedKcal'].map((key) => (
                  <VictoryBar
                    key={key}
                    cornerRadius={2}
                    data={stackedData}
                    x="date"
                    y={key}
                    events={[
                      {
                        target: 'data',
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
            <View className="flex-row justify-center mt-2 space-x-4 ">
              <View className="flex-row items-center mr-2">
                <View className="w-3 h-3 bg-[#ef4444] rounded-sm" />
                <Text className="text-white text-xs">BMR</Text>
              </View>
              <View className="flex-row items-center mr-2">
                <View className="w-3 h-3 bg-[#facc15] rounded-sm" />
                <Text className="text-white text-xs">Exercise</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-[#a855f7] rounded-sm" />
                <Text className="text-white text-xs">Activity</Text>
              </View>
            </View>

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
                    <Text className="text-white text-sm">
                      BMR: {selectedData.baseEnergyNeed} kcal
                    </Text>
                    <Text className="text-white text-sm">
                      Activity: {selectedData.activityCalories} kcal
                    </Text>
                    <Text className="text-white text-sm">
                      Exercise: {selectedData.burned} kcal
                    </Text>
                    <Text className="text-white text-sm mt-2 font-semibold">
                      Total: {selectedData.baseEnergyNeed +
                        selectedData.activityCalories +
                        selectedData.burned}{' '}
                      kcal
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
          </>
        )}
      </View>
    </>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}