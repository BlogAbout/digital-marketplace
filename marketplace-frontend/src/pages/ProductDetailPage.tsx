import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {productService} from '../services/productService';
import {orderService} from '../services/orderService';
import {useAuthStore} from '../stores/authStore';
import type {Product} from '../types';

export default function ProductDetailPage() {
  const {slug} = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success' as 'success' | 'error'});

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await productService.getProduct(slug);
      setProduct(data);
    } catch (error) {
      setError('Товар не найден');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBuyDialogOpen(true);
  };

  const handlePurchase = async () => {
    if (!product || !user) return;

    try {
      setPurchasing(true);
      const order = await orderService.createOrder({
        product_id: product.id,
        domain: product.is_link_domain ? domain : undefined,
        promo_code: promoCode || undefined,
      });

      setBuyDialogOpen(false);
      setSnackbar({
        open: true,
        message: product.is_free ? 'Товар успешно получен!' : 'Заказ успешно создан!',
        severity: 'success',
      });

      if (!product.is_free) {
        // Если товар платный, перенаправляем на оплату
        await orderService.payOrder(order.id);
        setSnackbar({
          open: true,
          message: 'Заказ успешно оплачен!',
          severity: 'success',
        });
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Ошибка при оформлении заказа',
        severity: 'error',
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress/>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert severity="error">{error || 'Товар не найден'}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url || ''}
                alt={product.name}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <Typography variant="h1" color="text.secondary">
                {product.name.charAt(0)}
              </Typography>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <Chip label={product.status} color="success" size="small"/>
            {product.is_free ? (
              <Chip label="Бесплатно" color="primary" size="small"/>
            ) : (
              <Chip label={`${product.cost} ${product.currency}`} color="primary" size="small"/>
            )}
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
            {product.cost_old && (
              <Typography
                component="span"
                variant="h6"
                color="text.secondary"
                sx={{textDecoration: 'line-through', ml: 2}}
              >
                {product.cost_old} {product.currency}
              </Typography>
            )}
          </Typography>

          <Divider sx={{my: 2}}/>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{display: 'flex', gap: 2, mb: 2}}>
            <Typography variant="body2" color="text.secondary">
              Просмотров: {product.views_count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Продаж: {product.sales_count}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleBuy}
          >
            {product.is_free ? 'Получить бесплатно' : 'Купить'}
          </Button>
        </Grid>
      </Grid>

      {/* Диалог покупки */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)}>
        <DialogTitle>Оформление заказа</DialogTitle>
        <DialogContent>
          {product.is_link_domain && (
            <TextField
              fullWidth
              label="Домен"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              margin="normal"
              required
              helperText="Укажите домен для привязки лицензии"
            />
          )}
          <TextField
            fullWidth
            label="Промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={purchasing}
          >
            {purchasing ? 'Обработка...' : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({...snackbar, open: false})}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
