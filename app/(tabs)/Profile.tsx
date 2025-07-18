import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { router } from 'expo-router';
import dayjs from 'dayjs';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  const calculateAge = (birthdate: string) => {
    const birth = dayjs(birthdate);
    const now = dayjs();
    return now.diff(birth, 'year');
  };

  const bmi = () => {
    if (!profile?.weight || !profile?.height) return '-';
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  return (
    <View className="flex-1 bg-[#151624]">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-14 pb-6 px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="px-6">
        {renderItem("Age", profile?.birthday ? calculateAge(profile.birthday).toString() : '-')}
        {renderItem("Sex", profile?.sex || '-')}
        {renderItem("Weight", profile?.weight ? `${profile.weight} kg` : '-')}
        {renderItem("Height", profile?.height ? `${profile.height} cm` : '-')}
        {renderItem("Body Mass Index (BMI)", bmi())}
        {renderItem("Body Fat", profile?.bodyFat ? `${profile.bodyFat}%` : '-', "Last Updated on Feb 25, 2025")}
      </ScrollView>
    </View>
  );
}

function renderItem(label: string, value: string, subText?: string) {
  return (
    <TouchableOpacity className="bg-[#1f2032] rounded-xl px-4 py-4 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-semibold">{label}</Text>
        <Text className="text-white">{value}</Text>
      </View>
      {subText && <Text className="text-xs text-gray-400 mt-1">{subText}</Text>}
    </TouchableOpacity>
  );
}
