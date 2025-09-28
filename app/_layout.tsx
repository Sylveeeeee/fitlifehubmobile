import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import "@/global.css";
import { EnergyProvider } from '../context/EnergyContext';
import { ToastProvider } from '@/components/ToastProvider';


export default function RootLayout() {
  return (
    <EnergyProvider>
      <ToastProvider>
        <>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </>
      </ToastProvider>
    </EnergyProvider>
  );
}