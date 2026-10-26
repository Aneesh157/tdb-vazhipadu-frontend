# Travancore Devaswom Board – Vazhipadu Booking Frontend (`tdb-vazhipadu-frontend`)

A modern, accessible, and responsive Vazhipadu (temple ritual offering) booking web application built for the Temple Board using **React 18+**, **TypeScript (strict mode)**, **Vite**, **Tailwind CSS**, and **Vitest / React Testing Library**.

---

## 🏛️ Project Overview

In traditional Kerala temples governed by the Devaswom Board, a *Vazhipadu* is a sacred ritual offering performed by priests on behalf of a devotee. The devotee pays a fixed fee, and the priest performs the ritual in the name of the devotee on an auspicious date, incorporating their birth star (*Nakshatra*).

This project implements all five problem requirements (**P1 to P5**) following strict real-world Git and Pull Request discipline:
- Base Vite project on `main`
- 5 individual feature branches (`feature/p1-offerings-list`, `feature/p2-cart-order-form`, `feature/p3-order-confirmation`, `feature/p4-orders-list`, `feature/p5-mobile-accessibility`)
- Small, descriptive commits (no generic commits like `fix`, `wip`, or `changes`)
- Documented PR descriptions adhering to the specification template
- Addressed line-by-line review comments with follow-up commits
- Merged sequentially into `main`

---

## 🛠️ Technology Stack

- **Framework**: React 18+ with TypeScript in strict mode
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom Indian temple color palette (Saffron, Maroon, Gold, Warm Slate)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event`, jsdom
- **Mock Network API**: Typed in-memory network simulator with latency (200–1000ms), 10% configurable failure rate, and seed data for multiple temples, offerings, and 50+ existing orders.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v20.19.0)
- npm 9+ (tested on npm 10.9.7)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Test Suite
```bash
# Run all 29 automated tests
npm test

