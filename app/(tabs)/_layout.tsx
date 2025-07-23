import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNavbar from '@/components/BottomNavbar';
import "@/global.css";

export default function RootLayout() {
  const pathname = usePathname();
  // เงื่อนไข: ถ้าอยู่หน้า foods/[id] จะไม่แสดง BottomNavbar
  const showNavbar = !(pathname.startsWith('/(tabs)/foods/[id]') && pathname !== '/(tabs)/foods/[id]');

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {showNavbar && <BottomNavbar />}
      <StatusBar style="auto" />
    </>
  );
}