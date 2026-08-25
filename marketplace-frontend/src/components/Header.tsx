import {Link} from 'react-router-dom';
import {useAuthStore} from '@/stores/authStore';
import {useThemeStore} from '@/stores/themeStore';
import {AppBar, Avatar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography,} from '@mui/material';
import {DarkMode, LightMode,} from '@mui/icons-material';
import {useState} from 'react';

export default function Header() {
  const {user, logout} = useAuthStore();
  const {theme, toggleTheme} = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{
          flexGrow: 1,
          textDecoration: 'none',
          color: 'primary.main',
          fontWeight: 'bold',
        }}>
          Marketplace
        </Typography>

        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Button component={Link} to="/products" color="inherit">
            Товары
          </Button>
          <Button component={Link} to="/blog" color="inherit">
            Блог
          </Button>

          <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'light' ? <DarkMode/> : <LightMode/>}
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar sx={{width: 32, height: 32}}>
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  Профиль
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                  Дашборд
                </MenuItem>
                <MenuItem component={Link} to="/messenger" onClick={handleClose}>
                  Мессенджер
                </MenuItem>
                <MenuItem onClick={() => {
                  handleClose();
                  logout();
                }}>
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{display: 'flex', gap: 1}}>
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
