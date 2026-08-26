import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { mockUser } from './types';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Header', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
    });
    useThemeStore.setState({ theme: 'light' });
  });

  it('renders logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('shows user name when authenticated', () => {
    useAuthStore.setState({
      user: mockUser,
      token: 'test-token',
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('does not show login button when authenticated', () => {
    useAuthStore.setState({
      user: mockUser,
      token: 'test-token',
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
  });
});
