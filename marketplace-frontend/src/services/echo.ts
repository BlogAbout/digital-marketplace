import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo<any> | null;
  }
}

// Не инициализируем Echo сразу, только настраиваем Pusher
window.Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

export function getEcho(): Echo<any> | null {
  if (!echoInstance) {
    const token = localStorage.getItem('token');

    // Если нет токена, не создаем Echo
    if (!token) {
      return null;
    }

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_REVERB_APP_KEY || 'marketplace_key',
      wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
      wsPort: parseInt(import.meta.env.VITE_REVERB_PORT || '8081'),
      wssPort: parseInt(import.meta.env.VITE_REVERB_PORT || '8081'),
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      cluster: 'mt1', // Добавляем cluster
      authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

export default { getEcho, disconnectEcho };
