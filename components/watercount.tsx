import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { useState, useRef } from 'react';

const GLASS_SIZE_ML = 250;

export default function WaterCount() {
  const [count, setCount] = useState(0);

  // animation scale values สำหรับปุ่ม -
  const scaleMinus = useRef(new Animated.Value(1)).current;
  // animation scale values สำหรับปุ่ม +
  const scalePlus = useRef(new Animated.Value(1)).current;

  const animatePressIn = (scaleAnim: Animated.Value | Animated.ValueXY) => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const animatePressOut = (scaleAnim: Animated.Value | Animated.ValueXY) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const addGlass = () => setCount(count + 1);
  const removeGlass = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <View className="w-[94%] self-center my-6 bg-[#232433] rounded-3xl shadow-lg px-6 py-7 items-center">
      {/* Sport Icon & Title */}
      <View className="flex-row items-center mb-3">
        <Text className="text-2xl font-extrabold text-[#22b6ff] mr-2">💪</Text>
        <Text className="text-xl font-bold text-white tracking-wider">WATER TRACKER</Text>
      </View>
      {/* Glass Count */}
      <View className="flex-row items-end mb-1">
        <Text className="text-[35px] font-extrabold text-[#ffb300] drop-shadow-lg">{count}</Text>
        <Text className="text-lg font-bold text-[#22b6ff] ml-2 mb-2">GLASS</Text>
      </View>
      {/* ml */}
      <Text className="text-base text-[#b2cdfa] mb-4 font-semibold tracking-wide">
        {count * GLASS_SIZE_ML} ml
      </Text>
      {/* Buttons */}
      <View className="flex-row items-center gap-x-10 mt-2">
        {/* ปุ่มลบ */}
        <TouchableWithoutFeedback
          onPressIn={() => animatePressIn(scaleMinus)}
          onPressOut={() => animatePressOut(scaleMinus)}
          onPress={removeGlass}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleMinus }],
              backgroundColor: '#232738',
              borderColor: '#ffb300',
              borderWidth: 2,
              borderRadius: 9999,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text className="text-[#ffb300] text-4xl font-extrabold">-</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* ปุ่มบวก */}
        <TouchableWithoutFeedback
          onPressIn={() => animatePressIn(scalePlus)}
          onPressOut={() => animatePressOut(scalePlus)}
          onPress={addGlass}
        >
          <Animated.View
            style={{
              transform: [{ scale: scalePlus }],
              backgroundColor: 'transparent',
              borderColor: '#22b6ff',
              borderWidth: 2,
              borderRadius: 9999,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              // background: 'linear-gradient(45deg, #22b6ff, #38e7ff)', // **Note: linear-gradient ไม่ support โดยตรงใน RN**
              shadowColor: '#22b6ff',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <Text className="text-white text-4xl font-extrabold">+</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
      {/* Note */}
      <Text className="text-xs text-[#b2cdfa] mt-5 italic">
        1 GLASS = {GLASS_SIZE_ML} ml • Stay hydrated, stay strong!
      </Text>
    </View>
  );
}
