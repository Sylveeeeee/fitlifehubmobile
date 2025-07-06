import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { storeToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/profile/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeToken(data.token); // 🔐 เก็บ token อย่างปลอดภัย
        router.replace('/'); // ✅ ไปหน้า Home
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950 px-6 py-10 justify-center">
      <View className="mb-10">
        <Text className="text-4xl text-white font-bold">Eat smarter.</Text>
        <Text className="text-4xl text-white font-bold">Live better.</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-600 text-white rounded-lg px-4 py-3"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
          secureTextEntry
          className="border border-gray-600 text-white rounded-lg px-4 py-3"
        />

        <TouchableOpacity
          className="bg-orange-300 py-3 rounded-full items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-gray-900 font-semibold">
            {loading ? 'Logging in...' : 'LOG IN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-center text-teal-500 font-medium mt-2">
            Forgot your password?
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-300">Don't have an account? </Text>
          <Link href="/register" className="text-teal-500 font-semibold">
            SIGN UP
          </Link>
        </View>
      </View>

      <View className="absolute bottom-10 left-0 right-0">
        <Text className="text-center text-xs text-gray-500">
          Version 1.0.0 {'\n'}© 2025 Your Company
        </Text>
      </View>
    </SafeAreaView>
  );
}
