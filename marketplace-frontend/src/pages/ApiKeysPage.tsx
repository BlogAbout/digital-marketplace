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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { apiKeyService, type DeveloperApiKey } from '../services/apiKeyService';
import { format } from 'date-fns';

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">API ключи</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Создать ключ
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Ключ</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Лимит запросов</TableCell>
                <TableCell>Последнее использование</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {key.key.substring(0, 16)}...
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
                    />
                  </TableCell>
                  <TableCell>{key.rate_limit}/мин</TableCell>
                  <TableCell>
                    {key.last_used_at
                      ? format(new Date(key.last_used_at), 'dd.MM.yyyy HH:mm')
                      : 'Никогда'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteKey(key)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {keys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    У вас пока нет API ключей
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать API ключ</DialogTitle>
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
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateKey}>
            Создать
          </Button>
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
