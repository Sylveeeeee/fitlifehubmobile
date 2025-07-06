// app/(auth)/register.tsx
import RegisterStack from './RegisterStack';
import { RegisterProvider, useRegister } from './RegisterContext';

function RegisterPageContent() {
  const { registerData } = useRegister();
  console.log('registerData preview:', registerData); // ใช้ได้แล้ว

  return <RegisterStack />;
}

export default function RegisterPage() {
  return (
    <RegisterProvider>
      <RegisterPageContent />
    </RegisterProvider>
  );
}
