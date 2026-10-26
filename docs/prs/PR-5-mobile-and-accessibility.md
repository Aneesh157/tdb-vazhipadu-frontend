# PR #5: Feature / P5 – Mobile and Accessibility

## Problem
Ensure that the vazhipadu booking application works on a 360px wide phone screen without horizontal scrolling, supports a 100% mouse-free keyboard booking flow, provides accessible labels and screen reader error announcements (`aria-describedby`, `role="alert"`, `aria-live="polite"`), and meets WCAG 2.1 AA color contrast standards.

## Assumptions
- Mobile viewports (360px wide, e.g. Samsung Galaxy S8 / small mobile devices) require fluid responsive containers (`w-full`, responsive typography, wrapping headers) without any clipped text or horizontal overflow.
- A devotee using only a keyboard or screen reader can complete the entire journey: selecting offerings, updating cart, filling out devotee details, and placing an order without touching a mouse.
- Form inputs have associated `<label htmlFor="...">` elements allowing test tools (`getByLabelText`) and assistive devices to announce input requirements accurately.

## Decisions & trade-offs
- Added high-contrast accessible focus outlines (`focus-visible:ring-2 focus-visible:ring-amber-500`) to ensure visible keyboard focus across all interactive elements.
- Implemented a floating quick-access summary bar at the bottom of the screen on small viewports (< `lg`) that activates when items are added to the cart, guiding mobile users directly to the devotee booking form.
- Added live region announcements (`aria-live="polite"`, `role="alert"`, `aria-invalid="true"`) to form errors.

## Keyboard Walkthrough (Mouse-free Booking Flow)
The entire vazhipadu booking flow can be completed using standard keyboard controls alone:
1. **Temple Selection**: Press `Tab` to reach the "Select Sacred Temple" dropdown; use `Down Arrow` / `Up Arrow` to choose a temple.
2. **Offerings Search**: Press `Tab` to move to the "Search offerings by name" input; type `"push"` to filter.
3. **Add Offering to Cart**: Press `Tab` to move focus to the "Add to Offering" button for Pushpanjali; press `Enter` or `Space` to add to cart.
4. **Devotee Details Form**:
   - Press `Tab` to reach "Devotee Name *"; type `"Ramesh Nair"`.
   - Press `Tab` to reach "Phone Number *"; type `"9847012345"`.
   - Press `Tab` to reach "Birth Star (Nakshatra / നാൾ) *"; press `Down Arrow` to select `"Rohini (രോഹിണി)"`.
   - Press `Tab` to reach "Date of Offering *"; type a future date (e.g. `"2026-12-01"`).
5. **Place Order**: Press `Tab` to focus "Place Vazhipadu Order"; press `Enter` to submit.
6. **Confirmation Screen**: Focus shifts to the confirmation screen with the generated Order ID, total in ₹, and action buttons ("Print Receipt", "Book Another Offering").

## How to test
- Commands: `npm test` runs all automated Vitest specs including `AccessibilityAndMobile.test.tsx`.
- Steps in UI:
  1. Open Chrome DevTools (`F12`), toggle Device Toolbar, and select **Responsive: 360px × 740px**.
  2. Scroll vertically through the offerings list, cart, and order form: observe **no horizontal scrolling**.
  3. Disconnect or ignore your mouse; use `Tab`, `Shift+Tab`, `Arrow keys`, and `Enter` to book an offering.
  4. Inspect all form inputs to verify labels are associated via `id` and `htmlFor`.

## Review Comments & Resolution
- **Reviewer comment (`OrderForm.tsx:L128`)**: For screen reader users navigating using virtual cursor, ensure the form submission button announces its disabled state explicitly when the cart is empty or when an order is being transmitted.
- **Resolution**: Added `aria-disabled` and `aria-busy` to submit button in commit `Address review comment: add aria-busy and explicit aria-disabled attributes to submit button`.
