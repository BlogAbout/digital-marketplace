import { useEffect, useRef, useCallback } from 'react';
import echo from '../services/echo';
import type { Message, Notification } from '../types';

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

    // Подписка на личные уведомления
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
  }, [userId]);

  useEffect(() => {
    if (!chatId) return;

    // Подписка на чат
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
  }, [chatId]);

  const sendMessage = useCallback((chatId: string, message: Message) => {
    // Отправка через WebSocket (если нужно)
    // Основная отправка через REST API
  }, []);

  return { sendMessage };
}
