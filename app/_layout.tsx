import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNavbar from '../components/BottomNavbar';
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavbar />
      <StatusBar style="auto" />
    </>
  );
}