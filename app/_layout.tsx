import React, { useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import BottomNavbar from '../components/BottomNavbar';
import RegisterStack from './register/RegisterStack'; // เพิ่ม import
import "../global.css";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const pathname = usePathname();
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isRegistered) {
    // แสดง flow สมัครสมาชิก
    return (
      <>
        <RegisterStack />
        <StatusBar style="auto" />
      </>
    );
  }

  // แสดง navigation ปกติ
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {pathname !== '/login' && <BottomNavbar />}
      <StatusBar style="auto" />
    </>
  );
}