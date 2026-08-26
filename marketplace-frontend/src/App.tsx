import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import Layout from './components/Layout';
import { lazyLoad } from './components/LazyLoad';
import { useEffect } from 'react';

// Lazy loaded pages
const HomePage = lazyLoad(() => import('./pages/HomePage'));
const LoginPage = lazyLoad(() => import('./pages/LoginPage'));
const RegisterPage = lazyLoad(() => import('./pages/RegisterPage'));
const ProductsPage = lazyLoad(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazyLoad(() => import('./pages/ProductDetailPage'));
const BlogPage = lazyLoad(() => import('./pages/BlogPage'));
const BlogPostDetailPage = lazyLoad(() => import('./pages/BlogPostDetailPage'));
const MessengerPage = lazyLoad(() => import('./pages/MessengerPage'));
const ProfilePage = lazyLoad(() => import('./pages/ProfilePage'));
const DashboardPage = lazyLoad(() => import('./pages/DashboardPage'));
const SellerProductsPage = lazyLoad(() => import('./pages/SellerProductsPage'));
const StatisticsPage = lazyLoad(() => import('./pages/StatisticsPage'));
const SupportPage = lazyLoad(() => import('./pages/SupportPage'));
const SupportChatPage = lazyLoad(() => import('./pages/SupportChatPage'));
const DisputesPage = lazyLoad(() => import('./pages/DisputesPage'));
const OrdersPage = lazyLoad(() => import('./pages/OrdersPage'));
const SettingsPage = lazyLoad(() => import('./pages/SettingsPage'));
const ApiKeysPage = lazyLoad(() => import('./pages/ApiKeysPage'));
const AboutPage = lazyLoad(() => import('./pages/AboutPage'));

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

            <Route path="/about" element={<AboutPage />} />

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

            <Route path="/dashboard/orders" element={
              token ? <OrdersPage /> : <Navigate to="/login" />
            } />

            <Route path="/dashboard/disputes" element={
              token ? <DisputesPage /> : <Navigate to="/login" />
            } />

            <Route path="/support" element={
              token ? <SupportPage /> : <Navigate to="/login" />
            } />

            <Route path="/support/chat" element={
              token ? <SupportChatPage /> : <Navigate to="/login" />
            } />

            <Route path="/settings" element={
              token ? <SettingsPage /> : <Navigate to="/login" />
            } />

            <Route path="/settings/api-keys" element={
              token ? <ApiKeysPage /> : <Navigate to="/login" />
            } />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
