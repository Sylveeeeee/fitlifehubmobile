import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import WaterCount  from '../components/watercount';

export default function Index() {
  
  return (
    <View className="flex-1 bg-[#fff8e1]">
      {/* Header */}
      <View className="w-full pt-10 pb-2 px-4 bg-[#ffb300] shadow-md rounded-b-[20px]">
        <View className="flex-row items-center justify-between">
          {/* Logo & Title */}
          <View className="flex-row items-center">
            <Image
              source={{
                uri: 'https://img.icons8.com/ios-filled/50/ffffff/target.png',
              }}
              style={{ width: 40, height: 40, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text className="text-[#232738] text-[32px] font-extrabold">FitlifeHUB</Text>
          </View>
          {/* Notification & Setting */}
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/232738/appointment-reminders--v1.png',
                }}
                style={{ width: 28, height: 28, marginRight: 12 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: 'https://img.icons8.com/ios-filled/50/232738/settings.png',
                }}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Tab Navbar */}
        <View className="w-full h-[54px] flex-row items-center px-2 py-2 mt-3 bg-white rounded-[20px]">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Dashboard */}
            <TouchableOpacity className="bg-[#ffb300] px-5 py-2 rounded-full mr-2 shadow" activeOpacity={0.8}>
              <Text className="text-white text-lg font-semibold">Dashboard</Text>
            </TouchableOpacity>
            {/* Charts */}
            <TouchableOpacity className="px-5 py-2 mr-2" activeOpacity={0.8}>
              <Text className="text-[#232738] text-lg font-medium">Charts</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="w-[1px] h-6 bg-gray-300 mx-1 self-center opacity-40" />
            {/* Report */}
            <TouchableOpacity className="px-5 py-2 mr-2" activeOpacity={0.8}>
              <Text className="text-[#232738] text-lg font-medium">Report</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="w-[1px] h-6 bg-gray-300 mx-1 self-center opacity-40" />
            {/* Snapshot */}
            <TouchableOpacity className="px-5 py-2" activeOpacity={0.8}>
              <Text className="text-[#232738] text-lg font-medium">Snapshot</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* เนื้อหาหลัก */}
      <View className="flex-1 items-center bg-[#fff8e1]">
        <WaterCount />

      </View>
    </View>
  );
}