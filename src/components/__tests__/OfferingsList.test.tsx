import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfferingsList } from '../OfferingsList';
import { Offering } from '../../types';

const mockOfferings: Offering[] = [
  {
    id: 'pushpanjali',
    templeId: 'sabarimala',
    name: 'Pushpanjali',
    description: 'Sacred floral offering',
    price: 30,
    active: true,
  },
  {
    id: 'archana',
    templeId: 'sabarimala',
    name: 'Archana',
    description: 'Vedic recitation',
    price: 50,
    active: true,
  },
  {
    id: 'padi-pooja',
    templeId: 'sabarimala',
    name: 'Padi Pooja',
    description: '18 golden steps pooja',
    price: 15000,
    active: false, // inactive
  },
];

describe('OfferingsList (P1 Requirements)', () => {
  it('renders all offerings with names and formatted prices in rupees', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    expect(screen.getByText('₹30')).toBeInTheDocument();
    expect(screen.getByText('Archana')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();
    expect(screen.getByText('Padi Pooja')).toBeInTheDocument();
    expect(screen.getByText('₹15000')).toBeInTheDocument();
  });

  it('typing "push" shows Pushpanjali and hides offerings that do not match', () => {
    const handleSearchChange = vi.fn();
    const { rerender } = render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
        searchQuery=""
        onSearchChange={handleSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search offerings/i);
    fireEvent.change(searchInput, { target: { value: 'push' } });
    expect(handleSearchChange).toHaveBeenCalledWith('push');

    // Simulate state update in parent
    rerender(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
        searchQuery="push"
        onSearchChange={handleSearchChange}
      />
    );

    expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
    expect(screen.queryByText('Archana')).not.toBeInTheDocument();
    expect(screen.queryByText('Padi Pooja')).not.toBeInTheDocument();
  });

  it('inactive offerings are not offered for booking (booking action is disabled)', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    // Active offerings have Add to Offering button
    const addButtons = screen.getAllByRole('button', { name: /add to offering/i });
    expect(addButtons.length).toBe(2);
    expect(addButtons[0]).not.toBeDisabled();

    // Inactive offering has disabled 'Not Available' button and Inactive badge
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    const notAvailableBtn = screen.getByRole('button', { name: /not available/i });
    expect(notAvailableBtn).toBeDisabled();
  });

  it('a failed load shows an error with a way to try again', () => {
    const onRetryMock = vi.fn();
    render(
      <OfferingsList
        offerings={[]}
        isLoading={false}
        error="Network request failed. Please check your connection."
        onRetry={onRetryMock}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText(/Network request failed. Please check your connection./i)
    ).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainBtn).toBeInTheDocument();

    fireEvent.click(tryAgainBtn);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading skeleton when isLoading is true', () => {
    render(
      <OfferingsList
        offerings={[]}
        isLoading={true}
        error={null}
        onRetry={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('offerings-loading')).toBeInTheDocument();
  });

  it('shows empty state when search yields no matches', () => {
    render(
      <OfferingsList
        offerings={mockOfferings}
        isLoading={false}
        error={null}
        onRetry={vi.fn()}
        searchQuery="nonexistent"
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('offerings-empty')).toBeInTheDocument();
    expect(screen.getByText(/no offerings found/i)).toBeInTheDocument();
  });
});
