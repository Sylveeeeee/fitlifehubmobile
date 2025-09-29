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
      label: 'ADD',
      icon: <FontAwesome5 name="apple-alt" size={32} color="#F87171" />,
      onPress: () => router.push('/foods'),
    },
    {
      label: 'EXERCISE',
      icon: <MaterialCommunityIcons name="run" size={32} color="#22D3EE" />,
      onPress: () => router.push('/exercise'),
    },
  ];

  return (
    <>
      <View className="bg-[#232433] rounded-[12px] pb-8 pt-6 px-4 w-full  shadow-lg">
        <View className="flex-row flex-wrap justify-center">
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              className="w-1/3 items-center mb-6 "
              style={{ paddingHorizontal: 4 }}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <View className="bg-[#35364a] rounded-full p-4 mb-2">
                {item.icon}
              </View>
              <Text className="text-white text-xs font-semibold text-center">{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}