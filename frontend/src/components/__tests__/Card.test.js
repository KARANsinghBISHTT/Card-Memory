import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../Card';

const mockCard = { id: 1, image: '/images/earth.png' };
const mockHandleClick = jest.fn();

describe('<Card />', () => {
  test('renders the back image initially', () => {
    render(
      <Card
        card={mockCard}
        handleClick={mockHandleClick}
        flipped={false}
        matched={false}
      />
    );
    const backImage = screen.getByAltText('Card back');
    expect(backImage).toBeInTheDocument();
  });

  test('calls handleClick when the card is clicked', async () => {
    render(
      <Card
        card={mockCard}
        handleClick={mockHandleClick}
        flipped={false}
        matched={false}
      />
    );
    const cardContainer = screen.getByRole('img', { name: 'Card back' }).closest('div');
    await userEvent.click(cardContainer);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(mockHandleClick).toHaveBeenCalledWith(mockCard);
  });

  test('renders the front image when flipped is true', () => {
    render(
      <Card
        card={mockCard}
        handleClick={mockHandleClick}
        flipped={true}
        matched={false}
      />
    );
    const frontImage = screen.getByAltText('Card front');
    expect(frontImage).toBeInTheDocument();
  });

  test('renders the front image when matched is true', () => {
    render(
      <Card
        card={mockCard}
        handleClick={mockHandleClick}
        flipped={false}
        matched={true}
      />
    );
    const frontImage = screen.getByAltText('Card front');
    expect(frontImage).toBeInTheDocument();
  });
});