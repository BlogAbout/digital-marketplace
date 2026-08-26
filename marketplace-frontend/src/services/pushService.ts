import api from './api';

export const pushService = {
  async subscribe(subscription: PushSubscription): Promise<void> {
    await api.post('/push/subscribe', {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
      },
    });
  },

  async unsubscribe(endpoint: string): Promise<void> {
    await api.delete('/push/unsubscribe', {
      data: { endpoint },
    });
  },

  async getSubscriptionStatus(): Promise<boolean> {
    const response = await api.get('/push/status');
    return response.data.subscribed;
  },
};
