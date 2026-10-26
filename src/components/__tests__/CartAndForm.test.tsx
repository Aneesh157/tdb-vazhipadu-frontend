import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Cart } from '../Cart';
import { OrderForm, validateOrderForm } from '../OrderForm';
import { useCart } from '../../hooks/useCart';
import { Offering } from '../../types';

const pushpanjali: Offering = {
  id: 'pushpanjali',
  templeId: 'sabarimala',
  name: 'Pushpanjali',
  description: 'Sacred floral offering',
  price: 30,
  active: true,
};

const archana: Offering = {
  id: 'archana',
  templeId: 'sabarimala',
  name: 'Archana',
  description: 'Vedic recitation',
  price: 50,
  active: true,
};

describe('P2 – Offering Cart and Order Form', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Acceptance Criteria 1: Cart Calculation (2 Pushpanjali @ ₹30 + 1 Archana @ ₹50 = ₹110)', () => {
    it('shows each line and calculates the total of ₹110 in Indian rupees', () => {
      const items = [
        { offering: pushpanjali, quantity: 2 },
        { offering: archana, quantity: 1 },
      ];
      // 2 * 30 + 1 * 50 = 110
      const totalAmount = 110;

      render(
        <Cart
          items={items}
          totalAmount={totalAmount}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
        />
      );

      // Verify line items and prices
      expect(screen.getByText('Pushpanjali')).toBeInTheDocument();
      expect(screen.getByText('Archana')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-pushpanjali')).toHaveTextContent('2');
      expect(screen.getByTestId('quantity-archana')).toHaveTextContent('1');
      expect(screen.getByText('₹60')).toBeInTheDocument();
      expect(screen.getByText('₹50')).toBeInTheDocument();

      // Verify Total amount ₹110
      const totalElement = screen.getByTestId('cart-total-amount');
      expect(totalElement).toHaveTextContent('₹110');
    });

    it('allows changing quantities and removing items', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <Cart
          items={[{ offering: pushpanjali, quantity: 2 }]}
          totalAmount={60}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      // Increase quantity
      const plusBtn = screen.getByRole('button', {
        name: /increase quantity of pushpanjali/i,
      });
      fireEvent.click(plusBtn);
      expect(onUpdateQuantity).toHaveBeenCalledWith('pushpanjali', 3);

      // Decrease quantity
      const minusBtn = screen.getByRole('button', {
        name: /decrease quantity of pushpanjali/i,
      });
      fireEvent.click(minusBtn);
      expect(onUpdateQuantity).toHaveBeenCalledWith('pushpanjali', 1);

      // Remove item
      const removeBtn = screen.getByRole('button', {
        name: /remove pushpanjali from cart/i,
      });
      fireEvent.click(removeBtn);
      expect(onRemoveItem).toHaveBeenCalledWith('pushpanjali');
    });
  });

  describe('Acceptance Criteria 2: Form validation shows messages next to invalid fields', () => {
    it('shows inline validation messages next to each invalid field on submit', () => {
      const onSubmit = vi.fn();
      render(
        <OrderForm
          formData={{
            devoteeName: '',
            phoneNumber: '',
            nakshatra: '',
            offeringDate: '',
          }}
          onChange={vi.fn()}
          onSubmit={onSubmit}
          hasItems={true}
        />
      );

      // Click Place Vazhipadu Order with empty values
      const submitBtn = screen.getByRole('button', {
        name: /place vazhipadu order/i,
      });
      fireEvent.click(submitBtn);

      // Expect submit NOT to be called
      expect(onSubmit).not.toHaveBeenCalled();

      // Expect individual error messages next to each field
      expect(screen.getByText(/devotee's name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please select a birth star \(nakshatra\)/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/date of offering is required/i)).toBeInTheDocument();
    });

    it('validates that offering date cannot be in the past', () => {
      const errors = validateOrderForm({
        devoteeName: 'Ramesh Nair',
        phoneNumber: '9847012345',
        nakshatra: 'Rohini (രോഹിണി)',
        offeringDate: '2020-01-01', // past date
      });

      expect(errors.offeringDate).toBe('Offering date cannot be in the past');
    });

    it('passes validation when all fields are valid and date is present/future', () => {
      const futureDate = '2030-12-31';
      const errors = validateOrderForm({
        devoteeName: 'Ramesh Nair',
        phoneNumber: '9847012345',
        nakshatra: 'Rohini (രോഹിണി)',
        offeringDate: futureDate,
      });

      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('Acceptance Criteria 3: Refreshing page keeps the cart (localStorage persistence)', () => {
    it('persists cart items in localStorage and restores them across instances', () => {
      const { result, unmount } = renderHook(() => useCart());

      // Add 2 Pushpanjali and 1 Archana
      act(() => {
        result.current.addToCart(pushpanjali);
      });
      act(() => {
        result.current.addToCart(pushpanjali);
      });
      act(() => {
        result.current.addToCart(archana);
      });

      expect(result.current.totalAmount).toBe(110);
      expect(result.current.totalCount).toBe(3);

      // Verify stored in localStorage
      const stored = localStorage.getItem('tdb_vazhipadu_cart_v1');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(2);

      // Simulate unmounting (refresh)
      unmount();

      // Render new hook instance (simulate fresh page load after refresh)
      const { result: newResult } = renderHook(() => useCart());
      expect(newResult.current.items).toHaveLength(2);
      expect(newResult.current.totalAmount).toBe(110);
      expect(newResult.current.totalCount).toBe(3);
    });
  });
});
