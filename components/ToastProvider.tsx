import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // ✅ ใช้ useRef เพื่อไม่ reset ค่า

  const showToast = (msg: string, t: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    // fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // auto close after 3s
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: fadeAnim,
              backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
            },
          ]}
        >
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: width - 40,
    zIndex: 9999, // ✅ ให้อยู่บนสุด
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
