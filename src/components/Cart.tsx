import React from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (offeringId: string, quantity: number) => void;
  onRemoveItem: (offeringId: string) => void;
  onClearCart?: () => void;
  onProceedToForm?: () => void;
  isSubmitting?: boolean;
}

export const Cart: React.FC<CartProps> = ({
  items,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToForm,
  isSubmitting = false,
}) => {
  return (
    <div
      data-testid="cart-container"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-temple-900 to-temple-800 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <h2 className="font-semibold font-serif-temple text-base tracking-wide text-amber-50">
            Offering Cart (വഴിപാട് കുട്ട)
          </h2>
        </div>
        {items.length > 0 && onClearCart && (
          <button
            type="button"
            onClick={onClearCart}
            disabled={isSubmitting}
            className="text-xs text-amber-200/80 hover:text-white transition-colors underline disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="p-5 flex-1">
        {items.length === 0 ? (
          <div
            data-testid="cart-empty"
            className="text-center py-10 space-y-2 text-slate-500"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Your cart is empty</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Select sacred offerings from the list above to add them to your booking.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ul
              data-testid="cart-items-list"
              className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1"
            >
              {items.map((item) => {
                const lineTotal = item.offering.price * item.quantity;
                return (
                  <li
                    key={item.offering.id}
                    data-testid={`cart-line-${item.offering.id}`}
                    className="py-3 flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 truncate">
                        {item.offering.name}
                      </h3>
                      <div className="text-xs text-slate-500">
                        ₹{item.offering.price} each
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.offering.name}`}
                        disabled={isSubmitting}
                        onClick={() =>
                          onUpdateQuantity(item.offering.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span
                        data-testid={`quantity-${item.offering.id}`}
                        className="w-7 text-center font-semibold text-slate-900 text-xs"
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.offering.name}`}
                        disabled={isSubmitting}
                        onClick={() =>
                          onUpdateQuantity(item.offering.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-[4rem]">
                      <span className="font-semibold text-slate-900 block">
                        ₹{lineTotal}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label={`Remove ${item.offering.name} from cart`}
                      disabled={isSubmitting}
                      onClick={() => onRemoveItem(item.offering.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Total Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">Total Offering Fee:</span>
                <span
                  data-testid="cart-total-amount"
                  className="text-xl font-bold text-temple-900 font-serif-temple"
                >
                  ₹{totalAmount}
                </span>
              </div>

              {onProceedToForm && (
                <button
                  type="button"
                  onClick={onProceedToForm}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Devotee Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
