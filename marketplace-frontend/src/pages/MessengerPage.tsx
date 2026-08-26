import {useEffect, useRef, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useAuthStore} from '../stores/authStore';
import {messengerService} from '../services/messengerService';
import {useWebSocket} from '../hooks/useWebSocket';
import type {Chat, Message} from '../types';
import {format} from 'date-fns';

export default function MessengerPage() {
  const {user} = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket подписка
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
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{height: 'calc(100vh - 100px)'}}>
      <Grid container spacing={2} sx={{height: '100%'}}>
        {/* Список чатов */}
        <Grid item xs={12} md={4}>
          <Paper sx={{height: '100%', overflow: 'hidden'}}>
            <Typography variant="h6" sx={{p: 2, borderBottom: 1, borderColor: 'divider'}}>
              Чаты
            </Typography>
            <List sx={{overflow: 'auto', height: 'calc(100% - 60px)'}}>
              {chats.map((chat) => (
                <ListItem
                  key={chat.id}
                  component="div"
                  onClick={() => setActiveChat(chat)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: activeChat?.id === chat.id ? 'action.selected' : 'transparent',
                    '&:hover': {bgcolor: 'action.hover'},
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {chat.type === 'group' ? 'G' : 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.name || chat.participants?.find(p => p.id !== user?.id)?.name || 'Чат'}
                    secondary={chat.last_message?.text?.substring(0, 50) || 'Нет сообщений'}
                  />
                </ListItem>
              ))}
              {chats.length === 0 && (
                <ListItem>
                  <ListItemText primary="Нет чатов"/>
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Сообщения */}
        <Grid item xs={12} md={8}>
          <Paper sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {activeChat ? (
              <>
                <Box sx={{p: 2, borderBottom: 1, borderColor: 'divider'}}>
                  <Typography variant="h6">
                    {activeChat.name || activeChat.participants?.find(p => p.id !== user?.id)?.name || 'Чат'}
                  </Typography>
                </Box>

                <Box sx={{flex: 1, overflow: 'auto', p: 2}}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.user_id === user?.id ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.user_id === user?.id ? 'primary.main' : 'grey.100',
                          color: message.user_id === user?.id ? 'white' : 'text.primary',
                        }}
                      >
                        {message.reply_to && (
                          <Typography variant="caption" sx={{display: 'block', mb: 1, opacity: 0.7}}>
                            ↪ {message.reply_to.text?.substring(0, 50)}
                          </Typography>
                        )}
                        <Typography variant="body1">{message.text}</Typography>
                        <Typography variant="caption" sx={{display: 'block', mt: 1, opacity: 0.7}}>
                          {format(new Date(message.created_at), 'HH:mm')}
                          {message.is_edited && ' (изменено)'}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef}/>
                </Box>

                <Box sx={{p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1}}>
                  <IconButton>
                    <AttachFileIcon/>
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
                    <SendIcon/>
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">
                  Выберите чат для начала общения
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
