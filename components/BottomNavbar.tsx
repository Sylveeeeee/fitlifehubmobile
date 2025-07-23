import { useRouter, usePathname } from 'expo-router';
import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import PlusMenu from './PlusMenu';

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [modalVisible, setModalVisible] = useState(false);

  const activeColor = '#ffb300';
  const inactiveColor = '#888888';

  // ฟังก์ชันไม่ให้ navigate ซ้ำหน้าเดิม
  const handleNavigate = (path: string) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  const NavButton = ({
    label,
    icon,
    iconSet,
    path,
  }: {
    label: string;
    icon: React.ComponentProps<typeof AntDesign>['name'];
    iconSet?: 'AntDesign' | 'MaterialCommunityIcons' | 'FontAwesome5' | 'Feather';
    path: string;
  }) => {
    const Icon =
      iconSet === 'MaterialCommunityIcons'
        ? MaterialCommunityIcons
        : iconSet === 'FontAwesome5'
        ? FontAwesome5
        : iconSet === 'Feather'
        ? Feather
        : AntDesign;

    const color = pathname === path ? activeColor : inactiveColor;

    return (
      <Pressable className="flex items-center" onPress={() => handleNavigate(path)}>
        <Icon name={icon as any} size={28} color={color} />
        <Text style={{ color, fontWeight: 'bold' }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <View className="pt-[12px] rounded-t-[16px] absolute bottom-0 left-0 right-0 h-28 bg-[#232433] flex-row justify-around items-start z-50">
        <NavButton label="Discover" icon="barschart" path="/" />
        <NavButton label="Diary" icon="notebook" iconSet="MaterialCommunityIcons" path="/diary" />

        <Pressable className="flex items-center" onPress={() => setModalVisible(true)}>
          <AntDesign name="pluscircle" size={40} color={activeColor} />
        </Pressable>

        <NavButton label="Foods" icon="apple-alt" iconSet="FontAwesome5" path="/foods" />
        <NavButton label="More" icon="more-horizontal" iconSet="Feather" path="/more" />
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
            onStartShouldSetResponder={() => true}
          >
            <PlusMenu onClose={() => setModalVisible(false)} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
