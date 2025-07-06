import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Pressable } from 'react-native';
import { useRegister } from './RegisterContext';

export default function RegisterStep6({ navigation }: { navigation: any }) {
  const { registerData, setRegisterData } = useRegister();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValid =
    firstName.trim() &&
    email.trim() &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleNext = () => {
    if (!isValid) return;
    setRegisterData({
      ...registerData,
      firstName,
      email,
      password,
    });
    navigation.navigate('step7-terms');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Account Details</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        Enter your email and create a password for your Cronometer account.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-6 mx-4 mb-8">
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="First Name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      {/* Next */}
      <View className="px-8">
        <Pressable
          className={`rounded-full py-3 items-center mb-2 ${isValid ? 'bg-[#ffb300]' : 'bg-gray-600 opacity-60'}`}
          disabled={!isValid}
          onPress={handleNext}
        >
          <Text className="text-gray-900 text-lg font-bold">NEXT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}