import {
  Temple,
  Offering,
  Order,
  CreateOrderRequest,
  GetOrdersQuery,
  PaginatedOrdersResponse,
} from '../types';
import { INITIAL_TEMPLES, INITIAL_OFFERINGS, generateSeedOrders } from './mockData';

class MockApiNetworkError extends Error {
  constructor(message = 'Network request failed. Please check your connection and try again.') {
    super(message);
    this.name = 'MockApiNetworkError';
  }
}

class MockApiService {
  private temples: Temple[] = [...INITIAL_TEMPLES];
  private offerings: Offering[] = [...INITIAL_OFFERINGS];
  private orders: Order[] = generateSeedOrders();
  private failureRate: number = 0.1; // Default 10%
  private minDelayMs: number = 200;
  private maxDelayMs: number = 1000;

  /**
   * Configure the failure rate (e.g. 0.1 for 10%, 0 for deterministic tests)
   */
  public setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate));
  }

  public getFailureRate(): number {
    return this.failureRate;
  }

  /**
   * Set custom simulated delay range (ms)
   */
  public setDelayRange(minMs: number, maxMs: number): void {
    this.minDelayMs = minMs;
    this.maxDelayMs = maxMs;
  }

  /**
   * Reset in-memory database to original seed state
   */
  public resetDatabase(): void {
    this.temples = [...INITIAL_TEMPLES];
    this.offerings = [...INITIAL_OFFERINGS];
    this.orders = generateSeedOrders();
  }

  /**
   * Simulates network latency and random failure rate
   */
  private async simulateNetwork(): Promise<void> {
    const delay =
      Math.floor(Math.random() * (this.maxDelayMs - this.minDelayMs + 1)) +
      this.minDelayMs;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (Math.random() < this.failureRate) {
      throw new MockApiNetworkError();
    }
  }

  /**
   * List temples
   */
  public async getTemples(): Promise<Temple[]> {
    await this.simulateNetwork();
    return [...this.temples];
  }

  /**
   * A temple's offerings
   */
  public async getOfferings(templeId: string): Promise<Offering[]> {
    await this.simulateNetwork();
    const temple = this.temples.find((t) => t.id === templeId);
    if (!temple) {
      throw new Error(`Temple with ID '${templeId}' not found.`);
    }
    return this.offerings.filter((o) => o.templeId === templeId);
  }

  /**
   * Place an order with one or more offerings
   */
  public async createOrder(request: CreateOrderRequest): Promise<Order> {
    await this.simulateNetwork();

    if (!request.templeId) {
      throw new Error('Temple ID is required.');
    }
    if (!request.devoteeName || !request.devoteeName.trim()) {
      throw new Error('Devotee name is required.');
    }
    if (!request.phoneNumber || !request.phoneNumber.trim()) {
      throw new Error('Phone number is required.');
    }
    if (!request.nakshatra || !request.nakshatra.trim()) {
      throw new Error('Birth star (nakshatra) is required.');
    }
    if (!request.offeringDate) {
      throw new Error('Offering date is required.');
    }
    if (!request.items || request.items.length === 0) {
      throw new Error('Order must contain at least one offering.');
    }

    const temple = this.temples.find((t) => t.id === request.templeId);
    if (!temple) {
      throw new Error(`Temple '${request.templeId}' not found.`);
    }

    const orderItems = request.items.map((item) => {
      const offering = this.offerings.find((o) => o.id === item.offeringId);
      if (!offering) {
        throw new Error(`Offering with ID '${item.offeringId}' not found.`);
      }
      if (!offering.active) {
        throw new Error(`Offering '${offering.name}' is inactive and cannot be booked.`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Quantity for '${offering.name}' must be at least 1.`);
      }
      return {
        offeringId: offering.id,
        offeringName: offering.name,
        price: offering.price,
        quantity: item.quantity,
        subtotal: offering.price * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const newOrder: Order = {
      id: newOrderId,
      templeId: temple.id,
      templeName: temple.name,
      devoteeName: request.devoteeName.trim(),
      phoneNumber: request.phoneNumber.trim(),
      nakshatra: request.nakshatra,
      offeringDate: request.offeringDate,
      items: orderItems,
      totalAmount,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // Prepend new order to list
    this.orders.unshift(newOrder);
    return { ...newOrder };
  }

  /**
   * List orders, with filters and pages
   */
  public async getOrders(query: GetOrdersQuery = {}): Promise<PaginatedOrdersResponse> {
    await this.simulateNetwork();

    let filtered = [...this.orders];

    // Filter by offering date
    if (query.date) {
      filtered = filtered.filter((order) => order.offeringDate === query.date);
    }

    // Filter by status (case-insensitive)
    if (query.status && query.status !== 'ALL') {
      const targetStatus = query.status.toUpperCase();
      filtered = filtered.filter((order) => order.status === targetStatus);
    }

    // Search by phone number (substring search)
    if (query.phoneNumber && query.phoneNumber.trim()) {
      const cleanSearch = query.phoneNumber.trim();
      filtered = filtered.filter((order) =>
        order.phoneNumber.includes(cleanSearch)
      );
    }

    const total = filtered.length;
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 8);
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedOrders = filtered.slice(startIndex, startIndex + limit);

    return {
      orders: paginatedOrders,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Cancel an order
   */
  public async cancelOrder(orderId: string): Promise<Order> {
    await this.simulateNetwork();

    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Order with ID '${orderId}' not found.`);
    }

    const order = this.orders[orderIndex];
    if (order.status === 'CANCELLED') {
      throw new Error(`Order '${orderId}' is already cancelled.`);
    }

    const updatedOrder: Order = {
      ...order,
      status: 'CANCELLED',
    };

    this.orders[orderIndex] = updatedOrder;
    return { ...updatedOrder };
  }
}

export const mockApi = new MockApiService();

// Export standalone bound functions matching problem requirements
export const getTemples = () => mockApi.getTemples();
export const getOfferings = (templeId: string) => mockApi.getOfferings(templeId);
export const createOrder = (request: CreateOrderRequest) => mockApi.createOrder(request);
export const getOrders = (query?: GetOrdersQuery) => mockApi.getOrders(query);
export const cancelOrder = (orderId: string) => mockApi.cancelOrder(orderId);
