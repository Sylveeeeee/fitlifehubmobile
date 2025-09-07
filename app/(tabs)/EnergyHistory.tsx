import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryBar,
  VictoryLine,
} from 'victory-native';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

type EnergyEntry = {
  date: string;
  protein: number;
  carbs: number;
  fat: number;
  burned?: number; // เพิ่ม field สำหรับพลังงานที่ใช้ไป
  baseEnergyNeed?: number;
  activityCalories?: number;
  caloriesGoal?: number;
};

const RANGE_OPTIONS = [
  { label: '7 วัน', value: '7d' },
  { label: '14 วัน', value: '14d' },
  { label: '1 เดือน', value: '1m' },
];

const TYPE_OPTIONS = [
  { label: 'Consumed', value: 'consumed' },
  { label: 'Burned', value: 'burned' },
];

export default function EnergyHistory() {
  const [history, setHistory] = useState<EnergyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');
  const [type, setType] = useState<'consumed' | 'burned'>('consumed');
  const [showOnDashboard, setShowOnDashboard] = useState(true);

  const fetchEnergyHistory = useCallback(async () => {
    setLoading(true);

    try {
      const token = await getToken();

      const endpoint =
        type === 'consumed'
          ? `${API_URL}/api/food-entry/energy-history?range=${range}`
          : `${API_URL}/api/exercise-entry/energy-history?range=${range}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('❌ Fetch failed:', await res.text());
        throw new Error('Failed to fetch');
      }

      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) {
      console.error('🚨 Error fetching energy history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [range, type]);

  useEffect(() => {
    fetchEnergyHistory();
  }, [fetchEnergyHistory]);

  const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  // แยก data ตาม type
  const consumedData = sortedHistory.map((d) => ({
  date: formatDate(d.date),
  proteinKcal: (d.protein || 0) * 4,
  carbsKcal: (d.carbs || 0) * 4,
  fatKcal: (d.fat || 0) * 9,
  caloriesGoal: d.caloriesGoal || 0,
}));

const burnedData = sortedHistory.map((d) => ({
  date: formatDate(d.date),
  burnedKcal: d.burned || 0,
  baseKcal: d.baseEnergyNeed || 0,
  activityKcal: d.activityCalories || 0,
  caloriesGoal: d.caloriesGoal || 0,
}));

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }

  return (
    <View className="flex-1 bg-[#1c1d2a]">
      <View className="flex-row items-center justify-between pt-14 pb-6 px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 bg-[#1c1d2a]">
        <View className="w-[92%] self-center my-4 bg-[#232433] rounded-2xl p-4 shadow-lg">
          {/* Title */}
          <Text className="text-[#ffb300] text-lg font-bold mb-2">
            Energy History (kcal)
          </Text>

          {/* Filter Row */}
          <View className="flex-row justify-between items-center mb-3">
            {/* Type Selector */}
            <View className="flex-row gap-x-2">
              {TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setType(opt.value as 'consumed' | 'burned')}
                  className={`px-3 py-1 rounded-full ${type === opt.value ? 'bg-[#ffb300]' : 'bg-[#3a3b4d]'
                    }`}
                >
                  <Text className="text-white text-xs">{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Range Selector */}
            <View className="flex-row gap-x-2">
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
          </View>

          {/* Toggle */}
          <View className="flex-row justify-end items-center mb-3">
            <Text className="text-white text-xs mr-2">Show on Dashboard</Text>
            <Switch
              value={showOnDashboard}
              onValueChange={setShowOnDashboard}
              trackColor={{ false: '#555', true: '#ffb300' }}
              thumbColor="#fff"
            />
          </View>

          {/* Chart / Loading / Empty */}
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#ffb300" />
            </View>
          ) : history.length === 0 ? (
            <View className="py-6 items-center">
              <Text className="text-white text-base">No energy data available</Text>
            </View>
          ) : (
            <>
              <VictoryChart
                domainPadding={{ x: 20, y: 10 }}
                height={250}
                width={screenWidth * 0.92}
              >
                <VictoryAxis
                  tickFormat={(t: any) => t}
                  style={{
                    tickLabels: { fill: 'white', fontSize: 10 },
                    axis: { stroke: 'white' },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickCount={5}
                  tickFormat={(t: any) => `${t}`}
                  style={{
                    tickLabels: { fill: 'white', fontSize: 10 },
                    axis: { stroke: 'white' },
                    grid: { stroke: '#444' },
                  }}
                />
                
                {type === 'consumed' && (
                  <VictoryLine
                    data={consumedData.map((d) => ({
                      date: d.date,
                      y: d.caloriesGoal || 0,
                    }))}
                    x="date"
                    y="y"
                    style={{
                      data: {
                        stroke: '#fff',
                        strokeDasharray: '4,4',
                        strokeWidth: 1,
                      },
                    }}
                  />
                )}

                {type === 'consumed' ? (
                  <VictoryStack colorScale={['#22c55e', '#f97316', '#3b82f6']}>
                    <VictoryBar data={consumedData} x="date" y="proteinKcal" />
                    <VictoryBar data={consumedData} x="date" y="carbsKcal" />
                    <VictoryBar data={consumedData} x="date" y="fatKcal" />
                  </VictoryStack>
                ) : (
                  <VictoryStack colorScale={['#ef4444', '#a855f7', '#facc15']}>
                    <VictoryBar data={burnedData} x="date" y="baseKcal" />
                    <VictoryBar data={burnedData} x="date" y="activityKcal" />
                    <VictoryBar data={burnedData} x="date" y="burnedKcal" />
                  </VictoryStack>
                )}
              </VictoryChart>

              {/* Legend */}
              {type === 'consumed' ? (
                <View className="flex-row justify-center mt-3 flex-wrap gap-x-4 gap-y-2">
                  {[
                    { color: '#22c55e', label: 'Protein' },
                    { color: '#f97316', label: 'Carbs' },
                    { color: '#3b82f6', label: 'Fat' },
                  ].map((item) => (
                    <View key={item.label} className="flex-row items-center">
                      <View
                        className="w-3 h-1.5 rounded"
                        style={{ backgroundColor: item.color, marginRight: 4 }}
                      />
                      <Text className="text-white text-xs">{item.label}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="flex-row justify-center mt-3 flex-wrap gap-x-4 gap-y-2">
                  {[
                    { color: '#ef4444', label: 'Exercise' },
                    { color: '#facc15', label: 'Activity' },
                    { color: '#a855f7', label: 'BMR' },
                  ].map((item) => (
                    <View key={item.label} className="flex-row items-center">
                      <View
                        className="w-3 h-1.5 rounded"
                        style={{ backgroundColor: item.color, marginRight: 4 }}
                      />
                      <Text className="text-white text-xs">{item.label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Summary */}
              <View className="mt-4 w-full">
                {type === 'consumed'
                  ? consumedData.map((d, i) => (
                    <View key={i} className="flex-row justify-between mb-1">
                      <Text className="text-white text-xs">{d.date}</Text>
                      <Text className="text-white text-xs">
                        {Math.round(d.proteinKcal + d.carbsKcal + d.fatKcal)} kcal
                      </Text>
                    </View>
                  ))
                  : burnedData.map((d, i) => (
                    <View key={i} className="flex-row justify-between mb-1">
                      <Text className="text-white text-xs">{d.date}</Text>
                      <Text className="text-white text-xs">
                        {Math.round(d.activityKcal + d.baseKcal + d.burnedKcal)} kcal
                      </Text>
                    </View>
                  ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}