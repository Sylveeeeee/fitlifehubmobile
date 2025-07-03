import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';

export const options = { headerShown: false };

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://your-backend-api.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // สำเร็จ: ทำสิ่งที่ต้องการ เช่น navigate หรือเก็บ token
        Alert.alert('Login Success', `Welcome ${data.user?.name || ''}`);
      } else {
        // ล้มเหลว: แจ้งเตือน
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-[#fff8e1] justify-center items-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/100/ffb300/target.png' }}
          style={{ width: 80, height: 80, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text className="text-[#ffb300] text-3xl font-extrabold mb-2">FITLIFE HUB</Text>
      </View>

      {/* Login Form */}
      <View className="bg-white w-full rounded-2xl shadow p-6">
        <Text className="text-[#232738] text-lg font-bold mb-4 text-center">Sign In</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#bdbdbd"
          className="border border-[#ffb300] rounded-lg px-4 py-3 mb-4 text-base text-[#232738]"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#bdbdbd"
          className="border border-[#ffb300] rounded-lg px-4 py-3 mb-2 text-base text-[#232738]"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity className="mb-4">
          <Text className="text-[#ffb300] text-right text-sm">Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#ffb300] rounded-lg py-3 items-center mb-2 active:opacity-80"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-base font-bold">{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-[#232738] text-center text-sm">
            Don't have an account? <Text className="text-[#ffb300] font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}