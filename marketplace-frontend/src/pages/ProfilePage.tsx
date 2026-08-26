// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Stack,
  Avatar,
  Badge,
  IconButton,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { productService } from '../services/productService';
import { subscriptionService } from '../services/subscriptionService';
import type { Product } from '../types';
import { motion } from 'framer-motion';
import AnimatedTabs from '../components/AnimatedTabs';
import DataTable from '../components/DataTable';
import SkeletonLoader from '../components/SkeletonLoader';
import StatusBadge from '../components/StatusBadge';
import CountUp from '../components/CountUp';
import AvatarWithStatus from '../components/AvatarWithStatus';
import GradientButton from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';
import {
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { TextField } from '@mui/material';

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    slogan: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadProfileData();
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        slogan: user.slogan || '',
        description: user.description || '',
      });
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [productsResponse, followersResponse, followingResponse] = await Promise.all([
        productService.getProducts({ per_page: 100 }),
        subscriptionService.getFollowers(user.id),
        subscriptionService.getFollowing(user.id),
      ]);
      setProducts(productsResponse.data);
      setFollowers(followersResponse.data);
      setFollowing(followingResponse.data);
    } catch (error) {
      showToast('Ошибка при загрузке профиля', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await authService.updateProfile({
        ...formData,
        id: user!.id,
      });
      await fetchUser();
      setEditing(false);
      showToast('Профиль успешно обновлен', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Ошибка при обновлении', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SkeletonLoader type="profile" />
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const productColumns = [
    {
      key: 'name',
      label: 'Товар',
      sortable: true,
      render: (product: Product) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {product.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
        </Stack>
      ),
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
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (product: Product) => <StatusBadge status={product.status} />,
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

  const followerColumns = [
    {
      key: 'subscriber',
      label: 'Пользователь',
      render: (sub: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarWithStatus user={sub.subscriber} size={36} />
          <Typography variant="body2">
            {sub.subscriber?.name}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'created_at',
      label: 'Дата подписки',
      sortable: true,
      render: (sub: any) => (
        <Typography variant="body2">
          {new Date(sub.created_at).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const followingColumns = [
    {
      key: 'user',
      label: 'Пользователь',
      render: (sub: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarWithStatus user={sub.user} size={36} />
          <Typography variant="body2">
            {sub.user?.name}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'created_at',
      label: 'Дата подписки',
      sortable: true,
      render: (sub: any) => (
        <Typography variant="body2">
          {new Date(sub.created_at).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const tabs = [
    {
      label: `Товары (${products.length})`,
      content: (
        <DataTable
          columns={productColumns}
          data={products}
          emptyState={
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Нет товаров
              </Typography>
            </Box>
          }
        />
      ),
    },
    {
      label: `Подписчики (${followers.length})`,
      content: (
        <DataTable
          columns={followerColumns}
          data={followers}
          emptyState={
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Нет подписчиков
              </Typography>
            </Box>
          }
        />
      ),
    },
    {
      label: `Подписки (${following.length})`,
      content: (
        <DataTable
          columns={followingColumns}
          data={following}
          emptyState={
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Нет подписок
              </Typography>
            </Box>
          }
        />
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
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
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'white' }}
                  >
                    <CameraIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: 48,
                    fontWeight: 'bold',
                    border: '4px solid white',
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, color: 'white' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {user.name}
                </Typography>
                {user.slogan && (
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                    {user.slogan}
                  </Typography>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <CountUp end={products.length} variant="h5" fontWeight="bold" />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Товары
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <CountUp end={followers.length} variant="h5" fontWeight="bold" />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Подписчики
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <CountUp end={following.length} variant="h5" fontWeight="bold" />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Подписки
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <CountUp end={Number(user.balance || 0)} prefix="$" decimals={2} variant="h5" fontWeight="bold" />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Баланс
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                {!editing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    Редактировать
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <GradientButton onClick={handleSave} disabled={saving}>
                      Сохранить
                    </GradientButton>
                    <Button
                      variant="outlined"
                      onClick={() => setEditing(false)}
                      sx={{ color: 'white', borderColor: 'white' }}
                    >
                      Отмена
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Edit Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Paper sx={{ p: 4, mb: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Редактирование профиля
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Слоган"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      )}

      {/* Tabs */}
      <Paper sx={{ borderRadius: 4 }}>
        <AnimatedTabs tabs={tabs} />
      </Paper>
    </Container>
  );
}
