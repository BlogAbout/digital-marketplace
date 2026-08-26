import { Button, type ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#FFFFFF',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
  },
}));

export default GradientButton;
