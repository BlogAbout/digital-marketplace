import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function SecurityCheck({ children }: { children: React.ReactNode }) {
  const { checkTokenExpiration, logout } = useAuthStore();

  useEffect(() => {
    // Проверка токена каждую минуту
    const interval = setInterval(() => {
      if (!checkTokenExpiration()) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
