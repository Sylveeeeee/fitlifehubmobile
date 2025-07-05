import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const menu = [
  { label: 'Account', icon: <Ionicons name="settings-outline" size={22} color="#fff" />, route: '/Account' },
  { label: 'Profile', icon: <Ionicons name="person-outline" size={22} color="#fff" />, route: '/profile' },
  { label: 'Targets', icon: <Ionicons name="radio-button-on-outline" size={22} color="#fff" />, route: '/targets' },
  { label: 'Fasting', icon: <MaterialIcons name="timer" size={22} color="#fff" />, route: '/fasting' },
  { label: 'Display', icon: <Ionicons name="phone-portrait-outline" size={22} color="#fff" />, route: '/display' },
  { label: 'Connect Apps & Devices', icon: <Feather name="refresh-cw" size={22} color="#fff" />, route: '/connect' },
  { label: 'Sharing', icon: <Feather name="share-2" size={22} color="#fff" />, route: '/sharing' },
  { label: 'Referrals', icon: <FontAwesome5 name="user-friends" size={22} color="#fff" />, route: '/referrals' },
  { label: 'Support', icon: <Entypo name="help-with-circle" size={22} color="#fff" />, route: '/support' },
  { label: 'About', icon: <Ionicons name="information-circle-outline" size={22} color="#fff" />, route: '/about' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#23243a]">
      {/* Header */}
      <View className="pt-12 pb-4 px-6">
        <Text className="text-3xl font-extrabold text-white mb-1">More</Text>
        <Text className="text-base text-gray-300 mb-4">maccklaren@gmail.com</Text>
        <View className="bg-[#2e3047] rounded-xl px-4 py-2 mb-4">
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            className="text-white"
            style={{ fontSize: 16 }}
          />
        </View>
      </View>

      {/* Menu */}
      <ScrollView className="px-2">
        {menu.map((item) => (
          <TouchableOpacity
            key={item.label}
            className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2"
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <View className="flex-row items-center space-x-3">
              {item.icon}
              <Text className="text-white text-base">{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}