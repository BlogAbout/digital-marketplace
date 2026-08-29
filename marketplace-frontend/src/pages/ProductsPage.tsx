// src/pages/ProductsPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import { productService } from '../services/productService';
import type { Product, Category } from '../types';
import { useSearchParams } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, categoryId, search]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        page,
        per_page: 12,
        category_id: categoryId || undefined,
        search: search || undefined,
      });
      setProducts(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const handleSearchChange = (search: string) => {
    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const handleClearFilters = () => {
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 'bold' }} gutterBottom>
          Каталог товаров
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Найдите идеальный цифровой продукт для ваших нужд
        </Typography>
      </motion.div>

      <FilterBar
        searchPlaceholder="Поиск товаров..."
        searchValue={search}
        onSearchChange={handleSearchChange}
        filters={[
          {
            label: 'Категория',
            value: categoryId,
            onChange: handleCategoryChange,
            options: categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            })),
          },
        ]}
        onClear={handleClearFilters}
      />

      {loading ? (
        <SkeletonLoader type="card" count={8} />
      ) : products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} index={index} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EnhancedEmptyState
          icon={<ShoppingBagIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
          title="Товары не найдены"
          description="Попробуйте изменить параметры поиска или выберите другую категорию"
          primaryAction={{
            label: 'Сбросить фильтры',
            onClick: handleClearFilters,
          }}
        />
      )}

      {totalPages > 1 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
