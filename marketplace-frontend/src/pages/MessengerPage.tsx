// src/pages/MessengerPage.tsx
import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthStore } from '../stores/authStore';
import { messengerService } from '../services/messengerService';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Chat, Message } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarWithStatus from '../components/AvatarWithStatus';
import SkeletonLoader from '../components/SkeletonLoader';
import GradientButton from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';

export default function MessengerPage() {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useWebSocket({
    userId: user?.id,
    chatId: activeChat?.id,
    onMessage: (message) => {
      if (activeChat && message.chat_id === activeChat.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    },
  });

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
    }
  }, [activeChat]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await messengerService.getChats();
      setChats(data);
    } catch (error) {
      showToast('Ошибка при загрузке чатов', 'error');
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
      showToast('Ошибка при загрузке сообщений', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !user) return;

    try {
      setSending(true);
      const message = await messengerService.sendMessage(activeChat.id, {
        text: newMessage,
      });
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      showToast('Ошибка при отправке сообщения', 'error');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const chatName = chat.name || chat.participants?.find(p => p.id !== user?.id)?.name || '';
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <SkeletonLoader type="list" count={8} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 100px)', py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Chat List */}
          <Grid item xs={12} md={4} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Сообщения
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Поиск чатов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ overflow: 'auto', height: 'calc(100% - 100px)' }}>
              <AnimatePresence>
                {filteredChats.map((chat, index) => {
                  const chatName = chat.name || chat.participants?.find(p => p.id !== user?.id)?.name || 'Чат';
                  const isActive = activeChat?.id === chat.id;
                  const chatUser = chat.participants?.find(p => p.id !== user?.id);

                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      onClick={() => setActiveChat(chat)}
                      style={{
                        cursor: 'pointer',
                        padding: 12,
                        bgcolor: isActive ? 'primary.main' : 'transparent',
                        color: isActive ? 'white' : 'text.primary',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {chatUser && (
                          <AvatarWithStatus
                            user={chatUser}
                            size={40}
                            showOnline={chat.type === 'private'}
                          />
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={isActive ? 'bold' : 'medium'} noWrap>
                            {chatName}
                          </Typography>
                          <Typography variant="caption" noWrap sx={{ opacity: 0.7 }}>
                            {chat.last_message?.text?.substring(0, 50) || 'Нет сообщений'}
                          </Typography>
                        </Box>
                        {chat.last_message && (
                          <Typography variant="caption" sx={{ opacity: 0.7, whiteSpace: 'nowrap' }}>
                            {format(new Date(chat.last_message.created_at), 'HH:mm')}
                          </Typography>
                        )}
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Messages */}
          <Grid item xs={12} md={8}>
            {activeChat ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {activeChat.name || activeChat.participants?.find(p => p.id !== user?.id)?.name || 'Чат'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'grey.50' }}>
                  {messages.map((message, index) => {
                    const isOwn = message.user_id === user?.id;
                    const prevMessage = messages[index - 1];
                    const showDate = !prevMessage ||
                      format(new Date(prevMessage.created_at), 'dd.MM.yyyy') !==
                      format(new Date(message.created_at), 'dd.MM.yyyy');

                    return (
                      <Box key={message.id}>
                        {showDate && (
                          <Box sx={{ textAlign: 'center', my: 2 }}>
                            <Chip
                              label={format(new Date(message.created_at), 'dd MMMM yyyy')}
                              size="small"
                            />
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              bgcolor: isOwn ? 'primary.main' : 'white',
                              color: isOwn ? 'white' : 'text.primary',
                              borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            }}
                          >
                            <Typography variant="body1">{message.text}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                              {format(new Date(message.created_at), 'HH:mm')}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Введите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <GradientButton
                      onClick={handleSendMessage}
                      disabled={sending || !newMessage.trim()}
                      sx={{ minWidth: 50, width: 50, p: 1 }}
                    >
                      <SendIcon />
                    </GradientButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  Выберите чат для начала общения
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
