import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import WaterCount  from '../../components/watercount';
import EnergyHistory from '@/components/EnergyHistory';

export default function Index() {
  
  return (
    <View className="flex-1  bg-[#15161f]">
      {/* Header */}
      <View className="w-full pt-[40px] pb-2 px-4 bg-[#232433]  rounded-b-[20px] ">
        <View className="flex-row items-center justify-between">
          {/* Logo & Title */}
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 60, height: 60, marginRight: 8, }}
              resizeMode="contain"
            />
            <Text className="text-[#ffb300] text-[32px] font-extrabold ">FITLIFE HUB</Text>
          </View>
          {/* Notification & Setting */}
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/232738/appointment-reminders--v1.png',
                }}
                style={{ width: 28, height: 28, marginRight: 12, tintColor: '#ffb300' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/232738/settings.png',
                }}
                style={{ width: 28, height: 28, tintColor: '#ffb300'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Tab Navbar */}
        <View className="w-full h-[38px] flex-row items-center px-1 py-1 mt-2 bg-white rounded-[16px]">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Dashboard */}
            <TouchableOpacity className="bg-[#ffb300] px-3 py-1 rounded-full mr-1 " activeOpacity={0.8}>
              <Text className="text-white text-base font-semibold">Dashboard</Text>
            </TouchableOpacity>
            {/* Charts */}
            <TouchableOpacity className="px-3 py-1 mr-1" activeOpacity={0.8}>
              <Text className="text-[#232738] text-base font-medium">Charts</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="w-[1px] h-5 bg-gray-300 mx-1 self-center opacity-40" />
            {/* Report */}
            <TouchableOpacity className="px-3 py-1 mr-1" activeOpacity={0.8}>
              <Text className="text-[#232738] text-base font-medium">Report</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="w-[1px] h-5 bg-gray-300 mx-1 self-center opacity-40" />
            {/* Snapshot */}
            <TouchableOpacity className="px-3 py-1" activeOpacity={0.8}>
              <Text className="text-[#232738] text-base font-medium">Snapshot</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* เนื้อหาหลัก */}
      <View className="flex-1 items-center  bg-[#15161f]">
        <WaterCount />
        <EnergyHistory />

      </View>
      
    </View>
  );
}