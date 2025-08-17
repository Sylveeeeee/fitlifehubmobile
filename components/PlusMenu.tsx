import { View, Text, Pressable } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function PlusMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const menuItems = [
    {
      label: 'Suggest Food',
      icon: <MaterialIcons name="help-outline" size={32} color="#FBBF24" />,
      onPress: () => router.push('/'),
    },
    {
      label: 'Add Food',
      icon: <FontAwesome5 name="apple-alt" size={32} color="#F87171" />,
      onPress: () => router.push('/foods'),
    },
    {
      label: 'Scan Food',
      icon: <MaterialCommunityIcons name="barcode-scan" size={32} color="#34D399" />,
      onPress: () => router.push('/'),
    },
    {
      label: 'Add Biometric',
      icon: <MaterialCommunityIcons name="heart-pulse" size={32} color="#EC4899" />,
      onPress: () => router.push('/'),
    },
    {
      label: 'Add Note',
      icon: <Feather name="file-text" size={32} color="#F59E42" />,
      onPress: () => router.push('/'),
    },
    {
      label: 'New Fast',
      icon: <MaterialCommunityIcons name="timer-outline" size={32} color="#38BDF8" />,
      onPress: () => router.push('/'),
    },
    {
      label: 'Add Exercise',
      icon: <MaterialCommunityIcons name="run" size={32} color="#22D3EE" />,
      onPress: () => router.push('/exercise'),
    },
  ];

  return (
    <View className="bg-[#232433] rounded-t-3xl pb-8 pt-6 px-4 w-full">
      <View className="flex-row flex-wrap justify-center">
        {menuItems.map((item) => (
          <Pressable
            key={item.label}
            className="w-1/3 items-center mb-6"
            style={{ paddingHorizontal: 4 }}
            onPress={() => {
              item.onPress();
              onClose();
            }}
          >
            <View  className="bg-[#35364a] rounded-full p-4 mb-2">
              {item.icon}
            </View>
            <Text className="text-white text-xs font-semibold text-center">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
