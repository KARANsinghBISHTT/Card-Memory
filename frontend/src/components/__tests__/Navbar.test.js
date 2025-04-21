import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthContext } from '../../context/AuthContext';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('<Navbar />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithAuth = (isAuthenticated) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isAuthenticated, logout: jest.fn() }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test('renders navigation links when not authenticated', () => {
    renderWithAuth(false);
    expect(screen.getByText(/play/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).toBeNull();
  });

  test('renders navigation links including logout when authenticated', () => {
    const mockLogout = jest.fn();
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isAuthenticated: true, logout: mockLogout }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText(/play/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/register/i)).toBeNull();
    expect(screen.queryByText(/login/i)).toBeNull();
  });

  test('navigates to /play when Play link is clicked', async () => {
    renderWithAuth(false);
    const playLink = screen.getByText(/play/i);
    fireEvent.click(playLink);
    expect(mockNavigate).toHaveBeenCalledWith('/play');
  });

  test('navigates to /register when Register link is clicked', async () => {
    renderWithAuth(false);
    const registerLink = screen.getByText(/register/i);
    fireEvent.click(registerLink);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to /login when Login link is clicked', async () => {
    renderWithAuth(false);
    const loginLink = screen.getByText(/login/i);
    fireEvent.click(loginLink);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('calls logout function and navigates to / on Logout click when authenticated', async () => {
    const mockLogout = jest.fn();
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isAuthenticated: true, logout: mockLogout }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});