import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterStep1 from './step1-profile';
import RegisterStep2 from './step2-activity';
import RegisterStep3 from './step3-weight-goal';
import RegisterStep4 from './step4-goal-rate';
import RegisterStep5 from './step5-goal-overview';
import RegisterStep6 from './step6-account';
import RegisterStep7 from './step7-terms';

import { RegisterProvider } from './RegisterContext';

const Stack = createStackNavigator();

export default function RegisterStack() {
  return (
    <RegisterProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="step1-profile" component={RegisterStep1} />
        <Stack.Screen name="step2-activity" component={RegisterStep2} />
        <Stack.Screen name="step3-weight-goal" component={RegisterStep3} />        
        <Stack.Screen name="step4-goal-rate" component={RegisterStep4} />        
        <Stack.Screen name="step5-goal-overview" component={RegisterStep5} />
        <Stack.Screen name="step6-account" component={RegisterStep6} />
        <Stack.Screen name="step7-terms" component={RegisterStep7} />        
        
      </Stack.Navigator>
    </RegisterProvider>
  );
}