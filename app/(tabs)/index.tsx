import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import WaterCount from '../../components/watercount';
import EnergyHistory from '@/components/EnergyHistory';
import { useEffect, useState } from 'react';
import { useEnergy } from '@/context/EnergyContext';

import NetEnergyChart from '@/components/NetEnergyChart';
import { registerForPushNotifications, scheduleDailyNotifications } from '../services/notificationService';
import BurnedChart from '@/components/BurnedChart';

type EnergyContextType = {
  totals: { calories: number; protein: number; carbs: number; fat: number };
};

export default function Index() {
  
  useEffect(() => {
    async function setupNotifications() {
      await registerForPushNotifications();
      await scheduleDailyNotifications();
    }
    setupNotifications();
  }, []);
  
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
        </View>

        {/* Tab Navbar */}
        <View className="w-full h-[38px] flex-row items-center px-1 py-1 mt-2 bg-white rounded-[16px]">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Dashboard'].map((tab, index) => (
              <View key={tab} className="flex-row items-center">
                <TouchableOpacity
                  className={`px-3 py-1 rounded-full mr-1 ${activeTab === tab ? 'bg-[#ffb300]' : ''}`}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    className={`text-base ${activeTab === tab ? 'text-white font-semibold' : 'text-[#232738] font-medium'
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
        <View className="items-center px-4 pt-[20px]">
          {activeTab === 'Dashboard' && (
            <>
              <NetEnergyChart />
              <EnergyHistory />
              <BurnedChart />
              <WaterCount />
            </>
          )}

          
          

          
        

          
        </View>
      </ScrollView>
    </View>
  );
}
