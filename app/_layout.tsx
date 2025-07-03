import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNavbar from '../components/BottomNavbar';
import "../global.css";

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {/* แสดง Bottom Navbar เฉพาะเมื่อไม่ใช่หน้า login */}
      {pathname !== '/login' && (
        <BottomNavbar />
      )}
      <StatusBar style="auto" />
    </>
  );
}