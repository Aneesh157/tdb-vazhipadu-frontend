# PR #1: Feature / P1 – Offerings List

## Problem
Allow devotees to select a temple, view its ritual offerings with prices in rupees, search offerings in real-time, handle inactive offerings, and provide clear loading and error recovery states.

## Assumptions
- Inactive offerings remain visible in the temple catalog for transparency but are clearly labeled with an "Inactive" badge, and their booking button is disabled to prevent ordering.
- Offerings search performs case-insensitive substring matching on offering names, with query trimming to handle accidental whitespaces.
- Retry button invokes the mock API call again while retaining the user's selected temple.

## Decisions & trade-offs
- Used skeleton placeholder cards instead of a generic full-screen spinner to prevent layout shifts during network simulation.
- Rendered rupee prices with the official currency symbol `₹` as required by acceptance criteria.
- Separated `TempleSelector` and `OfferingsList` into reusable components for modular testing and clean separation of concerns.

## How to test
- Commands: `npm test` runs all automated Vitest specs including `OfferingsList.test.tsx`.
- Steps in UI:
  1. Open app at `http://localhost:5173`.
  2. Select "Sabarimala Sree Dharma Sastha Temple" or "Chottanikkara Bhagavathy Temple".
  3. Type "push" in the search bar: observe only Pushpanjali appears and non-matching offerings disappear.
  4. Note that "Padi Pooja" displays "Inactive" with a disabled "Not Available" button.
  5. Test error state by setting network failure rate or observing retry prompt when a failure occurs; click "Try Again".

## Review Comments & Resolution
- **Reviewer comment (`OfferingsList.tsx:L24`)**: When searching offerings, consider trimming leading/trailing whitespaces so queries like `"push "` still match `"Pushpanjali"`.
- **Resolution**: Implemented `.trim().toLowerCase()` in commit `Address review comment: trim search query whitespace to improve matching experience`.
