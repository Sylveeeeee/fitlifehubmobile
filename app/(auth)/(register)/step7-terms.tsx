import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRegister } from './RegisterContext';
import { router } from 'expo-router';
import { storeToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

export default function RegisterStep7({
  onRegisterSuccess,
}: {
  onRegisterSuccess?: () => void;
}) {
  const [checked, setChecked] = useState([false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const { registerData } = useRegister();

  const canContinue = checked[1]; // ต้องติ๊ก Terms

  const handleContinue = async () => {
    if (!canContinue || loading) return;

    setLoading(true);

    try {
      // 1. สมัครสมาชิก
      const res = await fetch(`${API_URL}/api/profile/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.firstName || registerData.name,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert('Error', result.error || 'Registration failed');
        return;
      }

      const token = result.token;

      // 2. เก็บ token
      await storeToken(token);

      // 3. อัปเดตโปรไฟล์
      await fetch(`${API_URL}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: registerData.firstName,
          sex: registerData.sex,
          birthday: registerData.birthday
            ? new Date(registerData.birthday).toISOString()
            : null,
          height: registerData.height
            ? Number(registerData.height)
            : null,
          weight: registerData.weight
            ? Number(registerData.weight)
            : null,
        }),
      });

      // 4. แจ้งว่าเสร็จ
      if (onRegisterSuccess) onRegisterSuccess();

      // 5. เปลี่ยนหน้าไปยัง Home แบบไม่ย้อนกลับ
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Terms of Service</Text>
      <ScrollView className="mx-4 mb-8 bg-[#232433] rounded-2xl px-4 py-6">
        <Text className="text-white mb-4">
          Please accept the Terms of Service before continuing to your account.
        </Text>
        <CheckItem
          label="Check All"
          checked={checked[0]}
          onPress={() => setChecked([!checked[0], !checked[0], !checked[0], !checked[0]])}
        />
        <CheckItem
          label="I agree to the Cronometer Terms of Service."
          checked={checked[1]}
          onPress={() => setChecked([checked[0], !checked[1], checked[2], checked[3]])}
        />
        <CheckItem
          label="I agree to receive newsletters and promotional emails"
          checked={checked[2]}
          onPress={() => setChecked([checked[0], checked[1], !checked[2], checked[3]])}
        />
        <CheckItem
          label="I agree to receive personalized in-app ads."
          checked={checked[3]}
          onPress={() => setChecked([checked[0], checked[1], checked[2], !checked[3]])}
        />
        <Text className="text-gray-400 text-xs mt-4">
          *Users may receive informational emails from Cronometer
        </Text>
      </ScrollView>
      {/* Continue Button */}
      <View className="px-8">
        <Pressable
          className={`rounded-full py-3 items-center mb-2 ${canContinue ? 'bg-[#ffb300]' : 'bg-gray-600 opacity-60'}`}
          disabled={!canContinue}
          onPress={handleContinue}
        >
          <Text className="text-gray-900 text-lg font-bold">CONTINUE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function CheckItem({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return (
    <Pressable className="flex-row items-center mb-3" onPress={onPress}>
      <View className={`w-6 h-6 rounded border-2 mr-3 ${checked ? 'border-[#ffb300] bg-[#ffb300]' : 'border-[#ffb300]'}`} />
      <Text className="text-white">{label}</Text>
    </Pressable>
  );
}