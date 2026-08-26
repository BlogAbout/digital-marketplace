import { Card, CardContent, CardMedia, Typography, Box, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        component={Link}
        to={`/products/${product.id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            '& .product-image': {
              transform: 'scale(1.05)',
            },
            '& .product-overlay': {
              opacity: 1,
            },
          },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="div"
            className="product-image"
            sx={{
              height: 200,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <Typography variant="h1" color="text.secondary" sx={{ fontSize: 80 }}>
              {product.name.charAt(0)}
            </Typography>
          </CardMedia>

          {/* Overlay */}
          <Box
            className="product-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Быстрый просмотр
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label={product.status === 'approved' ? 'Доступен' : product.status}
              size="small"
              color={product.status === 'approved' ? 'success' : 'default'}
              sx={{ borderRadius: 6 }}
            />
            {product.is_free && (
              <Chip
                label="Бесплатно"
                size="small"
                color="primary"
                sx={{ borderRadius: 6 }}
              />
            )}
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {product.is_free ? 'Бесплатно' : formatCurrency(Number(product.cost), product.currency)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {product.views_count}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShoppingCartIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {product.sales_count}
                </Typography>
              </Box>
            </Box>
          </Box>

          {product.author && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {product.author.name?.charAt(0)}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {product.author.name}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
