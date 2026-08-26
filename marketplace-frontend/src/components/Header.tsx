import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNotifications } from '../hooks/useNotifications';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

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

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleCloseNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    handleCloseNotificationMenu();
    if (notification.url) {
      navigate(notification.url);
    }
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          Marketplace
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button component={Link} to="/products" color="inherit">
            Товары
          </Button>
          <Button component={Link} to="/blog" color="inherit">
            Блог
          </Button>

          <Tooltip title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}>
            <IconButton onClick={toggleTheme} color="inherit">
              {theme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Уведомления">
                <IconButton onClick={handleNotificationMenu} color="inherit">
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleCloseNotificationMenu}
                PaperProps={{
                  style: {
                    maxHeight: 400,
                    width: 360,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                  <Typography variant="subtitle1">Уведомления</Typography>
                  {unreadCount > 0 && (
                    <Button size="small" onClick={markAllAsRead}>
                      Прочитать все
                    </Button>
                  )}
                </Box>
                <Divider />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {notifications.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="Нет уведомлений" />
                    </ListItem>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <ListItem
                        key={notification.id}
                        alignItems="flex-start"
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: notification.read_at ? 'transparent' : 'action.hover',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <NotificationsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {notification.message}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
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

              <IconButton onClick={handleUserMenu} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Профиль
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleCloseUserMenu}>
                  <DashboardIcon sx={{ mr: 1 }} />
                  Дашборд
                </MenuItem>
                <MenuItem component={Link} to="/messenger" onClick={handleCloseUserMenu}>
                  <ChatIcon sx={{ mr: 1 }} />
                  Мессенджер
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/login" color="inherit">
                Войти
              </Button>
              <Button component={Link} to="/register" variant="contained">
                Регистрация
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
