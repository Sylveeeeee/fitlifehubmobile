import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNavbar from '@/components/BottomNavbar';
import "@/global.css";
import { ToastProvider } from '@/components/ToastProvider';
import { View } from 'react-native';

export default function RootLayout() {
  const pathname = usePathname();
  const showNavbar = !(pathname.startsWith('/foods/'));

  return (
    <ToastProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        {showNavbar && <BottomNavbar />}
        <StatusBar style="auto" />
      </View>
    </ToastProvider>
  );
}
