import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollTo in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}
