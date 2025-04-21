import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const mockAxios = {
  post: jest.fn(() => Promise.resolve({ data: { token: 'mockToken' } })),
};
jest.mock('axios', () => mockAxios);

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('<Login />', () => {
  beforeEach(() => {
    mockAxios.post.mockClear();
    mockNavigate.mockClear();
  });

  test('renders the login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls the login API on successful form submission and navigates to /play', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        { username: 'testuser', password: 'password123' }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/play');
    });
  });

});