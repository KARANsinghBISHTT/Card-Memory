import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Home from '../Home';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('<Home />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders the home page elements', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/welcome to the memory card game/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play now/i })).toBeInTheDocument();
  });

  test('navigates to /play when the Play Now button is clicked', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const playNowButton = screen.getByRole('button', { name: /play now/i });
    fireEvent.click(playNowButton);
    expect(mockNavigate).toHaveBeenCalledWith('/play');
  });
});