# Run tests in interactive watch mode
npm run test:watch
```

### 4. Build Production Bundle
```bash
npm run build
```
Runs `tsc` with zero TypeScript errors and generates an optimized production bundle in `dist/`.

---

## 📋 The Five Pull Requests

Each problem was developed on its own dedicated feature branch, reviewed with line-level feedback addressed via follow-up commits, and merged into `main`:

| PR # | Branch | Title & Description | GitHub PR Link | Review Comment Addressed | Status |
|:---:|---|---|:---:|---|:---:|
| **PR #1** | `feature/p1-offerings-list` | Offerings List, Search & Error Retry | [#1](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/1) | Trimmed search query whitespace to prevent mismatches | ✅ Merged |
| **PR #2** | `feature/p2-cart-order-form` | Cart, ₹ Total & Validated Devotee Form | [#2](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/2) | Sanitized phone numbers to support `+91` and `0` prefixes | ✅ Merged |
| **PR #3** | `feature/p3-order-confirmation` | Idempotent Placement & Receipt Confirmation | [#3](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/3) | Smooth scroll to top upon order confirmation screen | ✅ Merged |
| **PR #4** | `feature/p4-orders-list` | Staff Portal, URL Sync & Live Cancellation | [#4](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/4) | Added keyboard `Escape` dismissal for cancellation modal | ✅ Merged |
| **PR #5** | `feature/p5-mobile-accessibility` | 360px Mobile & Keyboard-Only Accessibility | [#5](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/5) | Added `aria-busy` and explicit `aria-disabled` attributes | ✅ Merged |

---

### Detailed PR Summaries

#### 1. [PR #1: Feature / P1 – Offerings List](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/1)
- **Problem**: Devotee selects a temple (Sabarimala, Chottanikkara, Guruvayur) to view offerings with prices in rupees, search offerings in real-time by name, view inactive offerings with disabled booking, and handle loading skeletons and error recovery with retry.
- **Acceptance Criteria Verified**:
  - Typing `"push"` displays Pushpanjali and hides non-matching offerings.
  - Inactive offerings (e.g. seasonal Padi Pooja) display an "Inactive" badge with disabled booking button.
  - Network error displays an alert card with "Try Again" retry action.
- **Review Comment Addressed**: Trimmed search query whitespace to improve matching experience.

#### 2. [PR #2: Feature / P2 – Offering Cart and Order Form](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/2)
- **Problem**: Interactive cart enabling devotees to add offerings, change quantities, remove items, calculate rupee totals, and persist cart contents across page refresh via `localStorage`. Booking form collects devotee name, phone number, nakshatra (dropdown of all 27 stars), and offering date with past date validation and inline error messages.
- **Acceptance Criteria Verified**:
  - 2 Pushpanjali at ₹30 (₹60) and 1 Archana at ₹50 (₹50) calculates total ₹110 in Indian rupees.
  - Form validation displays red inline error messages next to each invalid field.
  - Cart persists across page reloads using `useCart` hook.
- **Review Comment Addressed**: Sanitized phone numbers to support `+91` and leading `0` prefixes gracefully.

#### 3. [PR #3: Feature / P3 – Order Confirmation](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/3)
- **Problem**: Submits orders to the typed mock API (`createOrder`), locks submissions to prevent double-click duplicate orders, preserves cart and form values if network calls fail so users can retry without re-entering data, displays a receipt confirmation screen with the generated order number and total, and empties the cart.
- **Acceptance Criteria Verified**:
  - Double-clicking "Place Vazhipadu Order" triggers `createOrder` exactly once.
  - After simulated network error, cart items and form inputs remain intact; subsequent retry succeeds.
  - Confirmation screen displays Order ID (e.g. `ORD-2026-XXXXXX`) and clears cart.
- **Review Comment Addressed**: Added smooth scrolling to top upon order confirmation.

#### 4. [PR #4: Feature / P4 – Orders List (Staff Portal)](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/4)
- **Problem**: Dedicated temple staff lookup screen to inspect orders with dates, devotee names, offerings, total in ₹, and status (`CONFIRMED`, `PENDING`, `CANCELLED`). Includes status and date filters, phone search, pagination, full URL query parameter synchronization (preserving filters and page across refresh), and immediate order cancellation with a confirmation modal without page reload.
- **Acceptance Criteria Verified**:
  - Filtering by status shows only matching orders and automatically resets to page 1.
  - Refreshing the page preserves current filters and page from URL parameters (`?status=...&page=...`).
  - Cancelled order updates status to `CANCELLED` in the UI immediately without reloading the page.
- **Review Comment Addressed**: Added keyboard `Escape` key listener to dismiss cancellation dialog.

#### 5. [PR #5: Feature / P5 – Mobile and Accessibility](https://github.com/Aneesh157/tdb-vazhipadu-frontend/pull/5)
- **Problem**: Complete responsive design working on 360px wide phone screens without horizontal scrolling, sticky bottom quick-action bar for mobile devotees, 100% mouse-free keyboard navigation flow, proper accessible labels found by `getByLabelText`, live screen reader error announcements (`aria-live="polite"`, `role="alert"`), and WCAG 2.1 AA compliant color contrast.
- **Acceptance Criteria Verified**:
  - No horizontal scrolling at 360px viewport width.
  - Automated test verifies booking flow done entirely via `Tab`, typing, and `Enter` without a mouse.
  - Tests find all form inputs by their accessible labels.
- **Review Comment Addressed**: Added `aria-busy` and explicit `aria-disabled` attributes to submission button for virtual cursor screen readers.

---

## ⌨️ Mouse-Free Keyboard Walkthrough

1. **Focus Temple Picker**: Press `Tab` to navigate to "Select Sacred Temple"; use `Arrow Up`/`Arrow Down` to choose temple.
2. **Search Offerings**: Press `Tab` to "Search offerings by name"; type `"push"`.
3. **Add to Cart**: Press `Tab` to the filtered offering card's "Add to Offering" button; press `Enter` or `Space`.
4. **Devotee Details**:
   - `Tab` into "Devotee Name *"; type your name.
   - `Tab` into "Phone Number *"; type 10-digit mobile number.
   - `Tab` into "Birth Star (Nakshatra) *"; press `Arrow Down` to choose from the 27 stars.
   - `Tab` into "Date of Offering *"; type a future date (`YYYY-MM-DD`).
5. **Submit Order**: `Tab` to "Place Vazhipadu Order"; press `Enter`.
6. **Receipt Confirmation**: Focus moves to the confirmed order screen with Order Number and Print options.

---

## 📂 File Directory Structure

```text
tdb-vazhipadu-frontend/
├── docs/
│   └── prs/
│       ├── PR-1-offerings-list.md
│       ├── PR-2-cart-and-order-form.md
│       ├── PR-3-order-confirmation.md
│       ├── PR-4-orders-list.md
│       └── PR-5-mobile-and-accessibility.md
├── src/
│   ├── api/
│   │   ├── __tests__/
│   │   │   └── mockApi.test.ts          # 7 tests: network simulation, failure rate, seeds
│   │   ├── index.ts                     # MockApiService (getTemples, getOfferings, createOrder, etc.)
│   │   └── mockData.ts                  # Seed data: 2+ temples, offerings, 52 seed orders
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── AccessibilityAndMobile.test.tsx # P5 tests: labels, keyboard flow, 360px
│   │   │   ├── CartAndForm.test.tsx     # P2 tests: ₹110 total, field validations, persistence
│   │   │   ├── OfferingsList.test.tsx   # P1 tests: "push" search, inactive disabled, retry
│   │   │   ├── OrderConfirmation.test.tsx # P3 tests: single order double-click lock, retry
│   │   │   └── OrdersList.test.tsx      # P4 tests: status filter page 1, URL sync, live cancel
│   │   ├── Cart.tsx                     # Line items, +/- quantity controls, ₹ totals
│   │   ├── Navbar.tsx                   # Devaswom Board header & tab navigation
│   │   ├── OfferingsList.tsx            # Offerings grid, search, inactive badge, error/retry
│   │   ├── OrderConfirmation.tsx        # Receipt confirmation card with order ID & print
│   │   ├── OrderForm.tsx                # Devotee details form, 27 Nakshatras, date validation
│   │   ├── OrdersList.tsx               # Staff portal, status/date/phone filters, URL sync
│   │   └── TempleSelector.tsx           # Temple picker dropdown
│   ├── hooks/
│   │   └── useCart.ts                   # Cart state synchronized with localStorage
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces and Nakshatras array
│   ├── App.tsx                          # Root component coordinating booking & staff tabs
│   ├── index.css                        # Tailwind directives and WCAG focus styles
│   ├── main.tsx                         # React 18 StrictMode entry point
│   └── setupTests.ts                    # Jest-DOM matchers & window.scrollTo mock
├── index.html                           # SEO meta tags, temple favicon, Google Fonts
├── package.json                         # Scripts and dependencies
├── postcss.config.js                    # PostCSS configuration
├── tailwind.config.js                   # Temple custom color theme
├── tsconfig.json                        # Strict TypeScript configuration
└── vite.config.ts                       # Vite and Vitest configuration
```
