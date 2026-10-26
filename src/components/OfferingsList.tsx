import React from 'react';
import { Offering } from '../types';
import { Search, AlertCircle, RefreshCw, Plus, Check, XCircle } from 'lucide-react';

interface OfferingsListProps {
  offerings: Offering[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onAddToCart?: (offering: Offering) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartQuantities?: Record<string, number>;
}

export const OfferingsList: React.FC<OfferingsListProps> = ({
  offerings,
  isLoading,
  error,
  onRetry,
  onAddToCart,
  searchQuery,
  onSearchChange,
  cartQuantities = {},
}) => {
  // Filter offerings by name matching searchQuery (case-insensitive and trimmed)
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredOfferings = offerings.filter((offering) =>
    offering.name.toLowerCase().includes(trimmedQuery)
  );

  return (
    <div className="space-y-6">
      {/* Search and Header bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-temple text-slate-900">
            Available Offerings (വഴിപാടുകൾ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select offerings to add to your seva cart
          </p>
        </div>

        {/* Search input with accessible label */}
        <div className="relative w-full sm:w-72">
          <label htmlFor="offering-search" className="sr-only">
            Search offerings by name
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="offering-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search offerings (e.g. Pushpanjali)..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          data-testid="offerings-loading"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-busy="true"
          aria-live="polite"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-3"
            >
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="pt-4 flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-9 bg-slate-200 rounded-lg w-28" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry Button */}
      {!isLoading && error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4"
        >
          <div className="inline-flex p-3 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-900">
              Unable to Load Offerings
            </h3>
            <p className="text-sm text-red-700 mt-1 max-w-md mx-auto">
              {error}
            </p>
          </div>
          <div>
            <button
              id="retry-offerings-button"
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-sm transition-all focus:ring-2 focus:ring-red-500/40"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State when nothing matches */}
      {!isLoading && !error && filteredOfferings.length === 0 && (
        <div
          data-testid="offerings-empty"
          className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-3"
        >
          <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No Offerings Found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any offerings matching "${searchQuery}". Please check your spelling or clear the search.`
              : 'There are currently no offerings available for this temple.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              Clear Search Query
            </button>
          )}
        </div>
      )}

      {/* Offerings Grid */}
      {!isLoading && !error && filteredOfferings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfferings.map((offering) => {
            const inCartCount = cartQuantities[offering.id] || 0;
            const isInactive = !offering.active;

            return (
              <div
                key={offering.id}
                data-testid={`offering-card-${offering.id}`}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-5 ${
                  isInactive
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-base text-slate-900 leading-snug">
                      {offering.name}
                    </h3>
                    {isInactive ? (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        Inactive
                      </span>
                    ) : (
                      <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Available
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {offering.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Offering Fee
                    </span>
                    <span className="text-lg font-bold text-temple-900">
                      ₹{offering.price}
                    </span>
                  </div>

                  <div>
                    {isInactive ? (
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title="Inactive offerings are not offered for booking"
                        className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      >
                        Not Available
                      </button>
                    ) : (
                      <button
                        id={`add-offering-${offering.id}`}
                        type="button"
                        onClick={() => onAddToCart && onAddToCart(offering)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          inCartCount > 0
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                            : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        {inCartCount > 0 ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ({inCartCount})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Offering</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
