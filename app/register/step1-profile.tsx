import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* Header */}
      <View className="flex-row items-center mt-2 px-4">
        <Pressable>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </Pressable>
        <View className="flex-1 items-center -ml-7">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="target" size={32} color="#ffb300" />
            <Text className="text-2xl font-bold text-white ml-2">Cronometer</Text>
          </View>
        </View>
        <View style={{ width: 28 }} /> {/* Placeholder for right icon */}
      </View>

      {/* Step Progress */}
      <View className="flex-row justify-center items-center mt-6 mb-4">
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${i === 0 ? 'bg-[#ffb300] w-10' : 'bg-gray-600 w-6'}`}
          />
        ))}
      </View>
      <Text className="text-center text-gray-400 mb-2">STEP 1</Text>

      {/* Title */}
      <Text className="text-3xl font-extrabold text-white text-center mb-2">Set Your Profile</Text>
      <Text className="text-center text-gray-300 mb-6 px-8">
        We can customize your nutrition targets with this information.
      </Text>

      {/* Card */}
      <View className="bg-[#232433] rounded-2xl px-3 py-2 mx-4 mb-8">
        <ProfileItem
          icon={<Ionicons name="male-female-outline" size={24} color="#ffb300" />}
          label="Your sex"
        />
        <ProfileItem
          icon={<MaterialCommunityIcons name="cake-variant-outline" size={24} color="#ffb300" />}
          label="Your birthday"
        />
        <ProfileItem
          icon={<MaterialCommunityIcons name="arrow-expand-vertical" size={24} color="#ffb300" />}
          label="Your height"
        />
        <ProfileItem
          icon={<FontAwesome5 name="weight" size={22} color="#ffb300" />}
          label="Your weight"
        />
      </View>

      {/* Description */}
      <Text className="text-center text-gray-400 mb-4 px-8">
        We use this information to calculate and provide you with daily personalized recommendations.
      </Text>

      {/* Next Button */}
      <View className="px-8">
        <View className="bg-gray-600 rounded-full py-3 items-center opacity-60">
          <Text className="text-gray-300 text-lg font-bold">NEXT</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProfileItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable className="flex-row items-center justify-between bg-[#232433] border border-gray-600 rounded-xl px-4 py-4 mb-3">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-gray-300 text-base ml-3">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#888" />
    </Pressable>
  );
}