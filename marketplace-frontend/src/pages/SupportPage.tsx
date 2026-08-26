// src/pages/SupportPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Grid,
  Stack,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { supportService, type SupportTicket } from '../services/supportService';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import Modal from '../components/Modal';
import GradientButton from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
  const { showToast } = useToast();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTickets();
      setTickets(response.data);
    } catch (error) {
      showToast('Ошибка при загрузке тикетов', 'error');
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
      showToast('Тикет успешно создан', 'success');
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
      showToast('Ошибка при загрузке тикета', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !message.trim()) return;

    try {
      await supportService.addMessage(selectedTicket.id, message);
      setMessage('');
      const updatedTicket = await supportService.getTicket(selectedTicket.id);
      setSelectedTicket(updatedTicket);
      showToast('Сообщение отправлено', 'success');
    } catch (error) {
      showToast('Ошибка при отправке сообщения', 'error');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <SkeletonLoader type="list" count={6} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Поддержка"
        subtitle="Мы всегда готовы помочь вам"
        icon={<SupportAgentIcon />}
        actions={
          <GradientButton onClick={() => setDialogOpen(true)}>
            Создать тикет
          </GradientButton>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              Мои тикеты
            </Typography>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => handleSelectTicket(ticket)}
                  style={{
                    cursor: 'pointer',
                    padding: 12,
                    borderRadius: 12,
                    bgcolor: selectedTicket?.id === ticket.id ? 'primary.main' : 'transparent',
                    color: selectedTicket?.id === ticket.id ? 'white' : 'text.primary',
                    marginBottom: 4,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {format(new Date(ticket.created_at), 'dd.MM.yyyy')}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusBadge status={ticket.status} size="small" />
                  </Box>
                </motion.div>
              ))}
              {tickets.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Нет тикетов
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedTicket ? (
            <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {selectedTicket.subject}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <StatusBadge status={selectedTicket.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTicket.description}
              </Typography>

              <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
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
            <EnhancedEmptyState
              icon={<SupportAgentIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
              title="Выберите тикет"
              description="Выберите тикет из списка или создайте новый"
              primaryAction={{
                label: 'Создать тикет',
                onClick: () => setDialogOpen(true),
              }}
            />
          )}
        </Grid>
      </Grid>

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Создать тикет"
        maxWidth="sm"
        actions={
          <>
            <button onClick={() => setDialogOpen(false)} className="btn btn-outline">
              Отмена
            </button>
            <GradientButton onClick={handleCreateTicket}>
              Создать
            </GradientButton>
          </>
        }
      >
        <Box sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
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
        </Box>
      </Modal>
    </Container>
  );
}
