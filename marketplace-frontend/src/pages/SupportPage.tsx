import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { supportService, type SupportTicket } from '../services/supportService';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import GradientButton from '../components/GradientButton';

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'normal',
    category: 'general',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      setError('');
      const ticket = await supportService.createTicket(formData);
      setDialogOpen(false);
      setFormData({ subject: '', description: '', priority: 'normal', category: 'general' });
      loadTickets();
      setSuccess('Тикет успешно создан');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при создании тикета');
    }
  };

  const handleSelectTicket = async (ticket: SupportTicket) => {
    try {
      const fullTicket = await supportService.getTicket(ticket.id);
      setSelectedTicket(fullTicket);
      setMessage('');
    } catch (error) {
      console.error('Error loading ticket:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !message.trim()) return;

    try {
      await supportService.addMessage(selectedTicket.id, message);
      setMessage('');
      const updatedTicket = await supportService.getTicket(selectedTicket.id);
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Поддержка"
        subtitle="Мы всегда готовы помочь вам"
        icon={<SupportAgentIcon />}
        actions={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Создать тикет
          </GradientButton>
        }
      />

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              Мои тикеты
            </Typography>
            <List sx={{ py: 0 }}>
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <ListItem
                    component="div"
                    onClick={() => handleSelectTicket(ticket)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      mb: 0.5,
                      bgcolor: selectedTicket?.id === ticket.id ? 'primary.main' : 'transparent',
                      color: selectedTicket?.id === ticket.id ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: selectedTicket?.id === ticket.id ? 'primary.dark' : 'action.hover',
                      },
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold" noWrap>
                          {ticket.subject}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: selectedTicket?.id === ticket.id ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                          }}
                        >
                          {format(new Date(ticket.created_at), 'dd.MM.yyyy')}
                        </Typography>
                      }
                    />
                    <Box sx={{ mt: 0.5 }}>
                      <StatusBadge status={ticket.status} size="small" />
                    </Box>
                  </ListItem>
                </motion.div>
              ))}
              {tickets.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Нет тикетов
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedTicket ? (
            <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {selectedTicket.subject}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatusBadge status={selectedTicket.status} />
                  <Chip
                    label={selectedTicket.priority}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 6 }}
                  />
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTicket.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ flex: 1, overflow: 'auto', mb: 2, maxHeight: 400 }}>
                {selectedTicket.messages?.map((msg) => (
                  <Box key={msg.id} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {msg.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {msg.user?.name || 'Пользователь'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(msg.created_at), 'dd.MM.yyyy HH:mm')}
                      </Typography>
                    </Stack>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3, ml: 4 }}>
                      <Typography variant="body2">{msg.message}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <GradientButton
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{ minWidth: 50, width: 50, p: 1 }}
                >
                  <SendIcon />
                </GradientButton>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 6, borderRadius: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <SupportAgentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Выберите тикет для просмотра
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Или создайте новый тикет
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Создать тикет
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Тема"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Приоритет</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              label="Приоритет"
            >
              <MenuItem value="low">Низкий</MenuItem>
              <MenuItem value="normal">Обычный</MenuItem>
              <MenuItem value="high">Высокий</MenuItem>
              <MenuItem value="urgent">Срочный</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Категория</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              label="Категория"
            >
              <MenuItem value="general">Общее</MenuItem>
              <MenuItem value="technical">Техническая проблема</MenuItem>
              <MenuItem value="billing">Оплата</MenuItem>
              <MenuItem value="other">Другое</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Отмена
          </Button>
          <GradientButton onClick={handleCreateTicket}>
            Создать
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
