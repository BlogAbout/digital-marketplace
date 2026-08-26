import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleDownload = async (order: Order) => {
    try {
      const result = await orderService.getDownloadLink(order.id);
      setDownloadLink(result.download_link);
      window.open(result.download_link, '_blank');
    } catch (error) {
      console.error('Error getting download link:', error);
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
      try {
        await orderService.cancelOrder(order.id);
        loadOrders();
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'paid': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'refunded': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает оплаты';
      case 'cancelled': return 'Отменен';
      case 'refunded': return 'Возврат';
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
      <Typography variant="h4" gutterBottom>
        Мои заказы
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Заказ</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id.substring(0, 8)}</TableCell>
                <TableCell>{order.product?.name || '-'}</TableCell>
                <TableCell>
                  {order.total} {order.currency}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'dd.MM.yyyy')}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleViewOrder(order)}>
                    Просмотр
                  </Button>
                  {order.status === 'completed' && (
                    <Button size="small" onClick={() => handleDownload(order)}>
                      Скачать
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button size="small" color="error" onClick={() => handleCancelOrder(order)}>
                      Отменить
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  У вас пока нет заказов
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Информация о заказе</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedOrder.product?.name || 'Товар'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={getStatusLabel(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                />
              </Box>
              <Typography variant="body1" gutterBottom>
                Сумма: {selectedOrder.total} {selectedOrder.currency}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Дата: {format(new Date(selectedOrder.created_at), 'dd.MM.yyyy HH:mm')}
              </Typography>
              {selectedOrder.domain && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Домен: {selectedOrder.domain}
                </Typography>
              )}
              {selectedOrder.file_expired && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Файл доступен до: {format(new Date(selectedOrder.file_expired), 'dd.MM.yyyy')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
