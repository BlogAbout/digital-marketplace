import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import { apiKeyService, type DeveloperApiKey } from '../services/apiKeyService';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import GradientButton from '../components/GradientButton';
import EmptyState from '../components/EmptyState';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<DeveloperApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
    rate_limit: 60,
    expires_at: '',
  });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const data = await apiKeyService.getKeys();
      setKeys(data);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      setError('');
      const key = await apiKeyService.createKey(formData);
      setDialogOpen(false);
      setFormData({ name: '', permissions: [], rate_limit: 60, expires_at: '' });
      loadKeys();
      setSnackbar({
        open: true,
        message: 'API ключ успешно создан. Скопируйте его сейчас!',
        severity: 'success',
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при создании API ключа');
    }
  };

  const handleDeleteKey = async (key: DeveloperApiKey) => {
    if (window.confirm(`Вы уверены, что хотите удалить ключ "${key.name}"?`)) {
      try {
        await apiKeyService.deleteKey(key.id);
        loadKeys();
        setSnackbar({
          open: true,
          message: 'API ключ успешно удален',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Ошибка при удалении API ключа',
          severity: 'error',
        });
      }
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSnackbar({
      open: true,
      message: 'Ключ скопирован в буфер обмена',
      severity: 'success',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="API ключи"
        subtitle="Управление ключами для доступа к API"
        icon={<KeyIcon />}
        actions={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Создать ключ
          </GradientButton>
        }
      />

      {keys.length > 0 ? (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ключ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Лимит</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Последнее использование</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key, index) => (
                  <motion.tr
                    key={key.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    style={{ display: 'table-row' }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                          <KeyIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {key.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace">
                          {key.key.substring(0, 20)}...
                        </Typography>
                        <Tooltip title="Скопировать">
                          <IconButton size="small" onClick={() => handleCopyKey(key.key)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={key.is_active ? 'Активен' : 'Неактивен'}
                        color={key.is_active ? 'success' : 'default'}
                        size="small"
                        sx={{ borderRadius: 6 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {key.rate_limit}/мин
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {key.last_used_at
                        ? format(new Date(key.last_used_at), 'dd.MM.yyyy HH:mm')
                        : 'Никогда'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Удалить">
                        <IconButton onClick={() => handleDeleteKey(key)} color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <EmptyState
          icon={<KeyIcon sx={{ fontSize: 80, color: 'text.secondary' }} />}
          title="Нет API ключей"
          description="Создайте ключ для доступа к API"
          actionLabel="Создать ключ"
          onAction={() => setDialogOpen(true)}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Создать API ключ
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
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
            helperText="Например: Мой бот, Интеграция с CRM и т.д."
          />
          <TextField
            fullWidth
            label="Лимит запросов в минуту"
            type="number"
            value={formData.rate_limit}
            onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
            margin="normal"
            inputProps={{ min: 1, max: 1000 }}
          />
          <TextField
            fullWidth
            label="Срок действия"
            type="datetime-local"
            value={formData.expires_at}
            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Отмена
          </Button>
          <GradientButton onClick={handleCreateKey}>
            Создать
          </GradientButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
