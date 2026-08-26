import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface SidebarItem {
  label: string;
  icon: ReactNode;
  to: string;
  badge?: number;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
}

export default function Sidebar({ title, items }: SidebarProps) {
  const location = useLocation();

  return (
    <Box sx={{ p: 2 }}>
      {title && (
        <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
          {title}
        </Typography>
      )}
      <List sx={{ py: 0 }}>
        {items.map((item, index) => {
          const isActive = location.pathname === item.to;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <ListItem
                component={Link}
                to={item.to}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge badgeContent={item.badge} color="error" />
                )}
              </ListItem>
            </motion.div>
          );
        })}
      </List>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
