import { useEffect, useRef, useCallback } from 'react';
import { getEcho } from '@/services/echo';
import type { Message, Notification } from '@/types';

interface WebSocketOptions {
  onMessage?: (message: Message) => void;
  onNotification?: (notification: Notification) => void;
  onChatCreated?: (chat: any) => void;
  chatId?: string;
  userId?: string;
}

export function useWebSocket(options: WebSocketOptions) {
  const { onMessage, onNotification, onChatCreated, chatId, userId } = options;
  const callbacksRef = useRef(options);

  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!userId) return;

    const echo = getEcho();
    if (!echo) return;

    // Подписка на личные уведомления
    try {
      const userChannel = echo.private(`user.${userId}`);

      userChannel.listen('.toast.notification', (e: any) => {
        callbacksRef.current.onNotification?.(e);
      });

      userChannel.listen('.chat.created', (e: any) => {
        callbacksRef.current.onChatCreated?.(e);
      });

      return () => {
        echo.leave(`user.${userId}`);
      };
    } catch (error) {
      console.error('Error subscribing to user channel:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (!chatId) return;

    const echo = getEcho();
    if (!echo) return;

    // Подписка на чат
    try {
      const chatChannel = echo.private(`chat.${chatId}`);

      chatChannel.listen('.message.sent', (e: any) => {
        callbacksRef.current.onMessage?.(e);
      });

      chatChannel.listen('.message.updated', (e: any) => {
        callbacksRef.current.onMessage?.(e);
      });

      return () => {
        echo.leave(`chat.${chatId}`);
      };
    } catch (error) {
      console.error('Error subscribing to chat channel:', error);
    }
  }, [chatId]);

  return {};
}
