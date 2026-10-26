import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersList } from '../OrdersList';
import * as apiModule from '../../api';
import { Order } from '../../types';

const sampleOrders: Order[] = [
  {
    id: 'ORD-2026-1001',
    templeId: 'sabarimala',
    templeName: 'Sabarimala Sree Dharma Sastha Temple',
    devoteeName: 'Ramesh Nair',
    phoneNumber: '9847012345',
    nakshatra: 'Rohini (രോഹിണി)',
    offeringDate: '2026-11-10',
    items: [
      {
        offeringId: 'pushpanjali',
        offeringName: 'Pushpanjali',
        price: 30,
        quantity: 2,
        subtotal: 60,
      },
    ],
    totalAmount: 60,
    status: 'CONFIRMED',
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'ORD-2026-1002',
    templeId: 'chottanikkara',
    templeName: 'Chottanikkara Bhagavathy Temple',
    devoteeName: 'Priya Pillai',
    phoneNumber: '9847123456',
    nakshatra: 'Bharani (ഭരണി)',
    offeringDate: '2026-11-12',
    items: [
      {
        offeringId: 'archana',
        offeringName: 'Archana',
        price: 50,
        quantity: 1,
        subtotal: 50,
      },
    ],
    totalAmount: 50,
    status: 'CANCELLED',
    createdAt: '2026-10-21T10:00:00.000Z',
  },
];

describe('P4 – Orders List (Staff Portal)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiModule.mockApi.setFailureRate(0);
    apiModule.mockApi.setDelayRange(5, 15);
    window.history.replaceState(null, '', '/');
  });

  it('acceptance criteria: filtering by status shows only matching orders and goes back to page 1', async () => {
    const getOrdersSpy = vi.spyOn(apiModule, 'getOrders').mockResolvedValue({
      orders: [sampleOrders[1]],
      total: 1,
      page: 1,
      limit: 8,
      totalPages: 1,
    });

    render(<OrdersList />);

    // Change status filter to CANCELLED
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'CANCELLED' } });

    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'CANCELLED',
          page: 1, // verified page resets to 1!
        })
      );
    });

    // Check that URL updated with status and not page since page is 1
    expect(window.location.search).toContain('status=CANCELLED');
  });

  it('acceptance criteria: refreshing page keeps filters and the current page from URL params', async () => {
    // Simulate URL after refresh: ?status=CONFIRMED&phone=9847&page=2
    window.history.replaceState(
      null,
      '',
      '/?status=CONFIRMED&phone=9847&page=2'
    );

    const getOrdersSpy = vi.spyOn(apiModule, 'getOrders').mockResolvedValue({
      orders: [sampleOrders[0]],
      total: 15,
      page: 2,
      limit: 8,
      totalPages: 2,
    });

    render(<OrdersList />);

    await waitFor(() => {
      expect(getOrdersSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'CONFIRMED',
          phoneNumber: '9847',
          page: 2,
        })
      );
    });

    // Verify inputs have the URL values
    expect(
      (screen.getByLabelText(/status/i) as HTMLSelectElement).value
    ).toBe('CONFIRMED');
    expect(
      (screen.getByPlaceholderText(/search phone number/i) as HTMLInputElement)
        .value
    ).toBe('9847');
    expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument();
  });

  it('acceptance criteria: a cancelled order shows as cancelled without reloading the page', async () => {
    vi.spyOn(apiModule, 'getOrders').mockResolvedValue({
      orders: [{ ...sampleOrders[0] }],
      total: 1,
      page: 1,
      limit: 8,
      totalPages: 1,
    });

    vi.spyOn(apiModule, 'cancelOrder').mockResolvedValue({
      ...sampleOrders[0],
      status: 'CANCELLED',
    });

    render(<OrdersList />);

    await waitFor(() => {
      expect(screen.getByText('ORD-2026-1001')).toBeInTheDocument();
    });

    // Order initially shows CONFIRMED
    const initialStatus = screen.getByTestId('order-status-ORD-2026-1001');
    expect(initialStatus).toHaveTextContent('CONFIRMED');

    // Click Cancel Order
    const cancelBtn = screen.getByRole('button', { name: /cancel order/i });
    fireEvent.click(cancelBtn);

    // Modal opens
    expect(
      screen.getByText(/confirm order cancellation/i)
    ).toBeInTheDocument();

    // Confirm cancel in modal
    const confirmBtn = screen.getByRole('button', {
      name: /yes, cancel order/i,
    });
    fireEvent.click(confirmBtn);

    // Without reloading the page, order status updates to CANCELLED
    await waitFor(() => {
      const updatedStatus = screen.getByTestId('order-status-ORD-2026-1001');
      expect(updatedStatus).toHaveTextContent('CANCELLED');
    });
  });
});
