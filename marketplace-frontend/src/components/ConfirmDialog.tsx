import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'error';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
                                        open,
                                        title,
                                        message,
                                        type = 'warning',
                                        confirmLabel = 'Подтвердить',
                                        cancelLabel = 'Отмена',
                                        onConfirm,
                                        onCancel,
                                        loading = false,
                                      }: ConfirmDialogProps) {
  const icons = {
    warning: <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    info: <InfoIcon sx={{ fontSize: 48, color: 'info.main' }} />,
    error: <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />,
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: { borderRadius: 16 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Box sx={{ mb: 2 }}>{icons[type]}</Box>
        </motion.div>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" align="center">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
        <Button onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={type === 'error' ? 'error' : 'primary'}
          disabled={loading}
        >
          {loading ? 'Обработка...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
