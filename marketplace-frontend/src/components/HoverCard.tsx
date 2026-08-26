import { Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface HoverCardProps {
  children: ReactNode;
  onClick?: () => void;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'border';
}

export default function HoverCard({
                                    children,
                                    onClick,
                                    hoverEffect = 'lift',
                                  }: HoverCardProps) {
  const effects = {
    lift: {
      whileHover: { y: -4 },
      transition: { duration: 0.2 },
    },
    scale: {
      whileHover: { scale: 1.02 },
      transition: { duration: 0.2 },
    },
    glow: {
      whileHover: {
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      transition: { duration: 0.2 },
    },
    border: {
      whileHover: {
        borderColor: 'primary.main',
      },
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...effects[hoverEffect]}
    >
      <Card sx={{ height: '100%', borderRadius: 4 }}>
        {children}
      </Card>
    </motion.div>
  );
}
