import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import type { Product, Order } from '../types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState(0);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = orders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0);

  const totalSales = orders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .length;

  const totalViews = products.reduce((sum, product) => sum + product.views_count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'paid': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'refunded': return 'default';
      case 'approved': return 'success';
      case 'draft': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменен';
      case 'refunded': return 'Возврат';
      case 'approved': return 'Одобрен';
      case 'draft': return 'Черновик';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>

      <Grid container spacing={3}>
        {/* Боковое меню */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Навигация
            </Typography>
            <List>
              <ListItem
                component={Link}
                to="/dashboard"
                sx={{
                  borderRadius: 1,
                  bgcolor: tab === 0 ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Обзор" />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/products"
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <ShoppingCartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Мои товары" />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/orders"
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Заказы" />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/statistics"
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <BarChartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Статистика" />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/disputes"
                sx={{
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <GavelIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Споры" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Основной контент */}
        <Grid item xs={12} md={9}>
          {/* Статистические карточки */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {totalSales}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Продажи
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  ${totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Доход
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {totalViews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Просмотры
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {products.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Товары
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Вкладки */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
              <Tab label="Последние товары" />
              <Tab label="Последние заказы" />
            </Tabs>
          </Box>

          {/* Вкладка товаров */}
          {tab === 0 && (
            <Paper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">
                  Последние товары
                </Typography>
                <Button
                  component={Link}
                  to="/dashboard/products"
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Добавить товар
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Название</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell>Продажи</TableCell>
                      <TableCell>Просмотры</TableCell>
                      <TableCell>Дата</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.slice(0, 10).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(product.status)}
                            color={getStatusColor(product.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                        </TableCell>
                        <TableCell>{product.sales_count}</TableCell>
                        <TableCell>{product.views_count}</TableCell>
                        <TableCell>
                          {format(new Date(product.created_at), 'dd.MM.yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          У вас пока нет товаров
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {products.length > 10 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button component={Link} to="/dashboard/products">
                    Показать все товары ({products.length})
                  </Button>
                </Box>
              )}
            </Paper>
          )}

          {/* Вкладка заказов */}
          {tab === 1 && (
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Последние заказы
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Заказ</TableCell>
                      <TableCell>Товар</TableCell>
                      <TableCell>Покупатель</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Дата</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id.substring(0, 8)}</TableCell>
                        <TableCell>{order.product?.name || '-'}</TableCell>
                        <TableCell>{order.buyer?.name || '-'}</TableCell>
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
              {orders.length > 10 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button component={Link} to="/dashboard/orders">
                    Показать все заказы ({orders.length})
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
