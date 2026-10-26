# PR #3: Feature / P3 – Order Confirmation

## Problem
Connect the booking flow with the typed mock API (`createOrder`), ensure atomic single-order creation by preventing double-click submissions, preserve cart and form values if an order fails so the user can easily retry, and display a receipt confirmation screen with the generated order number, devotee details, and rupee total while clearing the cart.

## Assumptions
- Submitting an order should be idempotent and protected against rapid concurrent taps using both synchronous ref locks (`isSubmittingRef`) and reactive button disabling.
- When an API failure occurs (such as the default 10% network failure rate or simulated disconnection), devotee input is precious: neither the form fields nor the cart are wiped out. An error alert is shown and devotee can click submit again.
- On successful placement, the cart is cleared from both in-memory state and `localStorage`, and the devotee is taken to the Confirmation Screen with an option to print a receipt or book another offering.

## Decisions & trade-offs
- Combined `useRef<boolean>` with `useState<boolean>` for double-click prevention. The ref lock prevents re-entry even during the microtask window before React re-renders the disabled button.
- Designed a spiritual and formal receipt card with devotee details, temple name, itemized offerings list, grand total, and browser print functionality (`window.print()`).
- Added smooth scrolling to top when navigating to the confirmation screen to guarantee devotee sees the confirmation banner regardless of page scroll position.

## How to test
- Commands: `npm test` runs all automated Vitest specs including `OrderConfirmation.test.tsx`.
- Steps in UI:
  1. Add Pushpanjali and Archana to cart.
  2. Fill out devotee name ("Ramesh Nair"), phone ("9847012345"), Nakshatra ("Rohini"), and offering date.
  3. Double click "Place Vazhipadu Order" quickly: notice loading spinner appears and only one single order is created.
  4. If failure triggers, notice form inputs and cart items remain intact; click retry to proceed.
  5. On confirmation screen, observe Order ID (e.g. `ORD-2026-XXXXXX`), total paid in `₹`, and that cart count in header resets to 0.

## Review Comments & Resolution
- **Reviewer comment (`App.tsx:L125`)**: When order confirmation renders, automatically scroll to the top of the viewport so devotees on mobile or long screens do not remain at the bottom of the page.
- **Resolution**: Added `window.scrollTo({ top: 0, behavior: 'smooth' })` upon confirmation in commit `Address review comment: scroll window to top upon successful order confirmation`.
