import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Avatar,
} from '@mui/material';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import { useToast } from '../components/ToastProvider';
import {
  TrendingUp as TrendingUpIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      // Получаем заказы, где пользователь продавец
      const response = await orderService.getMySales();
      setOrders(response);
    } catch (error) {
      showToast('Ошибка при загрузке продаж', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0);

  const salesColumns = [
    {
      key: 'product',
      label: 'Товар',
      render: (order: Order) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {order.product?.name?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {order.product?.name || 'Товар удален'}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'buyer',
      label: 'Покупатель',
      render: (order: Order) => (
        <Typography variant="body2">
          {order.buyer?.name || 'Пользователь удален'}
        </Typography>
      ),
    },
    {
      key: 'total',
      label: 'Сумма',
      sortable: true,
      render: (order: Order) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {order.total} {order.currency}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'created_at',
      label: 'Дата',
      sortable: true,
      render: (order: Order) => (
        <Typography variant="body2">
          {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Мои продажи"
        subtitle={`Общий доход: $${totalRevenue.toFixed(2)}`}
        icon={<TrendingUpIcon />}
      />

      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : orders.length > 0 ? (
        <DataTable
          columns={salesColumns}
          data={orders}
          emptyState={
            <EnhancedEmptyState
              icon={<StorefrontIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
              title="Продаж нет"
              description="У вас пока нет продаж"
            />
          }
        />
      ) : (
        <EnhancedEmptyState
          icon={<StorefrontIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
          title="Продаж нет"
          description="Создайте товар и начните продавать!"
          primaryAction={{
            label: 'Создать товар',
            onClick: () => window.location.href = '/dashboard/products',
          }}
        />
      )}
    </Container>
  );
}
