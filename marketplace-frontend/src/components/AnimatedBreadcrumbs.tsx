import { Breadcrumbs, Link, Typography, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: React.ReactNode;
}

interface AnimatedBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function AnimatedBreadcrumbs({ items }: AnimatedBreadcrumbsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Главная
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return item.to && !isLast ? (
            <Link
              key={index}
              component={RouterLink}
              to={item.to}
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {item.icon && <Box sx={{ mr: 0.5 }}>{item.icon}</Box>}
              {item.label}
            </Link>
          ) : (
            <Typography
              key={index}
              color="text.primary"
              sx={{ display: 'flex', alignItems: 'center', fontWeight: 'medium' }}
            >
              {item.icon && <Box sx={{ mr: 0.5 }}>{item.icon}</Box>}
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </motion.div>
  );
}
