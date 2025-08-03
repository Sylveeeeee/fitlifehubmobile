import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    console.log('Saving password...');
    router.back(); // กลับหน้าก่อน
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    router.back(); // กลับหน้าก่อน
  };

  return (
    <View className="flex-1 bg-[#1a1a2e] px-5 justify-center">
      <Text className="text-white text-2xl font-bold text-center mb-8">Change Password</Text>

      <TextInput
        className="border border-[#555] rounded-xl p-4 mb-4 text-white"
        placeholder="Current Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        className="border border-[#555] rounded-xl p-4 mb-4 text-white"
        placeholder="New Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        className="border border-[#555] rounded-xl p-4 mb-6 text-white"
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View className="flex-row justify-between">
        <TouchableOpacity
          className="flex-1 mr-2 items-center p-4 rounded-xl border border-[#333] bg-[#1a1a2e]"
          onPress={handleCancel}
        >
          <Text className="text-[#2fd4c9] font-bold">CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 ml-2 items-center p-4 rounded-xl border border-[#333] bg-[#1a1a2e]"
          onPress={handleSave}
        >
          <Text className="text-[#2fd4c9] font-bold">SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
