import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="О нас"
        subtitle="Узнайте больше о нашей платформе"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 6, borderRadius: 6, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Мы создали платформу для покупки и продажи цифровых товаров,
            чтобы помочь разработчикам, дизайнерам и предпринимателям
            находить друг друга и расти вместе.
          </Typography>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Пользователей"
            value="1000+"
            icon={<PeopleIcon />}
            color="#6366F1"
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Товаров"
            value="5000+"
            icon={<ShoppingCartIcon />}
            color="#8B5CF6"
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Отзывов"
            value="10000+"
            icon={<StarIcon />}
            color="#F59E0B"
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Безопасность"
            value="100%"
            icon={<SecurityIcon />}
            color="#10B981"
            index={3}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
