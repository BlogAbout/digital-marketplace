import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  Badge,
  CircularProgress,
  Stack,
  Chip,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '../stores/authStore';
import { messengerService } from '../services/messengerService';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Chat, Message } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import GradientButton from '../components/GradientButton';

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
      console.error('Error loading chats:', error);
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

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const chatName = chat.name || chat.participants?.find(p => p.id !== user?.id)?.name || '';
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
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

            <List sx={{ overflow: 'auto', height: 'calc(100% - 100px)', py: 0 }}>
              <AnimatePresence>
                {filteredChats.map((chat, index) => {
                  const chatName = chat.name || chat.participants?.find(p => p.id !== user?.id)?.name || 'Чат';
                  const isActive = activeChat?.id === chat.id;

                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <ListItem
                        component="div"
                        onClick={() => setActiveChat(chat)}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 1.5,
                          bgcolor: isActive ? 'primary.main' : 'transparent',
                          color: isActive ? 'white' : 'text.primary',
                          '&:hover': {
                            bgcolor: isActive ? 'primary.dark' : 'action.hover',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="success"
                            variant="dot"
                            invisible={!chat.last_message}
                          >
                            <Avatar
                              sx={{
                                bgcolor: isActive ? 'white' : 'primary.main',
                                color: isActive ? 'primary.main' : 'white',
                              }}
                            >
                              {chat.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={isActive ? 'bold' : 'medium'}
                              noWrap
                            >
                              {chatName}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}
                            >
                              {chat.last_message?.text?.substring(0, 50) || 'Нет сообщений'}
                            </Typography>
                          }
                        />
                        {chat.last_message && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: isActive ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                              ml: 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {format(new Date(chat.last_message.created_at), 'HH:mm')}
                          </Typography>
                        )}
                      </ListItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredChats.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Нет чатов
                  </Typography>
                </Box>
              )}
            </List>
          </Grid>

          {/* Messages */}
          <Grid item xs={12} md={8}>
            {activeChat ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {activeChat.type === 'group' ? <GroupIcon /> : <PersonIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {activeChat.name || activeChat.participants?.find(p => p.id !== user?.id)?.name || 'Чат'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activeChat.participants?.length || 0} участников
                    </Typography>
                  </Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Messages Area */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    bgcolor: 'grey.50',
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwn = message.user_id === user?.id;
                      const prevMessage = messages[index - 1];
                      const showDate = !prevMessage ||
                        format(new Date(prevMessage.created_at), 'dd.MM.yyyy') !==
                        format(new Date(message.created_at), 'dd.MM.yyyy');

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {showDate && (
                            <Box sx={{ textAlign: 'center', my: 2 }}>
                              <Chip
                                label={format(new Date(message.created_at), 'dd MMMM yyyy')}
                                size="small"
                                sx={{ bgcolor: 'grey.200' }}
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
                            <Box
                              sx={{
                                maxWidth: '70%',
                                display: 'flex',
                                gap: 1,
                                flexDirection: isOwn ? 'row-reverse' : 'row',
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: isOwn ? 'primary.main' : 'secondary.main',
                                  fontSize: 14,
                                }}
                              >
                                {message.user?.name?.charAt(0) || 'U'}
                              </Avatar>
                              <Box>
                                <Paper
                                  sx={{
                                    p: 2,
                                    bgcolor: isOwn ? 'primary.main' : 'white',
                                    color: isOwn ? 'white' : 'text.primary',
                                    borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  }}
                                >
                                  {message.reply_to && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: 'block',
                                        mb: 1,
                                        opacity: 0.7,
                                        borderLeft: '2px solid',
                                        pl: 1,
                                      }}
                                    >
                                      ↪ {message.reply_to.text?.substring(0, 50)}
                                    </Typography>
                                  )}
                                  <Typography variant="body1">
                                    {message.text}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      mt: 0.5,
                                      opacity: 0.7,
                                      textAlign: isOwn ? 'right' : 'left',
                                    }}
                                  >
                                    {format(new Date(message.created_at), 'HH:mm')}
                                    {message.is_edited && ' (изменено)'}
                                  </Typography>
                                </Paper>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    gap: 1,
                    bgcolor: 'white',
                  }}
                >
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                      },
                    }}
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
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Выберите чат
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Начните общение с другими пользователями
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
