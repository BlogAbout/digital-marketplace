import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'marketplace_key',
  wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
  wsPort: parseInt(import.meta.env.VITE_REVERB_PORT || '8081'),
  wssPort: parseInt(import.meta.env.VITE_REVERB_PORT || '8081'),
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

export default echo;
