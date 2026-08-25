import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Профиль
      </Typography>
      <Paper sx={{ p: 4 }}>
        {user ? (
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography color="text.secondary">Баланс: {user.balance}</Typography>
          </Box>
        ) : (
          <Typography>Пользователь не найден</Typography>
        )}
      </Paper>
    </Container>
  );
}
