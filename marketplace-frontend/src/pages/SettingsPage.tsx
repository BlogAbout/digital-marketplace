import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import PushNotificationToggle from '../components/PushNotificationToggle';
import ExportButtons from '../components/ExportButtons';
import { useThemeStore } from '../stores/themeStore';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Внешний вид
        </Typography>
        <Box>
          <Typography variant="body1">
            Тема: {theme === 'light' ? 'Светлая' : 'Темная'}
          </Typography>
          <Button onClick={toggleTheme} variant="outlined" sx={{ mt: 1 }}>
            Переключить тему
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Уведомления
        </Typography>
        <PushNotificationToggle />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Экспорт данных
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Скачайте ваши данные в формате CSV
        </Typography>
        <ExportButtons />
      </Paper>
    </Container>
  );
}
