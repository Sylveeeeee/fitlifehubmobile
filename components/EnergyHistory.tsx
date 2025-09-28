import { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryStack, VictoryBar } from 'victory-native';
import { useNavigation, NavigationContainerRefContext } from '@react-navigation/native';
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
  const navContext = useContext(NavigationContainerRefContext);
  const navigation = navContext ? useNavigation<DashboardNavProp>() : null;

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

  const stackedData = history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // ✅ เรียงวันที่
    .map((d) => ({
      date: formatDate(d.date),
      proteinKcal: d.protein * 4,
      carbsKcal: d.carbs * 4,
      fatKcal: d.fat * 9,
    }));

  return (
    <View className="bg-[#232433] rounded-2xl p-5 mb-5 shadow-lg shadow-black/40 w-[94%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3 border-b border-white/10 pb-2">
        <Text className="text-white text-lg font-extrabold tracking-wide">Retroactive Energy</Text>
        <TouchableOpacity
          className="bg-[#ffb300]/20 px-3 py-1 rounded-full"
          onPress={() => {
            if (navigation) {
              navigation.navigate('EnergyHistory');
            } else {
              Alert.alert('Navigation unavailable', 'This component is not inside a navigator.');
            }
          }}
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
          <Text className="text-white/60 text-sm italic">ไม่มีข้อมูลในช่วงนี้</Text>
        </View>
      ) : (
        <View className="items-center">
          <VictoryChart
            domainPadding={{ x: 25, y: 5 }} // เพิ่ม x padding
            height={180}
            width={screenWidth * 0.9}
            padding={{ top: 20, bottom: 30, left: 40, right: 20 }} // บีบด้านล่าง
            style={{ parent: { marginTop: -10, marginBottom: -10 } }}
          >
            <VictoryAxis
              tickValues={stackedData.map((d) => d.date)} // ✅ Tick ตรงกับ data
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
              <VictoryBar cornerRadius={2} data={stackedData} x="date" y="proteinKcal" />
              <VictoryBar cornerRadius={2} data={stackedData} x="date" y="carbsKcal" />
              <VictoryBar cornerRadius={2} data={stackedData} x="date" y="fatKcal" />
            </VictoryStack>
          </VictoryChart>

          {/* Legend */}
          <View className="flex-row justify-center mt-2 space-x-4">
            <View className="flex-row items-center space-x-1">
              <View className="w-3 h-3 bg-[#22c55e] rounded-sm" />
              <Text className="text-white text-xs">Protein</Text>
            </View>
            <View className="flex-row items-center space-x-1">
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
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}
