// src/pages/DisputesPage.tsx
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
import GavelIcon from '@mui/icons-material/Gavel';
import { disputeService, type Dispute } from '../services/disputeService';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import Modal from '../components/Modal';
import GradientButton from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';
import { FormControl, InputLabel, Select, MenuItem, Alert, Chip } from '@mui/material';

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
  const { showToast } = useToast();

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
      showToast('Ошибка при загрузке споров', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const orders = await orderService.getMyOrders();
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
      showToast('Спор успешно создан', 'success');
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
      showToast('Ошибка при загрузке спора', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDispute || !message.trim()) return;

    try {
      await disputeService.addMessage(selectedDispute.id, message);
      setMessage('');
      const updatedDispute = await disputeService.getDispute(selectedDispute.id);
      setSelectedDispute(updatedDispute);
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
        title="Споры"
        subtitle="Управление спорными ситуациями"
        icon={<GavelIcon />}
        actions={
          <GradientButton onClick={() => setDialogOpen(true)}>
            Создать спор
          </GradientButton>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              Мои споры
            </Typography>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {disputes.map((dispute, index) => (
                <motion.div
                  key={dispute.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => handleSelectDispute(dispute)}
                  style={{
                    cursor: 'pointer',
                    padding: 12,
                    borderRadius: 12,
                    bgcolor: selectedDispute?.id === dispute.id ? 'primary.main' : 'transparent',
                    color: selectedDispute?.id === dispute.id ? 'white' : 'text.primary',
                    marginBottom: 4,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {dispute.reason}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {format(new Date(dispute.created_at), 'dd.MM.yyyy')}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusBadge status={dispute.status} size="small" />
                  </Box>
                </motion.div>
              ))}
              {disputes.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Нет споров
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedDispute ? (
            <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Спор #{selectedDispute.id.substring(0, 8)}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                <StatusBadge status={selectedDispute.status} />
                {selectedDispute.resolution && (
                  <Chip
                    label={selectedDispute.resolution}
                    size="small"
                    color="info"
                    sx={{ borderRadius: 6 }}
                  />
                )}
              </Stack>

              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Причина
                </Typography>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  {selectedDispute.reason}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Описание
                </Typography>
                <Typography variant="body2">
                  {selectedDispute.description}
                </Typography>
              </Box>

              {selectedDispute.resolution_note && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>
                  Решение: {selectedDispute.resolution_note}
                </Alert>
              )}

              {selectedDispute.refund_amount && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                  Возврат: ${selectedDispute.refund_amount}
                </Alert>
              )}

              <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                {selectedDispute.messages?.map((msg) => (
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

              {selectedDispute.status !== 'closed' && selectedDispute.status !== 'resolved' && (
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
              )}
            </Paper>
          ) : (
            <EnhancedEmptyState
              icon={<GavelIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
              title="Выберите спор"
              description="Выберите спор из списка или создайте новый"
              primaryAction={{
                label: 'Создать спор',
                onClick: () => setDialogOpen(true),
              }}
            />
          )}
        </Grid>
      </Grid>

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Создать спор"
        maxWidth="sm"
        actions={
          <>
            <button onClick={() => setDialogOpen(false)} className="btn btn-outline">
              Отмена
            </button>
            <GradientButton onClick={handleCreateDispute}>
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
        </Box>
      </Modal>
    </Container>
  );
}
