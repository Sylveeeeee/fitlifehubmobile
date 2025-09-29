import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { router } from 'expo-router';
import dayjs from 'dayjs';

type Option = {
  label: string;
  value: string;
};

const activityOptions: Option[] = [
  { label: 'No Activity', value: 'no_activity' },
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'very_active' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedActivity, setUpdatedActivity] = useState('');
  const [updatedGoalWeight, setUpdatedGoalWeight] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        setUpdatedActivity(data.activityLevel || '');
        setUpdatedGoalWeight(data.goalWeight?.toString() || '');
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

  const handleSave = async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...profile,
        activityLevel: updatedActivity,
        goalWeight: parseFloat(updatedGoalWeight),
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  useEffect(() => {
    if (!updatedActivity) return;

    const matchedActivity = activityOptions.find(
      (option) => option.value === updatedActivity
    );

    if (matchedActivity) {
      setSelectedActivity(matchedActivity);
    }
  }, [updatedActivity]);

  return (
    <View className="flex-1 bg-[#151624]">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-14 pb-6 px-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-[#ffffff] text-lg font-bold">Profile</Text>
        <TouchableOpacity onPress={() => setEditMode(!editMode)}>
          <Ionicons name={editMode ? 'checkmark' : 'create-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="px-6">
        {renderItem("Age", profile?.birthday ? calculateAge(profile.birthday).toString() : '-')}
        {renderItem("Sex", profile?.sex || '-')}
        {renderItem("Weight", profile?.weight ? `${profile.weight} kg` : '-')}
        {renderItem("Height", profile?.height ? `${profile.height} cm` : '-')}

        {/* Editable Activity Level */}
        {/* Dropdown Button */}
        <View className="bg-[#1f2032] rounded-xl px-4 py-4 mb-3">
          <View
            className="flex-row justify-between items-center"
          >
            <Text className="text-white font-semibold">Activity Level</Text>
            <View className="flex-row items-center">
              <Text className="text-white">{selectedActivity.label}</Text>
            </View>
          </View>

          {editMode && (
            <View className="bg-[#2a2c3d] rounded-md mt-3">
              {activityOptions
                .filter((option) => option.value !== selectedActivity.value)
                .map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setSelectedActivity(option);
                      setUpdatedActivity(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="py-2 px-3 border-t border-[#23243a]"
                  >
                    <Text className="text-white text-md">{option.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* Editable Goal Weight */}
        {/* <View className="bg-[#1f2032] rounded-xl px-4 py-4 mb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-semibold">Goal Weight</Text>
            {editMode ? (
              <TextInput
                className="bg-[#2a2b3d] text-white rounded-md px-3 py-1 w-[100px] text-right"
                keyboardType="numeric"
                value={updatedGoalWeight}
                onChangeText={(text) => setUpdatedGoalWeight(text)}
                placeholder="kg"
                placeholderTextColor="#888"
              />
            ) : (
              <Text className="text-white">{profile?.goalWeight ? `${profile.goalWeight} kg` : '-'}</Text>
            )}
          </View>
        </View> */}

        {renderItem("Body Mass Index (BMI)", bmi())}
        {/* {renderItem("Body Fat", profile?.bodyFat ? `${profile.bodyFat}%` : '-', "Last Updated on Feb 25, 2025")} */}

        {/* Save Button */}
        {editMode && (
          <TouchableOpacity
            className="bg-[#ffb300] rounded-full py-3 items-center mt-4 mb-10"
            onPress={handleSave}
          >
            <Text className="text-[#181929] text-lg font-bold">SAVE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function renderItem(label: string, value: string, subText?: string) {
  return (
    <View className="bg-[#1f2032] rounded-xl px-4 py-4 mb-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-semibold">{label}</Text>
        <Text className="text-white">{value}</Text>
      </View>
      {subText && <Text className="text-xs text-gray-400 mt-1">{subText}</Text>}
    </View>
  );
}