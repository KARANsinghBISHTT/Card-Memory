import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemoryCardGame from '../MemoryCardGame';
import { shuffleArray } from '../../utils/shuffleArray'; // Assuming you have this utility

// Mock the shuffleArray function for predictable testing
jest.mock('../../utils/shuffleArray', () => ({
  shuffleArray: jest.fn((array) => [...array].sort(() => 0.5 - Math.random())), // Basic shuffle mock
}));

describe('<MemoryCardGame />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders 12 cards initially', async () => {
    render(<MemoryCardGame />);
    await waitFor(() => expect(screen.getAllByAltText('Card back')).toHaveLength(12), { timeout: 2000 });
  });

  test('clicking two different cards flips them', async () => {
    render(<MemoryCardGame />);
    await waitFor(() => expect(screen.getAllByAltText('Card back')).toHaveLength(12), { timeout: 2000 });
    const cards = screen.getAllByRole('img', { name: 'Card back' });

    await userEvent.click(cards[0].closest('div'));
    await waitFor(() => expect(screen.getByAltText('Card front')).toBeInTheDocument(), { timeout: 2000 });

    await userEvent.click(cards[2].closest('div'));
    await waitFor(() => expect(screen.getAllByAltText('Card front')).toHaveLength(2), { timeout: 2000 });
  }, 3000);

  test('clicking two matching cards keeps them flipped (requires predictable shuffle)', async () => {
    const mockCards = [
      { id: 1, image: '/images/earth.png' },
      { id: 2, image: '/images/earth.png' },
      { id: 3, image: '/images/jupiter.png' },
      { id: 4, image: '/images/jupiter.png' },
      // ... (rest of the pairs)
    ];
    shuffleArray.mockImplementationOnce(() => mockCards); // Force a predictable order

    render(<MemoryCardGame />);
    await waitFor(() => expect(screen.getAllByAltText('Card back')).toHaveLength(12), { timeout: 2000 });
    const cards = screen.getAllByRole('img', { name: 'Card back' });

    await userEvent.click(cards[0].closest('div'));
    await waitFor(() => expect(screen.getByAltText('Card front', { name: /earth/i })).toBeInTheDocument(), { timeout: 2000 });

    await userEvent.click(cards[1].closest('div'));

    await waitFor(() => expect(screen.getAllByAltText('Card front', { name: /earth/i })).toHaveLength(2), { timeout: 2500 });
  }, 3000);

  test('clicking two non-matching cards flips them back', async () => {
    render(<MemoryCardGame />);
    await waitFor(() => expect(screen.getAllByAltText('Card back')).toHaveLength(12), { timeout: 2000 });
    const cards = screen.getAllByRole('img', { name: 'Card back' });

    await userEvent.click(cards[0].closest('div'));
    await waitFor(() => expect(screen.getByAltText('Card front')).toBeInTheDocument(), { timeout: 2000 });

    await userEvent.click(cards[2].closest('div'));
    await waitFor(() => expect(screen.getAllByAltText('Card back')).toHaveLength(10), { timeout: 2500 }); // Two flipped back
  }, 3000);

  // You can add more tests for other functionalities like checking the timer, attempts, win condition, etc.
});