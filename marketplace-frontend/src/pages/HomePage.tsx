import {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Typography,} from '@mui/material';
import {Link} from 'react-router-dom';
import {productService} from '../services/productService';
import type {Product} from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({per_page: 8});
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{textAlign: 'center', mb: 6}}>
        <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
          Добро пожаловать в Marketplace
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Платформа для продажи цифровых товаров
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom sx={{mb: 3}}>
        Популярные товары
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" color="text.secondary">
                  {product.name.charAt(0)}
                </Typography>
              </CardMedia>
              <CardContent sx={{flexGrow: 1}}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                  {product.description?.substring(0, 100)}...
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                </Typography>
              </CardContent>
              <Box sx={{p: 2}}>
                <Button
                  component={Link}
                  to={`/products/${product.id}`}
                  variant="contained"
                  fullWidth
                >
                  Подробнее
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
