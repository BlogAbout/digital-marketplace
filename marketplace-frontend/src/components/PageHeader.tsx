import { Box, Typography, Button, Stack, Breadcrumbs, Link } from '@mui/material';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

export default function PageHeader({ title, subtitle, icon, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        {breadcrumbs && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 2 }}
          >
            {breadcrumbs.map((crumb, index) => (
              crumb.to ? (
                <Link
                  key={index}
                  component={RouterLink}
                  to={crumb.to}
                  color="inherit"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={index} color="text.primary">
                  {crumb.label}
                </Typography>
              )
            ))}
          </Breadcrumbs>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon && (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                }}
              >
                {icon}
              </Box>
            )}
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {actions && (
            <Stack direction="row" spacing={2}>
              {actions}
            </Stack>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
