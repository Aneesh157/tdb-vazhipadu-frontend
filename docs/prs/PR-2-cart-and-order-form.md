# PR #2: Feature / P2 – Offering Cart and Order Form

## Problem
Provide devotees with an interactive cart for adding/removing temple offerings, modifying quantities with live rupee total updates, persisting cart contents across page refresh, and a validated booking form collecting devotee name, phone number, nakshatra (from the 27 stars), and offering date (preventing past dates).

## Assumptions
- Cart state should automatically persist to `localStorage` under `tdb_vazhipadu_cart_v1` so accidental reloads or navigating away preserves user selections.
- The 27 nakshatras list includes both English romanized names and Malayalam script for cultural authenticity and ease of selection.
- Date validation enforces that offerings can only be booked for today or future dates (cannot book for past dates).
- Phone validation accepts 10-digit Indian numbers and supports common prefixes like `+91` or leading `0`.

## Decisions & trade-offs
- Built a custom `useCart` hook that handles synchronization with `localStorage` and exposes clean reactive methods (`addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`).
- Displayed inline error messages directly beneath each form field (`aria-describedby` and `role="alert"`) so screen readers and visual users receive immediate actionable feedback.
- Placed Cart and Order Form in a sticky side panel on desktop layouts to keep booking totals and inputs visible alongside the offerings list.

## How to test
- Commands: `npm test` runs all automated Vitest specs including `CartAndForm.test.tsx`.
- Steps in UI:
  1. Open app at `http://localhost:5173`.
  2. Click "Add to Offering" on Pushpanjali twice (₹30 x 2 = ₹60) and Archana once (₹50 x 1 = ₹50).
  3. Verify that the Cart shows both line items and Total: ₹110.
  4. Reload the page (`Ctrl+R` / `Cmd+R`): observe the cart retains 2 Pushpanjali and 1 Archana totaling ₹110.
  5. In Devotee Form, submit with empty inputs: observe red validation messages next to each invalid field.
  6. Attempt to pick a past date: observe validation prevents booking and flags "Offering date cannot be in the past".

## Review Comments & Resolution
- **Reviewer comment (`OrderForm.tsx:L50`)**: Devotees might enter phone numbers with `+91` or leading `0`. Consider sanitizing prefixes to prevent false validation errors.
- **Resolution**: Added sanitization in commit `Address review comment: allow +91 and 0 phone prefixes in devotee phone validation`.
