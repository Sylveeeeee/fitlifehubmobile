import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
  Entypo,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  route:
    | '/Account'
    | '/Profile'
    | '/targets'
    | '/fasting'
    | '/display'
    | '/connect'
    | '/sharing'
    | '/referrals'
    | '/support'
    | '/about';
};

const fullMenu: MenuItem[] = [
  {
    label: 'Account',
    icon: <Ionicons name="settings-outline" size={22} color="#fff" />,
    route: '/Account',
  },
  {
    label: 'Profile',
    icon: <Ionicons name="person-outline" size={22} color="#fff" />,
    route: '/Profile',
  },
  {
    label: 'Targets',
    icon: <Ionicons name="radio-button-on-outline" size={22} color="#fff" />,
    route: '/targets',
  },
  {
    label: 'Fasting',
    icon: <MaterialIcons name="timer" size={22} color="#fff" />,
    route: '/fasting',
  },
  {
    label: 'Display',
    icon: <Ionicons name="phone-portrait-outline" size={22} color="#fff" />,
    route: '/display',
  },
  {
    label: 'Connect Apps & Devices',
    icon: <Feather name="refresh-cw" size={22} color="#fff" />,
    route: '/connect',
  },
  {
    label: 'Sharing',
    icon: <Feather name="share-2" size={22} color="#fff" />,
    route: '/sharing',
  },
  {
    label: 'Referrals',
    icon: <FontAwesome5 name="user-friends" size={22} color="#fff" />,
    route: '/referrals',
  },
  {
    label: 'Support',
    icon: <Entypo name="help-with-circle" size={22} color="#fff" />,
    route: '/support',
  },
  {
    label: 'About',
    icon: (
      <Ionicons name="information-circle-outline" size={22} color="#fff" />
    ),
    route: '/about',
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>(fullMenu);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Error fetching user:', e);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredMenu(fullMenu);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredMenu(
        fullMenu.filter((item) =>
          item.label.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#15161f' }}>
      <View style={{ paddingTop: 48, paddingBottom: 16, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#ffb300', marginBottom: 4 }}>
          More
        </Text>
        <Text style={{ fontSize: 16, color: '#ccc', marginBottom: 5 }}>
          {user?.name || '-'}
        </Text>
        <Text style={{ fontSize: 16, color: '#ccc', marginBottom: 16 }}>
          {user?.email || '-'}
        </Text>
        <View
          style={{
            backgroundColor: '#2e3047',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 16,
          }}
        >
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            style={{ color: 'white', fontSize: 16 }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 8 }}>
        {filteredMenu.map((item) => (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)} // 👈 ปิด TypeScript error ชั่วคราว
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#292b40',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.icon}
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: 12,
                }}
              >
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
