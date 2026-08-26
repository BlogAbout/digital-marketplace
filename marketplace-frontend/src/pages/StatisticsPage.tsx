import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { statisticsService } from '../services/statisticsService';
import type { SellerStatistics } from '../types';

export default function StatisticsPage() {
  const { user } = useAuthStore();
  const [statistics, setStatistics] = useState<SellerStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getSellerStatistics();
      setStatistics(data);
    } catch (error) {
      setError('Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !statistics) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Статистика
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {statistics.total_revenue.toFixed(2)}
            </Typography>
            <Typography color="text.secondary">Общий доход</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {statistics.total_sales}
            </Typography>
            <Typography color="text.secondary">Продажи</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {statistics.total_views}
            </Typography>
            <Typography color="text.secondary">Просмотры</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {statistics.conversion_rate}%
            </Typography>
            <Typography color="text.secondary">Конверсия</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Топ товаров
        </Typography>
        {statistics.top_products.map((product, index) => (
          <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography>
              {index + 1}. {product.name}
            </Typography>
            <Typography color="text.secondary">
              {product.sales_count} продаж
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
}
