import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { getToken } from '@/utils/tokenStorage.native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SafeAreaView } from 'react-native-safe-area-context'; // เพิ่ม

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  // UI states
  const [amount, setAmount] = useState('1');
  const [servingSize, setServingSize] = useState('cup – 258g');
  const [timestamp, setTimestamp] = useState('1:07');
  const [group, setGroup] = useState('Uncategorized');

  useEffect(() => {
    const fetchTargets = async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setTargets({
        calories: user.caloriesGoal,
        protein: user.proteinGoal,
        fat: user.fatGoal,
        carbs: user.carbsGoal,
      });
    };
    fetchTargets();
  }, []);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/foods/${id}`);
        const data = await res.json();
        setFood(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFood();
  }, [id]);

  if (loading || !food) {
    return (
      <View
        style={{ flex: 1, backgroundColor: '#1a1b2e', justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#ff7a1a" />
      </View>
    );
  }

  const protein = food.protein || 0;
  const carbs = food.carbs || 0;
  const fat = food.fat || 0;
  const total = protein + carbs + fat || 1;

  const proteinPercent = (protein / total) * 100;
  const carbsPercent = (carbs / total) * 100;
  const fatPercent = (fat / total) * 100;

  const macros = [
    { label: 'Protein', value: protein, color: '#22c55e', target: targets.protein },
    { label: 'Net Carbs', value: carbs, color: '#06b6d4', target: targets.carbs },
    { label: 'Fat', value: fat, color: '#f97316', target: targets.fat },
  ];

  return (
    <View className="flex-1 bg-[#1a1b2e]">
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>
            <Text>⭐ </Text>
            {food.foodName}
          </Text>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </View>

        {/* Amount, Serving Size, Timestamp, Group */}
        <View
          style={{
            backgroundColor: '#23243a',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{
                backgroundColor: '#2a2c3d',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                color: 'white',
                width: 80,
              }}
            />
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Serving Size
            </Text>
            <Text style={{ color: 'white' }}>{servingSize}</Text>
          </View>
          <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginRight: 8 }}>
              Timestamp
            </Text>
            <MaterialCommunityIcons name="lock" size={18} color="#ffb300" />
            <Text
              style={{
                backgroundColor: '#2a2c3d',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                color: 'white',
                marginHorizontal: 8,
              }}
            >
              {timestamp}
            </Text>
            <Ionicons name="checkmark-circle" size={18} color="#ffb300" />
          </View>
          <View style={{ marginBottom: 4 }}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
              Group
            </Text>
            <Text style={{ color: 'white' }}>{group}</Text>
          </View>
        </View>
     

        {/* Energy Summary */}
        <View
          style={{
            backgroundColor: '#2a2c3d',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Circle */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={100}
              tintColor="#444"
              backgroundColor="#1a1b2e"
              rotation={0}
            >
              {() => null}
            </AnimatedCircularProgress>

            {/* Protein */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(proteinPercent, 100)}
              tintColor="#22c55e"
              backgroundColor="transparent"
              rotation={0}
              style={{ position: 'absolute' }}
            />

            {/* Carbs */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(carbsPercent, 100)}
              tintColor="#06b6d4"
              backgroundColor="transparent"
              rotation={(Math.min(proteinPercent, 100) / 100) * 360}
              style={{ position: 'absolute' }}
            />

            {/* Fat */}
            <AnimatedCircularProgress
              size={120}
              width={15}
              fill={Math.min(fatPercent, 100)}
              tintColor="#f97316"
              backgroundColor="transparent"
              rotation={((Math.min(proteinPercent, 100) + Math.min(carbsPercent, 100)) / 100) * 360}
              style={{ position: 'absolute' }}
            />

            {/* Center Text */}
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>
                {food.calories}
              </Text>
              <Text style={{ color: 'white', fontSize: 12 }}>kcal</Text>
            </View>
          </View>

          <View style={{ marginLeft: 16 }}>
            {macros.map((m) => (
              <Text key={m.label} style={{ color: m.color, fontSize: 14, marginBottom: 6 }}>
                {m.label} ({((m.value / total) * 100).toFixed(0)}%) - {m.value}g
              </Text>
            ))}
          </View>
        </View>

        {/* Macronutrient Targets */}
        <View
          style={{
            backgroundColor: '#2a2c3d',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <Text
            style={{ color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 12 }}
          >
            Macronutrient Targets
          </Text>
          {[
            {
              label: 'Energy',
              value: food.calories,
              target: targets.calories,
              unit: 'kcal',
              color: '#fff',
            },
            ...macros.map((m) => ({
              label: m.label,
              value: m.value,
              target: m.target,
              color: m.color,
              unit: 'g',
            })),
          ].map((item) => {
            const percent = Math.min((item.value / (item.target || 1)) * 100, 100);
            return (
              <View key={item.label} style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 14, marginBottom: 6 }}>
                  {item.label} – {item.value} / {item.target} {item.unit} (
                  {percent.toFixed(0)}%)
                </Text>
                <View
                  style={{
                    height: 8,
                    width: '100%',
                    backgroundColor: '#374151',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color || '#fff',
                      height: 8,
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>

    </ScrollView>

    
      {/* Add to Diary Button */}
      <View className="absolute left-0 right-0 bottom-0 px-4 pb-8 bg-[#1a1b2e] pt-5">
        <Pressable onPress={() => console.log('Add to Diary')} className="bg-white py-2 rounded-full items-center mb-10">
          <Text className="text-black font-semibold text-lg">ADD TO DIARY</Text>
        </Pressable>
      </View>
    </View>
  );
}
