import { useRouter, usePathname } from 'expo-router';
import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import PlusMenu from './PlusMenu';

// Mapping ของ iconSet เป็น Component จริง
const iconSets = {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} as const;

type IconSetName = keyof typeof iconSets;

// กำหนด path ที่อนุญาตล่วงหน้าเป็น literal type
type Path = '/' | '/diary' | '/foods' | '/more';

type NavButtonProps = {
  label: string;
  icon: string;
  iconSet?: IconSetName;
  path: Path;
};

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname() ?? '/'; // ให้ pathname เป็น string
  const [modalVisible, setModalVisible] = useState(false);

  const activeColor = '#ffb300';
  const inactiveColor = '#888888';

  // Navigate แบบ type-safe
  const handleNavigate = (path: Path) => {
    if (pathname !== path) {
      router.push(path); // TS พอใจเพราะ path เป็น literal type
    }
  };

  const NavButton = ({ label, icon, iconSet = 'AntDesign', path }: NavButtonProps) => {
    const Icon = iconSets[iconSet];
    const color = pathname === path ? activeColor : inactiveColor;

    return (
      <Pressable className="flex items-center" onPress={() => handleNavigate(path)}>
        <Icon name={icon as any} size={22} color={color} />
        <Text style={{ color, fontWeight: 'bold', fontSize: 12 }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <View className="rounded-t-[16px] absolute bottom-0 left-0 right-0 h-28 bg-[#232433] flex-row justify-around items-start z-50 pt-5">
        <NavButton label="Discover" icon="bar-chart-2" iconSet="Feather" path="/" />
        <NavButton label="Diary" icon="notebook-outline" iconSet="MaterialCommunityIcons" path="/diary" />

        <Pressable className="flex items-center bg-[#ffb300] rounded-full p-2" onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={40} color="#ffff" />
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
          className="flex-1 justify-end items-center"
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