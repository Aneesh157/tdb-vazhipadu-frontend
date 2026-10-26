import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { getOrders, cancelOrder } from '../api';
import {
  Search,
  Filter,
  Calendar,
  Phone,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
} from 'lucide-react';

export const OrdersList: React.FC = () => {
  // Read initial values from URL search params
  const getInitialParams = () => {
    if (typeof window === 'undefined') {
      return { status: 'ALL', date: '', phone: '', page: 1 };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      status: params.get('status') || 'ALL',
      date: params.get('date') || '',
      phone: params.get('phone') || '',
      page: parseInt(params.get('page') || '1', 10) || 1,
    };
  };

  const initial = getInitialParams();
  const [statusFilter, setStatusFilter] = useState<string>(initial.status);
  const [dateFilter, setDateFilter] = useState<string>(initial.date);
  const [phoneSearch, setPhoneSearch] = useState<string>(initial.phone);
  const [currentPage, setCurrentPage] = useState<number>(initial.page);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation Modal State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Close cancellation modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && orderToCancel && !isCancelling) {
        setOrderToCancel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderToCancel, isCancelling]);

  // Sync state to URL search parameters
  const updateUrlParams = useCallback(
    (status: string, date: string, phone: string, page: number) => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams();
      if (status && status !== 'ALL') params.set('status', status);
      if (date) params.set('date', date);
      if (phone.trim()) params.set('phone', phone.trim());
      if (page > 1) params.set('page', String(page));

      const newSearch = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newSearch);
    },
    []
  );

  // Fetch orders from mock API
  const fetchOrders = useCallback(
    async (status: string, date: string, phone: string, page: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const query = {
          status: status === 'ALL' ? undefined : status,
          date: date || undefined,
          phoneNumber: phone.trim() || undefined,
          page,
          limit: 8,
        };

        const res = await getOrders(query);
        setOrders(res.orders);
        setTotalOrders(res.total);
        setTotalPages(res.totalPages);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to load temple orders list. Please try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger fetch and sync URL whenever filters or page changes
  useEffect(() => {
    updateUrlParams(statusFilter, dateFilter, phoneSearch, currentPage);
    fetchOrders(statusFilter, dateFilter, phoneSearch, currentPage);
  }, [statusFilter, dateFilter, phoneSearch, currentPage, updateUrlParams, fetchOrders]);

  // Status Filter change: Acceptance Criteria: resets back to page 1
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  // Date Filter change: resets back to page 1
  const handleDateChange = (newDate: string) => {
    setDateFilter(newDate);
    setCurrentPage(1);
  };

  // Phone Search change: resets back to page 1
  const handlePhoneSearchChange = (newPhone: string) => {
    setPhoneSearch(newPhone);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setDateFilter('');
    setPhoneSearch('');
    setCurrentPage(1);
  };

  // Order cancellation with live update without page reload
  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      const updated = await cancelOrder(orderToCancel.id);
      // Update orders in state in-place without reloading page!
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: 'CANCELLED' } : o))
      );
      setOrderToCancel(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to cancel order. Please retry.';
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            CONFIRMED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            PENDING
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            CANCELLED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-temple text-slate-900">
            Temple Staff Order Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lookup, verify, and manage vazhipadu offerings across temples
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(statusFilter, dateFilter, phoneSearch, currentPage)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="status-filter-select"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Status</span>
            </label>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label
              htmlFor="date-filter-input"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Offering Date</span>
            </label>
            <input
              id="date-filter-input"
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Phone Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label
              htmlFor="phone-search-input"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Search by Devotee Phone</span>
            </label>
            <div className="relative">
              <input
                id="phone-search-input"
                type="text"
                placeholder="Search phone number (e.g. 9847)..."
                value={phoneSearch}
                onChange={(e) => handlePhoneSearchChange(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {phoneSearch && (
                <button
                  type="button"
                  onClick={() => handlePhoneSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {(statusFilter !== 'ALL' || dateFilter || phoneSearch) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Active filters: {statusFilter !== 'ALL' && `Status: ${statusFilter} `}
              {dateFilter && `Date: ${dateFilter} `}
              {phoneSearch && `Phone: ${phoneSearch}`}
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-amber-700 hover:underline font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div data-testid="orders-loading" className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div
          role="alert"
          className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3"
        >
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => fetchOrders(statusFilter, dateFilter, phoneSearch, currentPage)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div
          data-testid="orders-empty"
          className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No Orders Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No vazhipadu orders match the selected filters or search criteria.
          </p>
          {(statusFilter !== 'ALL' || dateFilter || phoneSearch) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Order ID & Date</th>
                  <th scope="col" className="py-3 px-4">Devotee Details</th>
                  <th scope="col" className="py-3 px-4">Temple & Offerings</th>
                  <th scope="col" className="py-3 px-4">Total</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    data-testid={`order-row-${order.id}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Date: <strong className="text-slate-800">{order.offeringDate}</strong>
                      </div>
                    </td>

                    {/* Devotee */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-semibold text-slate-900 text-xs">
                        {order.devoteeName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.nakshatra}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        📞 {order.phoneNumber}
                      </div>
                    </td>

                    {/* Offerings list */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-medium text-slate-800 text-[11px]">
                        {order.templeName}
                      </div>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                        {order.items.map((it) => (
                          <li key={it.offeringId}>
                            • {it.offeringName} <span className="text-slate-400">×{it.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 align-top">
                      <span className="font-bold text-temple-900 text-sm">
                        ₹{order.totalAmount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 align-top">
                      <span data-testid={`order-status-${order.id}`}>
                        {getStatusBadge(order.status)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 align-top text-right">
                      {order.status === 'CANCELLED' ? (
                        <span className="text-slate-400 text-[11px] italic">
                          Cancelled
                        </span>
                      ) : (
                        <button
                          type="button"
                          id={`cancel-order-${order.id}`}
                          onClick={() => setOrderToCancel(order)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-xs transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Showing orders <strong>{(currentPage - 1) * 8 + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * 8, totalOrders)}</strong> of{' '}
              <strong>{totalOrders}</strong> total orders
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="pagination-prev"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-semibold text-slate-800">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                id="pagination-next"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {orderToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 id="cancel-modal-title" className="text-lg font-bold text-slate-900">
                Confirm Order Cancellation
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to cancel order <strong>{orderToCancel.id}</strong> booked
                for devotee <strong>{orderToCancel.devoteeName}</strong> on {orderToCancel.offeringDate}?
              </p>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-3 border border-amber-200">
                ⚠️ This ritual offering will be marked as cancelled in the sanctum register.
              </p>
            </div>

            {cancelError && (
              <p className="text-xs text-red-600 font-semibold">{cancelError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                id="confirm-cancel-button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
