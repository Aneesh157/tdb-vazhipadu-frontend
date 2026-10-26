import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderConfirmation } from '../OrderConfirmation';
import { App } from '../../App';
import * as apiModule from '../../api';
import { Order } from '../../types';

const mockOrder: Order = {
  id: 'ORD-2026-789012',
  templeId: 'sabarimala',
  templeName: 'Sabarimala Sree Dharma Sastha Temple',
  devoteeName: 'Ramesh Nair',
  phoneNumber: '9847012345',
  nakshatra: 'Rohini (രോഹിണി)',
  offeringDate: '2026-11-15',
  items: [
    {
      offeringId: 'pushpanjali',
      offeringName: 'Pushpanjali',
      price: 30,
      quantity: 2,
      subtotal: 60,
    },
    {
      offeringId: 'archana',
      offeringName: 'Archana',
      price: 50,
      quantity: 1,
      subtotal: 50,
    },
  ],
  totalAmount: 110,
  status: 'CONFIRMED',
  createdAt: '2026-10-26T10:00:00.000Z',
};

describe('P3 – Order Confirmation & Submission Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    apiModule.mockApi.setFailureRate(0);
    apiModule.mockApi.setDelayRange(10, 30);
  });

  it('renders confirmation screen with order number, details, and total paid', () => {
    const handleReset = vi.fn();
    render(<OrderConfirmation order={mockOrder} onReset={handleReset} />);

    expect(screen.getByTestId('confirmation-order-id')).toHaveTextContent(
      'ORD-2026-789012'
    );
    expect(screen.getByTestId('confirmation-total-amount')).toHaveTextContent('₹110');
    expect(screen.getByText('Ramesh Nair')).toBeInTheDocument();
    expect(screen.getByText('9847012345')).toBeInTheDocument();
    expect(screen.getByText('Rohini (രോഹിണി)')).toBeInTheDocument();
    expect(screen.getByText('2026-11-15')).toBeInTheDocument();

    const bookAnotherBtn = screen.getByRole('button', {
      name: /book another offering/i,
    });
    fireEvent.click(bookAnotherBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('acceptance criteria: double-clicking Place order creates only one order', async () => {
    // Seed localStorage with a cart item so button is enabled
    localStorage.setItem(
      'tdb_vazhipadu_cart_v1',
      JSON.stringify([
        {
          offering: {
            id: 'sab-pushpanjali',
            templeId: 'sabarimala',
            name: 'Pushpanjali',
            description: 'Floral garland',
            price: 30,
            active: true,
          },
          quantity: 2,
        },
      ])
    );

    // Spy on createOrder with a slight artificial delay
    let callCount = 0;
    const createOrderSpy = vi
      .spyOn(apiModule, 'createOrder')
      .mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 80));
        return mockOrder;
      });

    render(<App />);

    // Wait for temple to load
    await waitFor(() => {
      expect(screen.getByLabelText(/select sacred temple/i)).toBeInTheDocument();
    });

    // Fill valid form fields
    fireEvent.change(screen.getByLabelText(/devotee name \*/i), {
      target: { value: 'Ramesh Nair' },
    });
    fireEvent.change(screen.getByLabelText(/phone number \*/i), {
      target: { value: '9847012345' },
    });
    fireEvent.change(screen.getByLabelText(/birth star \(nakshatra \/ നാൾ\) \*/i), {
      target: { value: 'Rohini (രോഹിണി)' },
    });
    fireEvent.change(screen.getByLabelText(/date of offering \*/i), {
      target: { value: '2026-12-01' },
    });

    const submitBtn = screen.getByRole('button', {
      name: /place vazhipadu order/i,
    });

    // Double-click rapidly
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('confirmation-order-id')).toBeInTheDocument();
    });

    // Verify createOrder was called exactly ONCE
    expect(callCount).toBe(1);
    expect(createOrderSpy).toHaveBeenCalledTimes(1);

    // Verify cart was emptied in localStorage after success
    expect(localStorage.getItem('tdb_vazhipadu_cart_v1')).toBe('[]');
  });

  it('acceptance criteria: after a failure, the cart and form are unchanged and a retry works', async () => {
    // Seed cart
    localStorage.setItem(
      'tdb_vazhipadu_cart_v1',
      JSON.stringify([
        {
          offering: {
            id: 'sab-pushpanjali',
            templeId: 'sabarimala',
            name: 'Pushpanjali',
            description: 'Floral garland',
            price: 30,
            active: true,
          },
          quantity: 2,
        },
      ])
    );

    // First attempt fails, second attempt succeeds
    let attempt = 0;
    vi.spyOn(apiModule, 'createOrder').mockImplementation(async () => {
      attempt++;
      if (attempt === 1) {
        throw new Error('Simulated network failure on sanctum server');
      }
      return mockOrder;
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/select sacred temple/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/devotee name \*/i);
    const phoneInput = screen.getByLabelText(/phone number \*/i);
    const starInput = screen.getByLabelText(/birth star \(nakshatra \/ നാൾ\) \*/i);
    const dateInput = screen.getByLabelText(/date of offering \*/i);

    fireEvent.change(nameInput, { target: { value: 'Ramesh Nair' } });
    fireEvent.change(phoneInput, { target: { value: '9847012345' } });
    fireEvent.change(starInput, { target: { value: 'Rohini (രോഹിണി)' } });
    fireEvent.change(dateInput, { target: { value: '2026-12-01' } });

    const submitBtn = screen.getByRole('button', {
      name: /place vazhipadu order/i,
    });

    // First click -> fails
    fireEvent.click(submitBtn);

    // Error alert shows
    await waitFor(() => {
      expect(
        screen.getByText(/simulated network failure on sanctum server/i)
      ).toBeInTheDocument();
    });

    // Cart items and form inputs are still intact!
    expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('₹60');
    expect((nameInput as HTMLInputElement).value).toBe('Ramesh Nair');
    expect((phoneInput as HTMLInputElement).value).toBe('9847012345');
    expect((starInput as HTMLSelectElement).value).toBe('Rohini (രോഹിണി)');
    expect((dateInput as HTMLInputElement).value).toBe('2026-12-01');

    // Second click -> retry succeeds!
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('confirmation-order-id')).toBeInTheDocument();
    });

    expect(attempt).toBe(2);
  });
});
