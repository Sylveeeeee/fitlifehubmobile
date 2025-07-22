import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '@/config';

interface FoodItem {
  id: number;
  foodName: string;
  category?: string;
}

export default function FoodSearchScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const fetchFoods = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/foods?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    
  };
console.log('API Response:', foods);

  useEffect(() => {
    if (query.length >= 2) {
      fetchFoods();
    } else {
      setFoods([]);
    }
  }, [query]);

  return (
    <View className="flex-1 bg-[#1a1b2e] px-4 pt-12">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search all foods..."
        placeholderTextColor="#999"
        className="bg-[#2a2c3d] text-white px-4 py-2 rounded-xl mb-4"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff7a1a" />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-[#292b40] rounded-xl px-4 py-4 mb-2">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white font-semibold">{item.foodName}</Text>
                  <Text className="text-gray-400 text-sm">Per 100g</Text>
                </View>
                <Text className="text-orange-400 font-semibold text-xs">
                  {item.category || 'N/A'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
