import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import GradientButton from '../components/GradientButton';

const steps = ['Аккаунт', 'Профиль', 'Готово'];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await register(form);
      setActiveStep(2);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 6,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Создайте аккаунт
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Присоединяйтесь к тысячам пользователей
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
                <TextField
                  fullWidth
                  label="Имя"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Телефон (необязательно)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Подтверждение пароля"
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Роль</InputLabel>
                  <Select
                    name="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    label="Роль"
                  >
                    <MenuItem value="user">Покупатель</MenuItem>
                    <MenuItem value="seller">Продавец</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Typography variant="h3" sx={{ color: 'white' }}>
                      ✓
                    </Typography>
                  </Box>
                </motion.div>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Регистрация завершена!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Перенаправление на главную страницу...
                </Typography>
              </Box>
            )}

            {activeStep < 2 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {activeStep > 0 && (
                  <Button onClick={handleBack} variant="outlined">
                    Назад
                  </Button>
                )}
                {activeStep < 1 ? (
                  <GradientButton
                    fullWidth
                    size="large"
                    onClick={handleNext}
                  >
                    Далее
                  </GradientButton>
                ) : (
                  <GradientButton
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </GradientButton>
                )}
              </Box>
            )}
          </Box>

          {activeStep === 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?{' '}
                <Link component={RouterLink} to="/login" fontWeight="bold">
                  Войдите
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
