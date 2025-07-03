import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, Modal, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';


export default function RegisterScreen() {
  const [profile, setProfile] = useState({
    sex: '',
    birthday: '',
    height: '',
    weight: '',
    heightUnit: 'cm',
    weightUnit: 'kg',
  });
  const [modal, setModal] = useState<'sex' | 'birthday' | 'height' | 'weight' | null>(null);

  // สำหรับ birthday picker
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [birthDay, setBirthDay] = useState(1);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);

  // สำหรับ height/weight picker
  const [tempHeight, setTempHeight] = useState(profile.height || '170');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>((profile.heightUnit as 'cm' | 'in') || 'cm');
  const [tempWeight, setTempWeight] = useState(profile.weight || '60');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>((profile.weightUnit as 'kg' | 'lb') || 'kg');
  const [tempSex, setTempSex] = useState(profile.sex || 'male');
  // ฟังก์ชันส่งข้อมูลไป backend
  const handleNext = async () => {
    // ตัวอย่าง: สมมติว่ามี token แล้ว
    const token = ''; // TODO: Replace with actual token retrieval logic
    await fetch('http://192.168.1.10:4000/api/profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ใส่ token จริง
      },
      body: JSON.stringify({
        sex: profile.sex,
        birthday: profile.birthday,
        height: Number(profile.height),
        weight: Number(profile.weight),
      }),
    });
    // ไป step ถัดไป
  };

  return (
    <SafeAreaView className="flex-1 bg-[#181929]">
      {/* ...header, progress, title... */}
      <View className="bg-[#232433] rounded-2xl px-3 py-2 mx-4 mb-8">
        <ProfileItem
          icon={<Ionicons name="male-female-outline" size={24} color="#ffb300" />}
          label={`Your sex${profile.sex ? ': ' + profile.sex : ''}`}
          onPress={() => setModal('sex')}
        />
        <ProfileItem
          icon={<MaterialCommunityIcons name="cake-variant-outline" size={24} color="#ffb300" />}
          label={`Your birthday${profile.birthday ? ': ' + profile.birthday : ''}`}
          onPress={() => setModal('birthday')}
        />
        <ProfileItem
          icon={<MaterialCommunityIcons name="arrow-expand-vertical" size={24} color="#ffb300" />}
          label={`Your height${profile.height ? ': ' + profile.height + ' cm' : ''}`}
          onPress={() => setModal('height')}
        />
        <ProfileItem
          icon={<FontAwesome5 name="weight" size={22} color="#ffb300" />}
          label={`Your weight${profile.weight ? ': ' + profile.weight + ' kg' : ''}`}
          onPress={() => setModal('weight')}
        />
      </View>
      {/* ...description... */}
      <View className="px-8">
        <Pressable
          className={`rounded-full py-3 items-center ${profile.sex && profile.birthday && profile.height && profile.weight ? 'bg-[#ffb300]' : 'bg-gray-600 opacity-60'}`}
          disabled={!(profile.sex && profile.birthday && profile.height && profile.weight)}
          onPress={handleNext}
        >
          <Text className="text-gray-900 text-lg font-bold">NEXT</Text>
        </Pressable>
      </View>
      // Modal: Sex
<Modal visible={modal === 'sex'} transparent animationType="slide">
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-[#2d2e3a] rounded-xl p-6 w-11/12">
      <Text className="text-white text-xl font-bold mb-4 text-center">Sex</Text>
      <Picker
        selectedValue={tempSex}
        onValueChange={setTempSex}
        style={{ color: 'white', backgroundColor: '#232433' }}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Pregnant" value="pregnant" />
        <Picker.Item label="Breastfeeding" value="breastfeeding" />
      </Picker>
      <Text className="text-xs text-gray-300 mt-4 mb-6 text-center">
        *Until nutrition guidelines for transgender individuals are established, we recommend selecting the gender that has been transitioned to OR your gender at birth and working with your healthcare team to make personalized adjustments.
      </Text>
      <View className="flex-row justify-between">
        <Pressable className="flex-1 items-center" onPress={() => setModal(null)}>
          <Text className="text-[#38b2ac] font-bold">CANCEL</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center"
          onPress={() => {
            setProfile(p => ({ ...p, sex: tempSex }));
            setModal(null);
          }}
        >
          <Text className="text-[#38b2ac] font-bold">SAVE</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>
// Modal: Birthday (ใช้ date picker library จะดีที่สุด แต่ตัวอย่างนี้ใช้ picker 3 ช่อง)
<Modal visible={modal === 'birthday'} transparent animationType="slide">
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-[#2d2e3a] rounded-xl p-6 w-11/12">
      <Text className="text-white text-xl font-bold mb-4 text-center">Birthday</Text>
      <View className="flex-row justify-center">
        <Picker
          selectedValue={birthMonth}
          onValueChange={setBirthMonth}
          style={{ width: 120, color: 'white', backgroundColor: '#232433' }}
        >
          {months.map((m, i) => <Picker.Item key={i} label={m} value={i + 1} />)}
        </Picker>
        <Picker
          selectedValue={birthDay}
          onValueChange={setBirthDay}
          style={{ width: 80, color: 'white', backgroundColor: '#232433' }}
        >
          {Array.from({ length: 31 }, (_, i) => (
            <Picker.Item key={i} label={String(i + 1)} value={i + 1} />
          ))}
        </Picker>
        <Picker
          selectedValue={birthYear}
          onValueChange={setBirthYear}
          style={{ width: 100, color: 'white', backgroundColor: '#232433' }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <Picker.Item key={i} label={String(2024 - i)} value={2024 - i} />
          ))}
        </Picker>
      </View>
      <View className="flex-row justify-between mt-6">
        <Pressable className="flex-1 items-center" onPress={() => setModal(null)}>
          <Text className="text-[#38b2ac] font-bold">CANCEL</Text>
        </Pressable>
        <Pressable
  className="flex-1 items-center"
  onPress={() => {
    setProfile(p => ({
      ...p,
      birthday: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
    }));
    setModal(null);
  }}
>
  <Text className="text-[#38b2ac] font-bold">SAVE</Text>
</Pressable>
      </View>
    </View>
  </View>
</Modal>

// Modal: Height
<Modal visible={modal === 'height'} transparent animationType="slide">
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-[#2d2e3a] rounded-xl p-6 w-11/12">
      <Text className="text-white text-xl font-bold mb-4 text-center">Height</Text>
      <View className="flex-row justify-center items-center">
        <Picker
          selectedValue={tempHeight}
          onValueChange={setTempHeight}
          style={{ width: 120, color: 'white', backgroundColor: '#232433' }}
        >
          {Array.from({ length: 121 }, (_, i) => (
            <Picker.Item key={i} label={String(100 + i)} value={String(100 + i)} />
          ))}
        </Picker>
        <Picker
          selectedValue={heightUnit}
          onValueChange={setHeightUnit}
          style={{ width: 100, color: 'white', backgroundColor: '#232433' }}
        >
          <Picker.Item label="cm" value="cm" />
          <Picker.Item label="in" value="in" />
        </Picker>
      </View>
      <View className="flex-row justify-between mt-6">
        <Pressable className="flex-1 items-center" onPress={() => setModal(null)}>
          <Text className="text-[#38b2ac] font-bold">CANCEL</Text>
        </Pressable>
        <Pressable
        className="flex-1 items-center"
        onPress={() => {
            let heightValue = tempHeight;
            if (heightUnit === 'in') {
            heightValue = (parseFloat(tempHeight) * 2.54).toFixed(1); // แปลง inch เป็น cm
            }
            setProfile(p => ({
            ...p,
            height: heightValue,
            heightUnit,
            }));
            setModal(null);
        }}
        >
        <Text className="text-[#38b2ac] font-bold">SAVE</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

// Modal: Weight
<Modal visible={modal === 'weight'} transparent animationType="slide">
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-[#2d2e3a] rounded-xl p-6 w-11/12">
      <Text className="text-white text-xl font-bold mb-4 text-center">Weight</Text>
      <View className="flex-row justify-center items-center">
        <Picker
          selectedValue={weightUnit}
          onValueChange={setWeightUnit}
          style={{ width: 120, color: 'white', backgroundColor: '#232433' }}
        >
          <Picker.Item label="Kilograms" value="kg" />
          <Picker.Item label="Pounds" value="lb" />
        </Picker>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 ml-2 w-24 text-white bg-[#232433]"
          placeholder={weightUnit === 'kg' ? '60' : '132'}
          value={tempWeight}
          onChangeText={setTempWeight}
          keyboardType="numeric"
        />
        <Text className="text-white ml-2">{weightUnit}</Text>
      </View>
      <View className="flex-row justify-between mt-6">
        <Pressable className="flex-1 items-center" onPress={() => setModal(null)}>
          <Text className="text-[#38b2ac] font-bold">CANCEL</Text>
        </Pressable>
        <Pressable
  className="flex-1 items-center"
  onPress={() => {
    let weightValue = tempWeight;
    if (weightUnit === 'lb') {
      weightValue = (parseFloat(tempWeight) * 0.453592).toFixed(1); // แปลง lb เป็น kg
    }
    setProfile(p => ({
      ...p,
      weight: weightValue,
      weightUnit,
    }));
    setModal(null);
  }}
>
  <Text className="text-[#38b2ac] font-bold">SAVE</Text>
</Pressable>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

function ProfileItem({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) {
  return (
    <Pressable
      className="flex-row items-center justify-between bg-[#232433] border border-gray-600 rounded-xl px-4 py-4 mb-3"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="text-gray-300 text-base ml-3">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#888" />
    </Pressable>
  );
}