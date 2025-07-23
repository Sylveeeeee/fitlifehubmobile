import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNavbar from '@/components/BottomNavbar';
import "@/global.css";

export default function RootLayout() {
  const pathname = usePathname();
  // ซ่อน BottomNavbar เมื่ออยู่หน้า foods/[id]
  const showNavbar = !(pathname.startsWith('/(tabs)/foods/'));

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {showNavbar && <BottomNavbar />}
      <StatusBar style="auto" />
    </>
  );
}