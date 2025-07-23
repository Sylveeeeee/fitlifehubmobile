import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import "@/global.css";
import { EnergyProvider } from '../context/EnergyContext';

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <EnergyProvider>
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </>
    </EnergyProvider>
  );
}