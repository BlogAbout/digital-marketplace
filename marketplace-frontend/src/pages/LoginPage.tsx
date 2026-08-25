import {useState} from 'react';
import {Alert, Box, Button, Container, Link, Paper, TextField, Typography,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login, isLoading} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Paper elevation={3} sx={{p: 4, width: '100%'}}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Вход в систему
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
            <Box sx={{textAlign: 'center'}}>
              <Link href="/register" variant="body2">
                Нет аккаунта? Зарегистрируйтесь
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
