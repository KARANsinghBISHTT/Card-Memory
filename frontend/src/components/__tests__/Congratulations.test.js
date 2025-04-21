import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Congratulations from '../Congratulations';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('<Congratulations />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const mockGameData = { attempts: 10, timer: 30 };

  test('renders the congratulations message and game statistics', () => {
    render(
      <BrowserRouter>
        <Congratulations gameData={mockGameData} />
      </BrowserRouter>
    );
    expect(screen.getByText(/congratulations!/i)).toBeInTheDocument();
    expect(screen.getByText(/attempts: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/time: 30 seconds/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });

  test('navigates to /play when the Play Again button is clicked', async () => {
    render(
      <BrowserRouter>
        <Congratulations gameData={mockGameData} />
      </BrowserRouter>
    );
    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(playAgainButton);
    expect(mockNavigate).toHaveBeenCalledWith('/play');
  });
});