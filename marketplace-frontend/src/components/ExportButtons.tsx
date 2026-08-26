import { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportService } from '../services/exportService';

export default function ExportButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleExportProducts = async () => {
    try {
      setLoading('products');
      const blob = await exportService.exportProducts();
      await exportService.downloadFile(blob, `products_${Date.now()}.csv`);
      setSnackbar({ open: true, message: 'Товары успешно экспортированы', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при экспорте товаров', severity: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleExportOrders = async () => {
    try {
      setLoading('orders');
      const blob = await exportService.exportOrders();
      await exportService.downloadFile(blob, `orders_${Date.now()}.csv`);
      setSnackbar({ open: true, message: 'Заказы успешно экспортированы', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при экспорте заказов', severity: 'error' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleExportProducts}
        disabled={loading === 'products'}
      >
        {loading === 'products' ? 'Экспорт...' : 'Экспорт товаров'}
      </Button>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleExportOrders}
        disabled={loading === 'orders'}
      >
        {loading === 'orders' ? 'Экспорт...' : 'Экспорт заказов'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
