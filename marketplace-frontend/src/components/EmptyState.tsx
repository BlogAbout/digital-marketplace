import { Box, Typography, Button, Paper } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
                                     title = 'Нет данных',
                                     description = 'Здесь пока пусто',
                                     actionLabel,
                                     onAction,
                                     icon,
                                   }: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>
        {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}
