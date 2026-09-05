import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { format } from 'date-fns';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import { useToast } from '../components/ToastProvider';
import {
  Download as DownloadIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

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
      showToast('Ошибка при загрузке покупок', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order: Order) => {
    try {
      const result = await orderService.getDownloadLink(order.id);
      window.open(result.download_link, '_blank');
      showToast('Скачивание началось', 'success');
    } catch (error) {
      showToast('Ошибка при скачивании', 'error');
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
  };

  const orderColumns = [
    {
      key: 'product',
      label: 'Товар',
      render: (order: Order) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {order.product?.name?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {order.product?.name || 'Товар удален'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              #{order.id.substring(0, 8)}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      key: 'total',
      label: 'Сумма',
      sortable: true,
      render: (order: Order) => (
        <Typography variant="body2" fontWeight="bold">
          {order.is_free ? 'Бесплатно' : `${order.total} ${order.currency}`}
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
      label: 'Дата покупки',
      sortable: true,
      render: (order: Order) => (
        <Typography variant="body2">
          {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
        </Typography>
      ),
    },
    {
      key: 'file_expired',
      label: 'Доступ до',
      render: (order: Order) => (
        order.file_expired ? (
          <Typography variant="body2">
            {format(new Date(order.file_expired), 'dd.MM.yyyy')}
          </Typography>
        ) : (
          <Chip label="Бессрочно" size="small" color="success" />
        )
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      align: 'right' as const,
      render: (order: Order) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          {order.status === 'completed' && (
            <Tooltip title="Скачать">
              <IconButton size="small" onClick={() => handleDownload(order)}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Мои покупки"
        subtitle="Все приобретенные вами товары"
        icon={<ShoppingBagIcon />}
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
              { value: 'pending', label: 'Ожидает оплаты' },
              { value: 'paid', label: 'Оплачен' },
              { value: 'completed', label: 'Завершен' },
              { value: 'cancelled', label: 'Отменен' },
              { value: 'refunded', label: 'Возврат' },
            ],
          },
        ]}
        onClear={handleClearFilters}
      />

      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : orders.length > 0 ? (
        <DataTable
          columns={orderColumns}
          data={orders}
          emptyState={
            <EnhancedEmptyState
              icon={<ShoppingBagIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
              title="Покупок нет"
              description="Вы еще ничего не купили"
            />
          }
        />
      ) : (
        <EnhancedEmptyState
          icon={<ShoppingBagIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
          title="Покупок нет"
          description="Вы еще ничего не купили. Перейдите в каталог, чтобы найти интересные товары."
          primaryAction={{
            label: 'Перейти в каталог',
            onClick: () => window.location.href = '/products',
          }}
        />
      )}
    </Container>
  );
}
