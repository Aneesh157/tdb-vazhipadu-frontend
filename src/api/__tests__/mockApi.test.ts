import { describe, it, expect, beforeEach } from 'vitest';
import {
  mockApi,
  getTemples,
  getOfferings,
  createOrder,
  getOrders,
  cancelOrder,
} from '../index';

describe('Mock API Service', () => {
  beforeEach(() => {
    // 0% failure rate for deterministic tests
    mockApi.setFailureRate(0);
    mockApi.setDelayRange(10, 30);
    mockApi.resetDatabase();
  });

  it('getTemples returns at least 2 temples', async () => {
    const temples = await getTemples();
    expect(temples.length).toBeGreaterThanOrEqual(2);
    expect(temples[0]).toHaveProperty('id');
    expect(temples[0]).toHaveProperty('name');
  });

  it('getOfferings returns 8-10 offerings for Sabarimala', async () => {
    const offerings = await getOfferings('sabarimala');
    expect(offerings.length).toBeGreaterThanOrEqual(8);
    expect(offerings.some((o) => o.active === false)).toBe(true);
    expect(offerings.some((o) => o.name === 'Pushpanjali')).toBe(true);
  });

  it('createOrder creates an order and returns it', async () => {
    const order = await createOrder({
      templeId: 'sabarimala',
      devoteeName: 'Devotee Test',
      phoneNumber: '9847000000',
      nakshatra: 'Rohini (രോഹിണി)',
      offeringDate: '2026-11-01',
      items: [
        { offeringId: 'sab-pushpanjali', quantity: 2 },
        { offeringId: 'sab-archana', quantity: 1 },
      ],
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe('CONFIRMED');
    // 2 * 30 + 1 * 50 = 110
    expect(order.totalAmount).toBe(110);
    expect(order.items).toHaveLength(2);
  });

  it('disallows booking inactive offerings', async () => {
    await expect(
      createOrder({
        templeId: 'sabarimala',
        devoteeName: 'Devotee Test',
        phoneNumber: '9847000000',
        nakshatra: 'Rohini (രോഹിണി)',
        offeringDate: '2026-11-01',
        items: [{ offeringId: 'sab-padi-pooja', quantity: 1 }],
      })
    ).rejects.toThrow(/inactive/i);
  });

  it('getOrders supports filtering and pagination', async () => {
    const res = await getOrders({ page: 1, limit: 5 });
    expect(res.orders).toHaveLength(5);
    expect(res.total).toBeGreaterThanOrEqual(50);
  });

  it('cancelOrder changes status to CANCELLED', async () => {
    const res = await getOrders({ page: 1, limit: 1 });
    const orderId = res.orders[0].id;
    const cancelled = await cancelOrder(orderId);
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('fails with MockApiNetworkError when failure rate is 100%', async () => {
    mockApi.setFailureRate(1);
    await expect(getTemples()).rejects.toThrow();
  });
});
