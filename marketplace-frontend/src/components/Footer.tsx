import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 6,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Marketplace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Платформа для продажи цифровых товаров. Покупайте и продавайте с удовольствием.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <GitHubIcon />
              </IconButton>
              <IconButton size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small">
                <TelegramIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Покупателям
            </Typography>
            <Link href="/products" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Каталог товаров
            </Link>
            <Link href="/blog" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Блог
            </Link>
            <Link href="/support" color="text.secondary" display="block">
              Поддержка
            </Link>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Продавцам
            </Typography>
            <Link href="/dashboard" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Дашборд
            </Link>
            <Link href="/dashboard/products" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Мои товары
            </Link>
            <Link href="/dashboard/statistics" color="text.secondary" display="block">
              Статистика
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              О компании
            </Typography>
            <Link href="/about" color="text.secondary" display="block" sx={{ mb: 1 }}>
              О нас
            </Link>
            <Link href="/terms" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Условия использования
            </Link>
            <Link href="/privacy" color="text.secondary" display="block">
              Политика конфиденциальности
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © 2026 Marketplace. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
}
