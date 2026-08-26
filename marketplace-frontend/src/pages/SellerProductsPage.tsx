import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { productService } from '../services/productService';
import type { Product, Category } from '../types';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    currency: 'USD',
    cost: '',
    is_free: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ per_page: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category_id: product.category?.id || '',
        currency: product.currency,
        cost: product.cost?.toString() || '',
        is_free: product.is_free,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category_id: '',
        currency: 'USD',
        cost: '',
        is_free: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSaveProduct = async () => {
    try {
      setError('');
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('category_id', formData.category_id);
      formDataObj.append('currency', formData.currency);
      formDataObj.append('is_free', formData.is_free ? '1' : '0');

      if (!formData.is_free && formData.cost) {
        formDataObj.append('cost', formData.cost);
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formDataObj);
      } else {
        await productService.createProduct(formDataObj);
      }

      handleCloseDialog();
      loadProducts();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при сохранении товара');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Мои товары</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить товар
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Продажи</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name || '-'}</TableCell>
                <TableCell>
                  {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.status}
                    color={
                      product.status === 'approved' ? 'success' :
                        product.status === 'pending' ? 'warning' :
                          product.status === 'rejected' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{product.sales_count}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  У вас пока нет товаров
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Название"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Категория</InputLabel>
            <Select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              label="Категория"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Валюта</InputLabel>
            <Select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              label="Валюта"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="RUB">RUB</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Тип товара</InputLabel>
            <Select
              value={formData.is_free ? 'free' : 'paid'}
              onChange={(e) => setFormData({ ...formData, is_free: e.target.value === 'free' })}
              label="Тип товара"
            >
              <MenuItem value="paid">Платный</MenuItem>
              <MenuItem value="free">Бесплатный</MenuItem>
            </Select>
          </FormControl>
          {!formData.is_free && (
            <TextField
              fullWidth
              label="Цена"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              margin="normal"
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
