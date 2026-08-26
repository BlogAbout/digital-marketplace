import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmDialog({
                                        open,
                                        title,
                                        message,
                                        confirmLabel = 'Подтвердить',
                                        cancelLabel = 'Отмена',
                                        onConfirm,
                                        onCancel,
                                        loading = false,
                                        danger = false,
                                      }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={danger ? 'error' : 'primary'}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Обработка...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
