import { useRouter } from 'expo-router';
import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import PlusMenu from './PlusMenu';

export default function BottomNavbar() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View className="pt-2 absolute bottom-0 left-0 right-0 h-28 bg-white border-t border-gray-200 flex-row justify-around items-start z-50">
        <Pressable className='flex items-center' onPress={() => router.push('/')}>
          <AntDesign name="barschart" size={40} color="black" />
          <Text className="text-gray-700 font-bold">Didcover</Text>
        </Pressable>
        <Pressable className='flex items-center' onPress={() => router.push('/diary')}>
          <MaterialCommunityIcons name="notebook" size={40} color="black" />
          <Text className="text-gray-700 font-bold">Diary</Text>
        </Pressable>
        <Pressable className='flex items-center' onPress={() => setModalVisible(true)}>
          <AntDesign name="pluscircle" size={60} color="black" />
        </Pressable>
        <Pressable className='flex items-center' onPress={() => router.push('/foods')}>
          <FontAwesome5 name="apple-alt" size={40} color="black" />
          <Text className="text-gray-700 font-bold">Foods</Text>
        </Pressable>
        <Pressable className='flex items-center' onPress={() => router.push('/more')}>
          <Feather className='bg-black rounded-full p-[1px]' name="more-horizontal" size={40} color="white" />
          <Text className="text-gray-700 font-bold">More</Text>
        </Pressable>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        >
        <Pressable
            className="flex-1 justify-end items-center bg-black/50"
            onPress={() => setModalVisible(false)}
        >
            <View
            className="w-full items-center"
            // ป้องกันการปิด modal เมื่อกดที่ตัวเมนู
            onStartShouldSetResponder={() => true}
            >
            <PlusMenu onClose={() => setModalVisible(false)} />
            </View>
        </Pressable>
        </Modal>
    </>
  );
}