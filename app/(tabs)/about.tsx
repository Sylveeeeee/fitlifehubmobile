import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold text-green-600">หน้า About</Text>
      <Link href="./" className="mt-4 text-blue-500 underline">
        กลับไปหน้าแรก
      </Link>
    </View>
  );
}