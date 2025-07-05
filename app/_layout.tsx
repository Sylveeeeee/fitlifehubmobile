import React, { useState, useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import RegisterStack from './register/RegisterStack';
import "../global.css";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const pathname = usePathname();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  // ตรวจสอบ token ใน AsyncStorage
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsRegistered(!!token);
    };
    checkToken();
  }, []);

  // ยังไม่รู้สถานะ (รอโหลด)
  if (isRegistered === null) return null;

  if (!isRegistered) {
    // ยังไม่ได้ login/register
    return (
      <>
        <RegisterStack onRegisterSuccess={() => setIsRegistered(true)} />
        <StatusBar style="auto" />
      </>
    );
  }

  // login/register แล้ว
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {pathname !== '/login' && <BottomNavbar />}
      <StatusBar style="auto" />
    </>
  );
}