import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import MessengerPage from './pages/MessengerPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SellerProductsPage from './pages/SellerProductsPage';
import StatisticsPage from './pages/StatisticsPage';
import SupportPage from './pages/SupportPage';

function App() {
  const { token, fetchUser } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#4F46E5',
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />

            <Route path="/messenger" element={
              token ? <MessengerPage /> : <Navigate to="/login" />
            } />

            <Route path="/profile" element={
              token ? <ProfilePage /> : <Navigate to="/login" />
            } />

            <Route path="/dashboard" element={
              token ? <DashboardPage /> : <Navigate to="/login" />
            } />

            <Route path="/dashboard/products" element={
              token ? <SellerProductsPage /> : <Navigate to="/login" />
            } />

            <Route path="/dashboard/statistics" element={
              token ? <StatisticsPage /> : <Navigate to="/login" />
            } />

            <Route path="/support" element={
              token ? <SupportPage /> : <Navigate to="/login" />
            } />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
