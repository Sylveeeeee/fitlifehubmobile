import React, { createContext, useContext, useState } from 'react';

const RegisterContext = createContext<any>(null);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [registerData, setRegisterData] = useState({});
  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  return useContext(RegisterContext);
}
