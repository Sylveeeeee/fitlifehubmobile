import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">ยินดีต้อนรับสู่ FitLifeHub 🎉</Text>
      <Text className="mt-2 text-2xl text-gray-600">แอปติดตามโภชนาการของคุณ</Text>
      <Link href="./about" className="mt-4 text-blue-500 underline">
        ไปที่หน้า About
      </Link>
    </View>
  );
}