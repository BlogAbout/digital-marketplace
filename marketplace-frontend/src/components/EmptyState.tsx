import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 6,
          bgcolor: 'background.paper',
        }}
      >
        {icon && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Paper>
    </motion.div>
  );
}
