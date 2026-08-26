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
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      let filtered = data;

      if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
      }

      if (searchQuery) {
        filtered = filtered.filter(order =>
          order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setOrders(filtered);
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

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
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
        title="Мои заказы"
        subtitle="История всех ваших покупок"
        icon={<ReceiptIcon />}
        breadcrumbs={[
          { label: 'Главная', to: '/' },
          { label: 'Дашборд', to: '/dashboard' },
          { label: 'Заказы' },
        ]}
      />

      <FilterBar
        searchPlaceholder="Поиск по товарам..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            label: 'Статус',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'pending', label: 'Ожидает' },
              { value: 'paid', label: 'Оплачен' },
              { value: 'completed', label: 'Завершен' },
              { value: 'cancelled', label: 'Отменен' },
            ],
          },
        ]}
        onClear={handleClearFilters}
      />

      {orders.length > 0 ? (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Заказ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Товар</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Сумма</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        #{order.id.substring(0, 8)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                          {order.product?.name?.charAt(0) || '?'}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {order.product?.name || '-'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {order.total} {order.currency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Просмотр">
                          <IconButton size="small" onClick={() => handleViewOrder(order)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {order.status === 'completed' && (
                          <Tooltip title="Скачать">
                            <IconButton size="small" onClick={() => handleDownload(order)}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {order.status === 'pending' && (
                          <Tooltip title="Отменить">
                            <IconButton size="small" onClick={() => handleCancelOrder(order)} color="error">
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <EmptyState
          icon={<ShoppingBagIcon sx={{ fontSize: 80, color: 'text.secondary' }} />}
          title="Заказы не найдены"
          description="У вас пока нет заказов или они не соответствуют фильтрам"
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Информация о заказе
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Номер заказа
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    #{selectedOrder.id.substring(0, 8)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Товар
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedOrder.product?.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Сумма
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedOrder.total} {selectedOrder.currency}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Статус
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusBadge status={selectedOrder.status} />
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Дата создания
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedOrder.created_at), 'dd.MM.yyyy HH:mm')}
                  </Typography>
                </Box>

                {selectedOrder.domain && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Домен
                    </Typography>
                    <Typography variant="body1">
                      {selectedOrder.domain}
                    </Typography>
                  </Box>
                )}

                {selectedOrder.file_expired && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Файл доступен до
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(selectedOrder.file_expired), 'dd.MM.yyyy')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
