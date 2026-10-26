# PR #4: Feature / P4 – Orders List

## Problem
Create a dedicated temple staff orders lookup portal to browse submitted vazhipadu orders with offering date, devotee details, offerings list, total in ₹, and status, with comprehensive filtering (status, date), phone number search, pagination that synchronizes with URL parameters (surviving page refresh), and immediate order cancellation with a confirmation modal without page reload.

## Assumptions
- Filters and current page are serialized directly into URL query parameters (`?status=...&date=...&phone=...&page=...`) using `window.history.replaceState`. When the page refreshes, the app restores the exact filters and page number.
- Whenever a filter (such as status) changes, the pagination must automatically reset to page 1 to prevent empty pages if the filtered set has fewer pages.
- Order cancellation updates local component state reactively upon successful API response so the UI immediately shows "CANCELLED" without triggering a page reload.

## Decisions & trade-offs
- Used standard URL search parameters rather than localStorage so that staff members can bookmark or share filtered views (e.g. sharing today's pending orders with another sanctum clerk).
- Designed an accessible confirmation modal dialog with warning details before committing an order cancellation.
- Implemented keyboard accessibility for the cancellation modal including closing via the `Escape` key.

## How to test
- Commands: `npm test` runs all automated Vitest specs including `OrdersList.test.tsx`.
- Steps in UI:
  1. Click "Staff Orders" in the navigation bar.
  2. Select status "CANCELLED": observe that only cancelled orders are shown and page is reset to 1.
  3. Change to page 2, filter by phone number "9847", then refresh the browser (`F5` or `Cmd+R`): observe that the filter values and page 2 are retained.
  4. Click "Cancel Order" on any CONFIRMED order: a modal opens asking for confirmation.
  5. Click "Yes, Cancel Order": observe the status immediately changes to "CANCELLED" in the table without reloading the page.

## Review Comments & Resolution
- **Reviewer comment (`OrdersList.tsx:L26`)**: Ensure cancellation modal supports keyboard navigation, specifically allowing users to dismiss the dialog by pressing the `Escape` key.
- **Resolution**: Added `Escape` key listener in commit `Address review comment: add keyboard Escape dismissal for order cancellation modal`.
