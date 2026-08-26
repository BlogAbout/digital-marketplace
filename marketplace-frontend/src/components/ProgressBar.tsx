import { Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
}

export default function ProgressBar({
                                      value,
                                      max = 100,
                                      label,
                                      color = 'primary',
                                      showPercentage = true,
                                    }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {percentage.toFixed(0)}%
            </Typography>
          )}
        </Box>
      )}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '100%' }}
        transition={{ duration: 0.5 }}
      >
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={color}
          sx={{ borderRadius: 5, height: 8 }}
        />
      </motion.div>
    </Box>
  );
}
