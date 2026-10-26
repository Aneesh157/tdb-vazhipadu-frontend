import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Calendar, User, Phone, Star, Landmark, Printer, PlusCircle } from 'lucide-react';

interface OrderConfirmationProps {
  order: Order;
  onReset: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onReset,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      data-testid="order-confirmation-screen"
      className="bg-white rounded-3xl border border-amber-900/10 shadow-xl overflow-hidden max-w-2xl mx-auto animate-fade-in"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 mb-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-300 animate-bounce" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-temple tracking-wide text-emerald-50">
          Vazhipadu Booking Confirmed!
        </h2>
        <p className="text-emerald-100/80 text-xs sm:text-sm mt-1">
          May the divine blessings bring peace, prosperity, and health to your family.
        </p>

        {/* Highlighted Order ID Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-emerald-100 text-xs font-mono">
          <span>Order Number:</span>
          <strong
            data-testid="confirmation-order-id"
            className="text-amber-300 font-bold tracking-wider"
          >
            {order.id}
          </strong>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Devotee & Temple Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block">Temple</span>
              <strong className="text-slate-900 text-sm font-serif-temple">
                {order.templeName}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block">Offering Date</span>
              <strong className="text-slate-900 text-sm">{order.offeringDate}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block">Devotee Name</span>
              <strong className="text-slate-900 text-sm">{order.devoteeName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block">Birth Star (Nakshatra)</span>
              <strong className="text-slate-900 text-sm">{order.nakshatra}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-slate-500 block">Contact Phone</span>
              <strong className="text-slate-900 text-sm">{order.phoneNumber}</strong>
            </div>
          </div>
        </div>

        {/* Itemized Offerings List */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Booked Offerings (വഴിപാടുകൾ)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-sm">
            {order.items.map((item) => (
              <div
                key={item.offeringId}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {item.offeringName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </div>
                </div>
                <div className="font-bold text-slate-900">
                  ₹{item.subtotal}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className="p-4 bg-slate-50 flex items-center justify-between text-base">
              <span className="font-bold text-slate-800">Total Paid:</span>
              <span
                data-testid="confirmation-total-amount"
                className="font-bold text-xl text-temple-900 font-serif-temple"
              >
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            id="book-another-offering-btn"
            type="button"
            onClick={onReset}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Another Offering</span>
          </button>
        </div>
      </div>
    </div>
  );
};
