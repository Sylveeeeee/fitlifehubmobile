import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken, removeToken } from '@/utils/tokenStorage.native';
import { router } from 'expo-router';

export default function Account() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch('http://localhost:3000/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Error fetching user:', e);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-[#23243a]">
      {/* Header */}
      <View className="flex-row items-center pt-12 pb-4 px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-extrabold text-white">Account</Text>
        <View style={{ width: 28 }} /> {/* spacer */}
      </View>

      <ScrollView className="px-2">
        {/* Name */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Name</Text>
          <View className="flex-row items-center">
            <Text className="text-white mr-2">{user?.name || '-'}</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Email</Text>
          <View className="flex-row items-center">
            <Text className="text-white mr-2">{user?.email || '-'}</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Two-Factor Authentication */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Two-Factor Authentication</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Account Data */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Account Data</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Subscription */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Subscription: Free</Text>
          <Text className="text-[#2ec4b6] font-bold mr-2">UPGRADE</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity className="flex-row items-center justify-between bg-[#292b40] rounded-xl px-4 py-4 mb-2">
          <Text className="text-white text-base font-bold">Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* LOG OUT */}
        <View className="px-6 pb-8 pt-4">
          <TouchableOpacity className="bg-[#ff7a1a] rounded-full py-4" onPress={handleLogout}>
            <Text className="text-center text-lg font-bold text-white">LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
