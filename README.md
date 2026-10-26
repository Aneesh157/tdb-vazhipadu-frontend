# Travancore Devaswom Board – Vazhipadu Booking Frontend (`tdb-vazhipadu-frontend`)

A modern, accessible, and responsive Vazhipadu (temple offering) booking web application built for the Temple Board using **React 18+**, **TypeScript (strict mode)**, **Vite**, **Tailwind CSS**, and **Vitest / React Testing Library**.

---

## 🏛️ Project Overview

In traditional Kerala temples, a *Vazhipadu* is a ritual offering performed by priests on behalf of a devotee. Devotees select offerings (e.g., Pushpanjali, Archana, Neyyabhishekam), pay a prescribed fee, and provide their name, birth star (*Nakshatra*), and the date of the offering.

This repository implements the five sequential feature specifications (P1 through P5) following strict Git/PR discipline, clean component architecture, comprehensive testing, and accessibility compliance.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 (TypeScript in strict mode), Vite
- **Styling**: Tailwind CSS with custom Indian temple color palette (Saffron, Maroon, Gold, Warm Slate)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event`, jsdom
- **Mock Network API**: Typed in-memory network simulator with latency (200–1000ms), 10% configurable failure rate, and seed data for multiple temples, offerings, and 50+ orders.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm 9+

### Installation & Run

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run Vitest test suite
npm test

# Build production bundle with strict TypeScript verification
npm run build
```

---

## 📋 Problem Implementation Plan & PR Summary

| Phase | Branch | PR Focus | Acceptance Highlights |
|---|---|---|---|
| **Base** | `main` | Initial Vite + TS + Tailwind + Mock API setup | Strict TS, in-memory API with configurable failure rate & seed data |
| **P1** | `feature/p1-offerings-list` | Offerings List & Search | Temple picker, offering cards, search filter, loading/error states, retry |
| **P2** | `feature/p2-cart-order-form` | Cart & Devotee Order Form | Add/remove items, quantity change, ₹ total, localStorage persistence, 27 Nakshatras, date validation |
| **P3** | `feature/p3-order-confirmation` | Order Submission & Confirmation | Double-click prevention, network retry, receipt confirmation screen, cart auto-clearing |
| **P4** | `feature/p4-orders-list` | Temple Staff Order Portal | Filter by date/status, phone search, pagination, URL state sync, order cancellation |
| **P5** | `feature/p5-mobile-accessibility` | Mobile & WCAG AA Accessibility | 360px responsive design, keyboard-only booking flow, ARIA labels & screen reader alerts |

---

## 🧪 Testing

Run all unit and component tests:
```bash
npm test
```
All unit tests run with 0% failure rate for determinism, while specific tests explicitly verify 100% failure handling and recovery.
