import React from 'react';
import { View, Text, TextInput, SafeAreaView } from 'react-native';

export default function RegisterStep6() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header & Progress ... */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Account Details</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        Enter your email and create a password for your Cronometer account.
      </Text>
      <View className="bg-[#232433] rounded-2xl px-3 py-6 mx-4 mb-8">
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="First Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Email"
          placeholderTextColor="#aaa"
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TextInput
          className="bg-transparent border border-gray-600 rounded-xl px-4 py-3 mb-3 text-white"
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
      </View>
      {/* Next */}
      <View className="px-8">
        <View className="bg-gray-600 rounded-full py-3 items-center opacity-60">
          <Text className="text-gray-300 text-lg font-bold">NEXT</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}