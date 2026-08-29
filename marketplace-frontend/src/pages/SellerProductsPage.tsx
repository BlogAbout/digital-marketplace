// src/pages/SellerProductsPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { productService } from '../services/productService';
import type { Product, Category } from '../types';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import GradientButton from '../components/GradientButton';
import FloatingActionButton from '../components/FloatingActionButton';
import { useToast } from '../components/ToastProvider';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    currency: 'USD',
    cost: '',
    is_free: false,
  });
  const [error, setError] = useState('');
  const { showToast } = useToast();

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
      showToast('Ошибка при загрузке товаров', 'error');
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
        showToast('Товар успешно обновлен', 'success');
      } else {
        await productService.createProduct(formDataObj);
        showToast('Товар успешно создан', 'success');
      }

      setDialogOpen(false);
      loadProducts();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при сохранении товара');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      showToast('Товар успешно удален', 'success');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      showToast('Ошибка при удалении товара', 'error');
    }
  };

  const productColumns = [
    {
      key: 'name',
      label: 'Товар',
      sortable: true,
      render: (product: Product) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {product.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'category',
      label: 'Категория',
      render: (product: Product) => (
        <Typography variant="body2">
          {product.category?.name || '-'}
        </Typography>
      ),
    },
    {
      key: 'cost',
      label: 'Цена',
      sortable: true,
      render: (product: Product) => (
        <Typography variant="body2">
          {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (product: Product) => <StatusBadge status={product.status} />,
    },
    {
      key: 'sales_count',
      label: 'Продажи',
      align: 'right' as const,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Действия',
      align: 'right' as const,
      render: (product: Product) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Редактировать">
            <IconButton size="small" onClick={() => handleOpenDialog(product)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить">
            <IconButton
              size="small"
              onClick={() => {
                setProductToDelete(product);
                setDeleteDialogOpen(true);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Мои товары"
        subtitle="Управление вашими товарами"
        icon={<ShoppingCartIcon />}
        actions={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Добавить товар
          </GradientButton>
        }
      />

      {loading ? (
        <SkeletonLoader type="table" count={6} />
      ) : products.length > 0 ? (
        <DataTable
          columns={productColumns}
          data={products}
          emptyState={
            <EnhancedEmptyState
              icon={<ShoppingCartIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
              title="Нет товаров"
              description="Создайте свой первый товар"
              primaryAction={{
                label: 'Добавить товар',
                onClick: () => handleOpenDialog(),
                icon: <AddIcon />,
              }}
            />
          }
        />
      ) : (
        <EnhancedEmptyState
          icon={<ShoppingCartIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
          title="Нет товаров"
          description="Создайте свой первый товар для продажи"
          primaryAction={{
            label: 'Добавить товар',
            onClick: () => handleOpenDialog(),
            icon: <AddIcon />,
          }}
        />
      )}

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        maxWidth="md"
        actions={
          <>
            <button onClick={() => setDialogOpen(false)} className="btn btn-outline">
              Отмена
            </button>
            <GradientButton onClick={handleSaveProduct}>
              Сохранить
            </GradientButton>
          </>
        }
      >
        <Box sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
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
        </Box>
      </Modal>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Удалить товар"
        message={`Вы уверены, что хотите удалить товар "${productToDelete?.name}"?`}
        type="warning"
        confirmLabel="Да, удалить"
        cancelLabel="Отмена"
        onConfirm={handleDeleteProduct}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
      />

      <FloatingActionButton
        onClick={() => handleOpenDialog()}
        tooltip="Добавить товар"
      />
    </Container>
  );
}
