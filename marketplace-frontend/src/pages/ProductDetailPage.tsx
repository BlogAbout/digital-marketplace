import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Stack,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../stores/authStore';
import type { Product } from '../types';
import { motion } from 'framer-motion';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Verified as VerifiedIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import GradientButton from '../components/GradientButton';
import RatingStars from '../components/RatingStars';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: 'Ссылка скопирована в буфер обмена',
        severity: 'success',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url || ''}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="h1" color="text.secondary" sx={{ fontSize: 120 }}>
                  {product.name.charAt(0)}
                </Typography>
              )}

              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Tooltip title="В избранное">
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{ bgcolor: 'white' }}
                  >
                    {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Поделиться">
                  <IconButton onClick={handleShare} sx={{ bgcolor: 'white' }}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={product.status === 'approved' ? 'Доступен' : product.status}
                color={product.status === 'approved' ? 'success' : 'default'}
                size="small"
                sx={{ borderRadius: 6 }}
              />
              {product.is_free && (
                <Chip
                  label="Бесплатно"
                  color="primary"
                  size="small"
                  sx={{ borderRadius: 6 }}
                />
              )}
              {product.author?.role === 'admin' && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Проверенный продавец"
                  color="info"
                  size="small"
                  sx={{ borderRadius: 6 }}
                />
              )}
            </Box>

            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <RatingStars value={4.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                (120 отзывов)
              </Typography>
            </Box>

            <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
              {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
              {product.cost_old && (
                <Typography
                  component="span"
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', ml: 2 }}
                >
                  {product.cost_old} {product.currency}
                </Typography>
              )}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {product.views_count} просмотров
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DownloadIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {product.sales_count} продаж
                </Typography>
              </Box>
            </Box>

            {product.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {product.author.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {product.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Продавец
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to={`/profile/${product.author.id}`}
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  Профиль
                </Button>
              </Box>
            )}

            <GradientButton
              fullWidth
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleBuy}
            >
              {product.is_free ? 'Получить бесплатно' : 'Купить сейчас'}
            </GradientButton>
          </Grid>
        </Grid>
      </motion.div>

      {/* Purchase Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Оформление заказа
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
            </Typography>
          </Box>

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
            helperText="Если у вас есть промокод, введите его"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBuyDialogOpen(false)}>
            Отмена
          </Button>
          <GradientButton
            onClick={handlePurchase}
            disabled={purchasing}
          >
            {purchasing ? 'Обработка...' : 'Подтвердить'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
