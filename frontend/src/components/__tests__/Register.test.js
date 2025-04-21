import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../Register';
import { BrowserRouter } from 'react-router-dom'; 

const mockAxios = {
  post: jest.fn(() => Promise.resolve({ data: { message: 'Registration successful' } })),
};
jest.mock('axios', () => mockAxios);

describe('<Register />', () => {
  beforeEach(() => {
    mockAxios.post.mockClear();
  });

  test('renders the registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('calls the registration API on successful form submission', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        { username: 'testuser', email: 'test@example.com', password: 'password123' }
      );
    });
  });

});