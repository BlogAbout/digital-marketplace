import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: number;
  loading?: boolean;
  index?: number;
}

export default function StatsCard({
                                    title,
                                    value,
                                    icon,
                                    color = 'primary.main',
                                    trend,
                                    loading = false,
                                    index = 0,
                                  }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: color,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Typography
              variant="caption"
              sx={{
                color: trend >= 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold',
              }}
            >
              {trend >= 0 ? '+' : ''}{trend}%
            </Typography>
          )}
        </Box>

        {loading ? (
          <CircularProgress size={32} />
        ) : (
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </Paper>
    </motion.div>
  );
}
