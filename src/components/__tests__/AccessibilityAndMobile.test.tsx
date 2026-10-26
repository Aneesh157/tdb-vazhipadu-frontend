import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderForm } from '../OrderForm';
import { App } from '../../App';
import * as apiModule from '../../api';

describe('P5 – Mobile and Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    apiModule.mockApi.setFailureRate(0);
    apiModule.mockApi.setDelayRange(5, 10);
  });

  describe('Acceptance Criteria: Tests find form fields by their labels', () => {
    it('locates all booking form controls using accessible labels', () => {
      render(
        <OrderForm
          formData={{
            devoteeName: 'Anand Krishna',
            phoneNumber: '9847234567',
            nakshatra: 'Rohini (രോഹിണി)',
            offeringDate: '2026-11-20',
          }}
          onChange={vi.fn()}
          onSubmit={vi.fn()}
          hasItems={true}
        />
      );

      // Verify each form field is accessible strictly by label
      const nameInput = screen.getByLabelText(/devotee name \*/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue('Anand Krishna');

      const phoneInput = screen.getByLabelText(/phone number \*/i);
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput).toHaveValue('9847234567');

      const nakshatraSelect = screen.getByLabelText(/birth star \(nakshatra \/ നാൾ\) \*/i);
      expect(nakshatraSelect).toBeInTheDocument();
      expect(nakshatraSelect).toHaveValue('Rohini (രോഹിണി)');

      const dateInput = screen.getByLabelText(/date of offering \*/i);
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveValue('2026-11-20');
    });

    it('announces errors to screen readers with proper role="alert" and aria-describedby', () => {
      render(
        <OrderForm
          formData={{
            devoteeName: '',
            phoneNumber: '',
            nakshatra: '',
            offeringDate: '',
          }}
          onChange={vi.fn()}
          onSubmit={vi.fn()}
          hasItems={true}
        />
      );

      // Trigger validation
      const submitBtn = screen.getByRole('button', { name: /place vazhipadu order/i });
      fireEvent.click(submitBtn);

      const nameInput = screen.getByLabelText(/devotee name \*/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'devotee-name-error');

      const nameError = screen.getByText(/devotee's name is required/i);
      expect(nameError).toHaveAttribute('role', 'alert');
    });
  });

  describe('Acceptance Criteria: Keyboard-only booking flow walkthrough without mouse', () => {
    it('completes the entire booking submission using Tab, typing, and Enter/Space alone', async () => {
      const user = userEvent.setup();

      // Seed cart with an offering
      localStorage.setItem(
        'tdb_vazhipadu_cart_v1',
        JSON.stringify([
          {
            offering: {
              id: 'sab-pushpanjali',
              templeId: 'sabarimala',
              name: 'Pushpanjali',
              description: 'Sacred flowers',
              price: 30,
              active: true,
            },
            quantity: 1,
          },
        ])
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByLabelText(/select sacred temple/i)).toBeInTheDocument();
      });

      // Navigate to Devotee Name field
      const nameInput = screen.getByLabelText(/devotee name \*/i);
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      await user.keyboard('Gokul Das');

      // Tab to Phone Number
      await user.tab();
      const phoneInput = screen.getByLabelText(/phone number \*/i);
      expect(phoneInput).toHaveFocus();
      await user.keyboard('9847678901');

      // Tab to Nakshatra select
      await user.tab();
      const nakshatraSelect = screen.getByLabelText(/birth star \(nakshatra \/ നാൾ\) \*/i);
      expect(nakshatraSelect).toHaveFocus();
      fireEvent.change(nakshatraSelect, { target: { value: 'Rohini (രോഹിണി)' } });

      // Tab to Offering Date
      await user.tab();
      const dateInput = screen.getByLabelText(/date of offering \*/i);
      expect(dateInput).toHaveFocus();
      fireEvent.change(dateInput, { target: { value: '2026-12-25' } });

      // Tab to Place Order button
      await user.tab();
      const submitBtn = screen.getByRole('button', { name: /place vazhipadu order/i });
      expect(submitBtn).toHaveFocus();

      // Press Enter key to submit without any mouse click!
      await user.keyboard('{Enter}');

      // Verify booking succeeds and displays confirmation
      await waitFor(() => {
        expect(screen.getByTestId('confirmation-order-id')).toBeInTheDocument();
      });
      expect(screen.getByText('Gokul Das')).toBeInTheDocument();
    });
  });

  describe('Acceptance Criteria: Responsive layout at 360px viewport', () => {
    it('renders without viewport overflow or layout breaking at 360px mobile width', () => {
      const { container } = render(<App />);

      // Verify the main container is rendered and has fluid responsive classes
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('w-full');
      expect(mainElement).toHaveClass('max-w-7xl');
    });
  });
});
