import {useEffect, useState} from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useAuthStore} from '../stores/authStore';
import {productService} from '../services/productService';
import {subscriptionService} from '../services/subscriptionService';
import type {Product} from '../types';
import {format} from 'date-fns';

export default function ProfilePage() {
  const {user, fetchUser} = useAuthStore();
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
  const [message, setMessage] = useState('');

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
        productService.getProducts({per_page: 100}),
        subscriptionService.getFollowers(user.id),
        subscriptionService.getFollowing(user.id),
      ]);
      setProducts(productsResponse.data);
      setFollowers(followersResponse.data);
      setFollowing(followingResponse.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const response = await authService.updateProfile({
        ...formData,
        id: user!.id,
      });
      await fetchUser();
      setEditing(false);
      setMessage('Профиль успешно обновлен');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress/>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Пользователь не найден</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{p: 4, mb: 4}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 4}}>
          <Avatar
            sx={{width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40}}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box sx={{flex: 1}}>
            <Typography variant="h4">{user.name}</Typography>
            {user.slogan && (
              <Typography variant="h6" color="text.secondary">
                {user.slogan}
              </Typography>
            )}
            <Box sx={{display: 'flex', gap: 3, mt: 2}}>
              <Box>
                <Typography variant="h6">{products.length}</Typography>
                <Typography color="text.secondary">Товары</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{followers.length}</Typography>
                <Typography color="text.secondary">Подписчики</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{following.length}</Typography>
                <Typography color="text.secondary">Подписки</Typography>
              </Box>
            </Box>
          </Box>
          <Button variant="outlined" onClick={() => setEditing(!editing)}>
            {editing ? 'Отменить' : 'Редактировать'}
          </Button>
        </Box>

        {message && (
          <Alert severity="success" sx={{mt: 2}}>
            {message}
          </Alert>
        )}

        {editing && (
          <Box sx={{mt: 4}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Слоган"
                  value={formData.slogan}
                  onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{mt: 2}}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Box>
        )}
      </Paper>

      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 3}}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Товары"/>
          <Tab label="Подписчики"/>
          <Tab label="Подписки"/>
        </Tabs>
      </Box>

      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Продажи</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                  </TableCell>
                  <TableCell>
                    <Chip label={product.status} size="small"/>
                  </TableCell>
                  <TableCell>{product.sales_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пользователь</TableCell>
                <TableCell>Дата подписки</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {followers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                      <Avatar sx={{width: 32, height: 32}}>
                        {sub.subscriber?.name?.charAt(0)}
                      </Avatar>
                      {sub.subscriber?.name || 'Пользователь'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), 'dd.MM.yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пользователь</TableCell>
                <TableCell>Дата подписки</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {following.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                      <Avatar sx={{width: 32, height: 32}}>
                        {sub.user?.name?.charAt(0)}
                      </Avatar>
                      {sub.user?.name || 'Пользователь'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), 'dd.MM.yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
