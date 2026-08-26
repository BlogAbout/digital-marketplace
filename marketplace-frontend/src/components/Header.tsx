import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tooltip,
  Container,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';
import { useNotifications } from '../hooks/useNotifications';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleLogout = async () => {
    setUserMenuAnchor(null);
    await logout();
    navigate('/login');
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Marketplace
              </Typography>
            </motion.div>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button component={Link} to="/products" color="inherit" sx={{ mx: 0.5 }}>
                <StorefrontIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Товары
              </Button>
              <Button component={Link} to="/blog" color="inherit" sx={{ mx: 0.5 }}>
                Блог
              </Button>

              <Tooltip title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}>
                <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                  {theme === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
              </Tooltip>

              {user ? (
                <>
                  <Tooltip title="Уведомления">
                    <IconButton onClick={handleNotificationMenu} color="inherit" sx={{ ml: 1 }}>
                      <Badge badgeContent={unreadCount} color="error" max={99}>
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={() => setNotificationAnchor(null)}
                    PaperProps={{
                      style: {
                        maxHeight: 400,
                        width: 380,
                        borderRadius: 16,
                        marginTop: 8,
                      },
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Уведомления
                        </Typography>
                        {unreadCount > 0 && (
                          <Button size="small" onClick={markAllAsRead}>
                            Прочитать все
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <List sx={{ py: 0 }}>
                      {notifications.length === 0 ? (
                        <ListItem sx={{ py: 3 }}>
                          <ListItemText
                            primary="Нет уведомлений"
                            sx={{ textAlign: 'center' }}
                          />
                        </ListItem>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <ListItem
                            key={notification.id}
                            alignItems="flex-start"
                            onClick={() => {
                              markAsRead(notification.id);
                              setNotificationAnchor(null);
                              if (notification.url) navigate(notification.url);
                            }}
                            sx={{
                              cursor: 'pointer',
                              px: 2,
                              py: 1.5,
                              bgcolor: notification.read_at ? 'transparent' : 'action.hover',
                              '&:hover': {
                                bgcolor: 'action.selected',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                <NotificationsIcon fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={notification.read_at ? 'normal' : 'bold'}>
                                  {notification.title}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant="caption" color="text.secondary">
                                    {notification.message}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {format(new Date(notification.created_at), 'dd.MM.yyyy HH:mm')}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Menu>

                  <IconButton onClick={handleUserMenu} sx={{ ml: 1 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        border: '2px solid',
                        borderColor: 'primary.light',
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                    PaperProps={{
                      style: {
                        borderRadius: 16,
                        marginTop: 8,
                        minWidth: 200,
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <MenuItem component={Link} to="/profile" onClick={() => setUserMenuAnchor(null)}>
                      <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Профиль
                    </MenuItem>
                    <MenuItem component={Link} to="/dashboard" onClick={() => setUserMenuAnchor(null)}>
                      <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Дашборд
                    </MenuItem>
                    <MenuItem component={Link} to="/messenger" onClick={() => setUserMenuAnchor(null)}>
                      <ChatIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Мессенджер
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Выйти
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Button component={Link} to="/login" color="inherit">
                    Войти
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      },
                    }}
                  >
                    Регистрация
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
