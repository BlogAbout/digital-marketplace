import {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {Link} from 'react-router-dom';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  BarChart as BarChartIcon,
  Dashboard as DashboardIcon,
  Gavel as GavelIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {useAuthStore} from '../stores/authStore';
import {productService} from '../services/productService';
import {orderService} from '../services/orderService';
import type {Order, Product} from '../types';
import {motion} from 'framer-motion';
import StatsCard from '../components/StatsCard';
import GradientButton from '../components/GradientButton';

export default function DashboardPage() {
  const {user} = useAuthStore();
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
        productService.getProducts({per_page: 100}),
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
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
        <CircularProgress size={48}/>
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

  return (
    <Container maxWidth="xl" sx={{py: 4}}>
      {/* Welcome Section */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
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
          <Box
            sx={{
              position: 'absolute',
              bottom: -75,
              right: 75,
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
          />
          <Box sx={{position: 'relative', zIndex: 1}}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Добро пожаловать, {user?.name}!
            </Typography>
            <Typography variant="body1" sx={{mb: 3, opacity: 0.9}}>
              Управляйте своими товарами, отслеживайте продажи и развивайте бизнес
            </Typography>
            <GradientButton
              component={Link}
              to="/dashboard/products"
              startIcon={<AddIcon/>}
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{mb: 4}}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Продажи"
            value={totalSales}
            icon={<ShoppingCartIcon/>}
            color="#10B981"
            trend={12}
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Доход"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<MoneyIcon/>}
            color="#6366F1"
            trend={8}
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Просмотры"
            value={totalViews}
            icon={<VisibilityIcon/>}
            color="#F59E0B"
            trend={-3}
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Товары"
            value={products.length}
            icon={<DashboardIcon/>}
            color="#8B5CF6"
            index={3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{p: 2, borderRadius: 4}}>
            <Typography variant="h6" fontWeight="bold" sx={{px: 2, py: 1}}>
              Навигация
            </Typography>
            <List>
              <ListItem component={Link} to="/dashboard" sx={{borderRadius: 3, mb: 0.5}}>
                <ListItemIcon>
                  <DashboardIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Обзор"/>
              </ListItem>
              <ListItem component={Link} to="/dashboard/products" sx={{borderRadius: 3, mb: 0.5}}>
                <ListItemIcon>
                  <ShoppingCartIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Мои товары"/>
              </ListItem>
              <ListItem component={Link} to="/dashboard/orders" sx={{borderRadius: 3, mb: 0.5}}>
                <ListItemIcon>
                  <ReceiptIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Заказы"/>
              </ListItem>
              <ListItem component={Link} to="/dashboard/statistics" sx={{borderRadius: 3, mb: 0.5}}>
                <ListItemIcon>
                  <BarChartIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Статистика"/>
              </ListItem>
              <ListItem component={Link} to="/dashboard/disputes" sx={{borderRadius: 3}}>
                <ListItemIcon>
                  <GavelIcon color="primary"/>
                </ListItemIcon>
                <ListItemText primary="Споры"/>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Products */}
        <Grid item xs={12} md={9}>
          <Paper sx={{p: 3, borderRadius: 4}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
              <Typography variant="h6" fontWeight="bold">
                Последние товары
              </Typography>
              <Button component={Link} to="/dashboard/products">
                Показать все
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell align="right">Продажи</TableCell>
                    <TableCell align="right">Просмотры</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.slice(0, 5).map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{bgcolor: 'primary.main', width: 40, height: 40}}>
                            {product.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          size="small"
                          color={
                            product.status === 'approved' ? 'success' :
                              product.status === 'pending' ? 'warning' : 'default'
                          }
                          sx={{borderRadius: 6}}
                        />
                      </TableCell>
                      <TableCell>
                        {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                      </TableCell>
                      <TableCell align="right">{product.sales_count}</TableCell>
                      <TableCell align="right">{product.views_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
