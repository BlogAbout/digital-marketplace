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
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { disputeService, type Dispute } from '../services/disputeService';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [formData, setFormData] = useState({
    order_id: '',
    reason: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDisputes();
    loadOrders();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const response = await disputeService.getDisputes();
      setDisputes(response.data);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const orders = await orderService.getMyOrders();
      // Только завершенные заказы можно оспорить
      setOrders(orders.filter(order => order.status === 'completed'));
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleCreateDispute = async () => {
    try {
      setError('');
      const dispute = await disputeService.createDispute(formData);
      setDialogOpen(false);
      setFormData({ order_id: '', reason: '', description: '' });
      loadDisputes();
      setSuccess('Спор успешно создан');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при создании спора');
    }
  };

  const handleSelectDispute = async (dispute: Dispute) => {
    try {
      const fullDispute = await disputeService.getDispute(dispute.id);
      setSelectedDispute(fullDispute);
      setMessage('');
    } catch (error) {
      console.error('Error loading dispute:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDispute || !message.trim()) return;

    try {
      await disputeService.addMessage(selectedDispute.id, message);
      setMessage('');
      const updatedDispute = await disputeService.getDispute(selectedDispute.id);
      setSelectedDispute(updatedDispute);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'under_review': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'under_review': return 'На рассмотрении';
      case 'resolved': return 'Решен';
      case 'closed': return 'Закрыт';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Споры</Typography>
        <Button
          variant="contained"
          onClick={() => setDialogOpen(true)}
        >
          Создать спор
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
              Мои споры
            </Typography>
            <List>
              {disputes.map((dispute) => (
                <ListItem
                  key={dispute.id}
                  component="div"
                  onClick={() => handleSelectDispute(dispute)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedDispute?.id === dispute.id ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' },
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={dispute.reason}
                    secondary={format(new Date(dispute.created_at), 'dd.MM.yyyy')}
                  />
                  <Chip
                    label={getStatusLabel(dispute.status)}
                    color={getStatusColor(dispute.status)}
                    size="small"
                  />
                </ListItem>
              ))}
              {disputes.length === 0 && (
                <ListItem>
                  <ListItemText primary="Нет споров" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedDispute ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Спор #{selectedDispute.id.substring(0, 8)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={getStatusLabel(selectedDispute.status)}
                  color={getStatusColor(selectedDispute.status)}
                  size="small"
                />
                {selectedDispute.resolution && (
                  <Chip
                    label={selectedDispute.resolution}
                    size="small"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Причина: {selectedDispute.reason}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedDispute.description}
              </Typography>
              {selectedDispute.resolution_note && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Решение: {selectedDispute.resolution_note}
                </Alert>
              )}
              {selectedDispute.refund_amount && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Возврат: ${selectedDispute.refund_amount}
                </Alert>
              )}
              <Divider sx={{ my: 2 }} />

              <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                {selectedDispute.messages?.map((msg) => (
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

              {selectedDispute.status !== 'closed' && selectedDispute.status !== 'resolved' && (
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
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Выберите спор для просмотра
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать спор</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Заказ</InputLabel>
            <Select
              value={formData.order_id}
              onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
              label="Заказ"
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  Заказ #{order.id.substring(0, 8)} - {order.product?.name || 'Товар'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Причина"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateDispute}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
