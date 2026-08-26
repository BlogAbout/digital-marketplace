import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  IconButton,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useAuthStore } from '../stores/authStore';
import { messengerService } from '../services/messengerService';
import { supportService } from '../services/supportService';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Chat, Message } from '../types';
import { format } from 'date-fns';

export default function SupportChatPage() {
  const { user } = useAuthStore();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useWebSocket({
    userId: user?.id,
    chatId: chat?.id,
    onMessage: (message) => {
      if (chat && message.chat_id === chat.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    },
  });

  useEffect(() => {
    initSupportChat();
  }, []);

  const initSupportChat = async () => {
    try {
      setLoading(true);
      // Ищем или создаем чат поддержки
      const chats = await messengerService.getChats();
      const supportChat = chats.find(c => c.type === 'support');

      if (supportChat) {
        setChat(supportChat);
        await loadMessages(supportChat.id);
      } else {
        // Создаем чат поддержки через API
        const response = await api.post('/support/chat/create');
        setChat(response.data.chat);
      }
    } catch (error) {
      setError('Ошибка при инициализации чата поддержки');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await messengerService.getMessages(chatId);
      setMessages(response.data.reverse());
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || !user) return;

    try {
      setSending(true);
      const message = await messengerService.sendMessage(chat.id, {
        text: newMessage,
      });
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">
            Чат поддержки
          </Typography>
          <Typography variant="caption">
            Мы всегда готовы помочь вам
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.user_id === user?.id ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  display: 'flex',
                  gap: 1,
                  flexDirection: message.user_id === user?.id ? 'row-reverse' : 'row',
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: message.user_id === user?.id ? 'primary.main' : 'secondary.main' }}>
                  {message.user_id === user?.id ? 'U' : 'S'}
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: message.user_id === user?.id ? 'primary.main' : 'white',
                    color: message.user_id === user?.id ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                    {format(new Date(message.created_at), 'HH:mm')}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
