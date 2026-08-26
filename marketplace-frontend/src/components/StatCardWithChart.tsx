import {Box, Paper, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import {Area, AreaChart, ResponsiveContainer} from 'recharts';
import type {ReactNode} from 'react';

interface StatCardWithChartProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  data: Array<{ value: number }>;
  trend?: number;
}

export default function StatCardWithChart({
                                            title,
                                            value,
                                            icon,
                                            color,
                                            data,
                                            trend,
                                          }: StatCardWithChartProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
    >
      <Paper sx={{p: 2, borderRadius: 4, position: 'relative', overflow: 'hidden'}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2}}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
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
          <Box
            sx={{
              width: 40,
              height: 40,
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
        </Box>

        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${color})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </motion.div>
  );
}
