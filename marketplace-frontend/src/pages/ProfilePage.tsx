import {useEffect, useState} from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {useAuthStore} from '../stores/authStore';
import {productService} from '../services/productService';
import {subscriptionService} from '../services/subscriptionService';
import type {Product} from '../types';
import {format} from 'date-fns';
import {motion} from 'framer-motion';
import {
  CameraAlt as CameraIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import {authService} from "../services/authService.ts";

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
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh'}}>
        <CircularProgress size={48}/>
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
    <Container maxWidth="lg" sx={{py: 4}}>
      {/* Profile Header */}
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
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <Box sx={{position: 'relative', zIndex: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap'}}>
              <Badge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      '&:hover': {bgcolor: 'grey.100'},
                    }}
                  >
                    <CameraIcon fontSize="small"/>
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

              <Box sx={{flex: 1, color: 'white'}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                  <Typography variant="h4" fontWeight="bold">
                    {user.name}
                  </Typography>
                  {user.role === 'admin' && (
                    <Tooltip title="Администратор">
                      <VerifiedIcon sx={{color: '#FFD700'}}/>
                    </Tooltip>
                  )}
                </Box>
                {user.slogan && (
                  <Typography variant="h6" sx={{opacity: 0.9, mb: 2}}>
                    {user.slogan}
                  </Typography>
                )}
                <Box sx={{display: 'flex', gap: 4}}>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {products.length}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.8}}>
                      Товары
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {followers.length}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.8}}>
                      Подписчики
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {following.length}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.8}}>
                      Подписки
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      ${Number(user.balance || 0).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.8}}>
                      Баланс
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                {!editing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon/>}
                    onClick={() => setEditing(true)}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Редактировать
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon/>}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{
                        bgcolor: 'success.main',
                        '&:hover': {
                          bgcolor: 'success.dark',
                        },
                      }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon/>}
                      onClick={() => setEditing(false)}
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'grey.100',
                        },
                      }}
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
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.3}}
        >
          <Paper sx={{p: 4, mb: 4, borderRadius: 4}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Редактирование профиля
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{mr: 1, color: 'text.secondary'}}/>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{mr: 1, color: 'text.secondary'}}/>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{mr: 1, color: 'text.secondary'}}/>,
                  }}
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
                  InputProps={{
                    startAdornment: <DescriptionIcon sx={{mr: 1, color: 'text.secondary'}}/>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      )}

      {/* Tabs */}
      <Paper sx={{borderRadius: 4}}>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{px: 2, borderBottom: 1, borderColor: 'divider'}}
        >
          <Tab label={`Товары (${products.length})`}/>
          <Tab label={`Подписчики (${followers.length})`}/>
          <Tab label={`Подписки (${following.length})`}/>
        </Tabs>

        {tab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Товар</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Продажи</TableCell>
                  <TableCell align="right">Просмотры</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{bgcolor: 'primary.main'}}>
                          {product.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {product.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
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
                    <TableCell align="right">{product.sales_count}</TableCell>
                    <TableCell align="right">{product.views_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Дата подписки</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {followers.map((sub) => (
                  <TableRow key={sub.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{bgcolor: 'secondary.main'}}>
                          {sub.subscriber?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {sub.subscriber?.name}
                        </Typography>
                      </Stack>
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Дата подписки</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {following.map((sub) => (
                  <TableRow key={sub.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{bgcolor: 'primary.main'}}>
                          {sub.user?.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {sub.user?.name}
                        </Typography>
                      </Stack>
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
      </Paper>
    </Container>
  );
}
