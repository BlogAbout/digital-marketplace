import {useEffect, useState} from 'react';
import {Alert, Box, Button, Card, Chip, CircularProgress, Container, Divider, Grid, Typography,} from '@mui/material';
import {useParams} from 'react-router-dom';
import {productService} from '../services/productService';
import type {Product} from '../types';

export default function ProductDetailPage() {
  const {slug} = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await productService.getProduct(slug);
      setProduct(data);
    } catch (error) {
      setError('Товар не найден');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress/>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert severity="error">{error || 'Товар не найден'}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h1" color="text.secondary">
              {product.name.charAt(0)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <Chip label={product.status} color="success" size="small"/>
            {product.is_free ? (
              <Chip label="Бесплатно" color="primary" size="small"/>
            ) : (
              <Chip label={`${product.cost} ${product.currency}`} color="primary" size="small"/>
            )}
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
            {product.cost_old && (
              <Typography
                component="span"
                variant="h6"
                color="text.secondary"
                sx={{textDecoration: 'line-through', ml: 2}}
              >
                {product.cost_old} {product.currency}
              </Typography>
            )}
          </Typography>

          <Divider sx={{my: 2}}/>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{display: 'flex', gap: 2, mb: 2}}>
            <Typography variant="body2" color="text.secondary">
              Просмотров: {product.views_count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Продаж: {product.sales_count}
            </Typography>
          </Box>

          <Button variant="contained" size="large" fullWidth>
            Купить
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
