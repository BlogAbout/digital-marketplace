import { Chip, type ChipProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryChipProps extends ChipProps {
  category: Category;
  index?: number;
}

export default function CategoryChip({ category, index = 0, ...props }: CategoryChipProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Chip
        label={category.name}
        onClick={() => navigate(`/products?category=${category.id}`)}
        sx={{
          borderRadius: 10,
          px: 1,
          py: 2,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          cursor: 'pointer',
        }}
        {...props}
      />
    </motion.div>
  );
}
