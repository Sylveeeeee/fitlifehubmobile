import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import WaterCount from '../../components/watercount';
import EnergyHistory from '@/components/EnergyHistory';
import { useState } from 'react';
import { useEnergy } from '@/context/EnergyContext';
import Charts from "@/components/Charts";
import Report from "@/components/Report";

type EnergyContextType = {
  totals: { calories: number; protein: number; carbs: number; fat: number };
};

export default function Index() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { totals } = useEnergy() as EnergyContextType;

  // Target ของผู้ใช้ (สามารถปรับให้ดึงจาก API/profile จริงได้)
  const proteinTarget = 105;
  const carbTarget = 250;
  const fatTarget = 60;

  return (
    <View className="flex-1 bg-[#15161f]">
      {/* StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="#232433" />

      {/* Header */}
      <View className="w-full pb-2 px-4 bg-[#232433] rounded-b-[20px] pt-[50px]">
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 60, height: 60, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text className="text-[#ffb300] text-[32px] font-extrabold">FITLIFE HUB</Text>
          </View>

          <View className="flex-row items-center space-x-4">
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://img.icons8.com/ios-filled/50/232738/appointment-reminders--v1.png' }}
                style={{ width: 28, height: 28, marginRight: 12, tintColor: '#ffb300' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://img.icons8.com/ios-filled/50/232738/settings.png' }}
                style={{ width: 28, height: 28, tintColor: '#ffb300' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navbar */}
        <View className="w-full h-[38px] flex-row items-center px-1 py-1 mt-2 bg-white rounded-[16px]">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Dashboard', 'Charts', 'Report', 'Snapshot'].map((tab, index) => (
              <View key={tab} className="flex-row items-center">
                <TouchableOpacity
                  className={`px-3 py-1 rounded-full mr-1 ${activeTab === tab ? 'bg-[#ffb300]' : ''}`}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    className={`text-base ${
                      activeTab === tab ? 'text-white font-semibold' : 'text-[#232738] font-medium'
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
                {index < 3 && <View className="w-[1px] h-5 bg-gray-300 mx-1 self-center opacity-40" />}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 bg-[#15161f]" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="items-center px-4 pt-4">
          {activeTab === 'Dashboard' && (
            <>
              <EnergyHistory totals={totals} />
              <WaterCount />
            </>
          )}

          {activeTab === 'Charts' && (
            <View className="text-white mt-10 text-lg">
              <Charts />
            </View>
          )}

          {activeTab === 'Report' && (
            <Report
              periodLabel="19–25 ส.ค. 2025"
              energy={{
                energyTarget: proteinTarget + carbTarget * 4 + fatTarget * 9,
                expenditureAboveBaseline: 0,
                totalTarget: proteinTarget + carbTarget * 4 + fatTarget * 9,
                consumed: totals.calories, // sync กับ diary
              }}
              macros={[
                { key: "protein", label: "โปรตีน", unit: "g", target: proteinTarget, consumed: totals.protein, color: "#10b981" },
                { key: "carbs", label: "คาร์บ", unit: "g", target: carbTarget, consumed: totals.carbs, color: "#f59e0b" },
                { key: "fat", label: "ไขมัน", unit: "g", target: fatTarget, consumed: totals.fat, color: "#ef4444" },
              ]}
            />
          )}

          {activeTab === 'Snapshot' && (
            <Text className="text-white mt-10 text-lg">Snapshot content here...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
