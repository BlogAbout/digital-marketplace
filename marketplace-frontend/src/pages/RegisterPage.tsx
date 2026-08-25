import {useState} from 'react';
import {Alert, Box, Button, Container, Link, Paper, TextField, Typography,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../stores/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const {register, isLoading} = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
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
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Paper elevation={3} sx={{p: 4, width: '100%'}}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Регистрация
          </Typography>

          {error && (
            <Alert severity="error" sx={{mb: 2}}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Подтверждение пароля"
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            <Box sx={{textAlign: 'center'}}>
              <Link href="/login" variant="body2">
                Уже есть аккаунт? Войдите
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
