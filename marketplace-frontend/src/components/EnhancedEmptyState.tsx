import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface EnhancedEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  image?: string;
}

export default function EnhancedEmptyState({
                                             icon,
                                             title,
                                             description,
                                             primaryAction,
                                             secondaryAction,
                                             image,
                                           }: EnhancedEmptyStateProps) {
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.05,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -75,
            right: -75,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            opacity: 0.05,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {image ? (
            <img
              src={image}
              alt={title}
              style={{ maxWidth: 200, marginBottom: 24 }}
            />
          ) : (
            icon && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  {icon}
                </Box>
              </motion.div>
            )
          )}

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
            >
              {description}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            {primaryAction && (
              <Button
                variant="contained"
                onClick={primaryAction.onClick}
                startIcon={primaryAction.icon}
                sx={{ borderRadius: 3 }}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outlined"
                onClick={secondaryAction.onClick}
                startIcon={secondaryAction.icon}
                sx={{ borderRadius: 3 }}
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}
