// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import type { Product, Order } from '../types';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Sidebar from '../components/Sidebar';
import GradientButton from '../components/GradientButton';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import FloatingActionButton from '../components/FloatingActionButton';
import AvatarWithStatus from '../components/AvatarWithStatus';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getProducts({ per_page: 100 }),
        orderService.getMyOrders(),
      ]);
      setProducts(productsResponse.data);
      setOrders(ordersResponse);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0);

  const totalSales = orders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .length;

  const totalViews = products.reduce((sum, product) => sum + product.views_count, 0);

  const sidebarItems = [
    { label: 'Обзор', icon: <DashboardIcon />, to: '/dashboard' },
    { label: 'Мои товары', icon: <ShoppingCartIcon />, to: '/dashboard/products' },
    { label: 'Заказы', icon: <ReceiptIcon />, to: '/dashboard/orders' },
    { label: 'Статистика', icon: <BarChartIcon />, to: '/dashboard/statistics' },
    { label: 'Споры', icon: <GavelIcon />, to: '/dashboard/disputes' },
  ];

  const productColumns = [
    {
      key: 'name',
      label: 'Товар',
      sortable: true,
      render: (product: Product) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarWithStatus user={product.author!} size={36} showOnline={false} />
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (product: Product) => <StatusBadge status={product.status} />,
    },
    {
      key: 'cost',
      label: 'Цена',
      sortable: true,
      render: (product: Product) => (
        <Typography variant="body2">
          {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
        </Typography>
      ),
    },
    {
      key: 'sales_count',
      label: 'Продажи',
      align: 'right' as const,
      sortable: true,
    },
    {
      key: 'views_count',
      label: 'Просмотры',
      align: 'right' as const,
      sortable: true,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Добро пожаловать, {user?.name}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Управляйте своими товарами, отслеживайте продажи и развивайте бизнес
            </Typography>
            <GradientButton
              component={Link}
              to="/dashboard/products"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Добавить товар
            </GradientButton>
          </Box>
        </Paper>
      </motion.div>

      {loading ? (
        <SkeletonLoader type="card" count={4} />
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Продажи"
              value={totalSales}
              icon={<ShoppingCartIcon />}
              color="#10B981"
              trend={12}
              index={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Доход"
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<MoneyIcon />}
              color="#6366F1"
              trend={8}
              index={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Просмотры"
              value={totalViews}
              icon={<VisibilityIcon />}
              color="#F59E0B"
              index={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Товары"
              value={products.length}
              icon={<DashboardIcon />}
              color="#8B5CF6"
              index={3}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ borderRadius: 4 }}>
            <Sidebar title="Навигация" items={sidebarItems} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Последние товары
            </Typography>
            {loading ? (
              <SkeletonLoader type="list" count={5} />
            ) : (
              <DataTable
                columns={productColumns}
                data={products.slice(0, 10)}
                emptyState={
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      У вас пока нет товаров
                    </Typography>
                  </Box>
                }
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <FloatingActionButton
        onClick={() => window.location.href = '/dashboard/products'}
        tooltip="Добавить товар"
      />
    </Container>
  );
}
