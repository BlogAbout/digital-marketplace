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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { supportService, type SupportTicket } from '../services/supportService';
import { format } from 'date-fns';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Поддержка</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Создать тикет
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Мои тикеты
            </Typography>
            <List>
              {tickets.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  component="div"
                  onClick={() => handleSelectTicket(ticket)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedTicket?.id === ticket.id ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' },
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={ticket.subject}
                    secondary={format(new Date(ticket.created_at), 'dd.MM.yyyy')}
                  />
                  <Chip
                    label={ticket.status}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </ListItem>
              ))}
              {tickets.length === 0 && (
                <ListItem>
                  <ListItemText primary="Нет тикетов" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedTicket ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTicket.subject}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={selectedTicket.status}
                  color={getStatusColor(selectedTicket.status)}
                  size="small"
                />
                <Chip
                  label={selectedTicket.priority}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTicket.description}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                {selectedTicket.messages?.map((msg) => (
                  <Box key={msg.id} sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {msg.user?.name || 'Пользователь'} - {format(new Date(msg.created_at), 'dd.MM.yyyy HH:mm')}
                    </Typography>
                    <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                      <Typography>{msg.message}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  Отправить
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Выберите тикет для просмотра
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать тикет</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
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
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateTicket}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
