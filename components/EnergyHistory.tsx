import { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

const screenWidth = Dimensions.get('window').width;

type RootStackParamList = {
  Dashboard: undefined;
  EnergyHistory: undefined;
};

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

type EnergyEntry = {
  date: string;
  protein: number;
  carbs: number;
  fat: number;
};

export default function EnergySummaryCard() {
  const navigation = useNavigation<DashboardNavProp>();
  const [history, setHistory] = useState<EnergyEntry[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stackedData = history.map((d) => ({
    date: formatDate(d.date),
    proteinKcal: d.protein * 4,
    carbsKcal: d.carbs * 4,
    fatKcal: d.fat * 9,
  }));

  return (
    <View className="bg-[#232433] rounded-2xl p-4 mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-lg font-bold">พลังงานย้อนหลัง</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EnergyHistory')}>
          <Text className="text-[#ffb300] text-sm">ดูทั้งหมด</Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {loading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color="#ffb300" />
        </View>
      ) : history.length === 0 ? (
        <Text className="text-white text-sm">ไม่มีข้อมูล</Text>
      ) : (
        <VictoryChart
          domainPadding={{ x: 15, y: 10 }}
          height={150}
          width={screenWidth * 0.85}
        >
          <VictoryAxis
            tickFormat={(t: any) => t}
            style={{
              tickLabels: { fill: 'white', fontSize: 8 },
              axis: { stroke: 'white' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t: any) => `${t}`}
            style={{
              tickLabels: { fill: 'white', fontSize: 8 },
              axis: { stroke: 'white' },
              grid: { stroke: '#444' },
            }}
          />
          <VictoryStack colorScale={['#22c55e', '#f97316', '#3b82f6']}>
            <VictoryBar data={stackedData} x="date" y="proteinKcal" />
            <VictoryBar data={stackedData} x="date" y="carbsKcal" />
            <VictoryBar data={stackedData} x="date" y="fatKcal" />
          </VictoryStack>
        </VictoryChart>
      )}
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}