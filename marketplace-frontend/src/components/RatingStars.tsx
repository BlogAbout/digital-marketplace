import { Box, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function RatingStars({ value, onChange, readOnly = false, size = 'small' }: RatingStarsProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={value}
        onChange={(_, newValue) => onChange?.(newValue || 0)}
        readOnly={readOnly}
        size={size}
        icon={<StarIcon fontSize="inherit" sx={{ color: 'warning.main' }} />}
        emptyIcon={<StarIcon fontSize="inherit" sx={{ color: 'grey.300' }} />}
      />
      <Typography variant="body2" color="text.secondary">
        {value.toFixed(1)}
      </Typography>
    </Box>
  );
}
