import React, { useState } from 'react';
import { NAKSHATRAS } from '../types';
import { User, Phone, Star, Calendar, AlertCircle } from 'lucide-react';

export interface OrderFormData {
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string;
}

export interface FormErrors {
  devoteeName?: string;
  phoneNumber?: string;
  nakshatra?: string;
  offeringDate?: string;
}

interface OrderFormProps {
  formData: OrderFormData;
  onChange: (field: keyof OrderFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  hasItems: boolean;
  onClearErrors?: () => void;
}

// Helper to get today's date in YYYY-MM-DD in local time
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateOrderForm(data: OrderFormData): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!data.devoteeName.trim()) {
    errors.devoteeName = "Devotee's name is required";
  } else if (data.devoteeName.trim().length < 2) {
    errors.devoteeName = "Name must be at least 2 characters";
  }

  // Phone number validation: Indian phone numbers (10 digits, starts with 6-9, supports optional +91 or 0 prefix)
  let cleanPhone = data.phoneNumber.replace(/[\s-]/g, '');
  if (cleanPhone.startsWith('+91')) {
    cleanPhone = cleanPhone.slice(3);
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = cleanPhone.slice(1);
  }

  if (!cleanPhone) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phoneNumber = 'Enter a valid 10-digit mobile number (e.g. 9847012345)';
  }

  // Nakshatra validation
  if (!data.nakshatra) {
    errors.nakshatra = 'Please select a birth star (nakshatra)';
  }

  // Offering date validation: cannot be in the past
  const today = getTodayDateString();
  if (!data.offeringDate) {
    errors.offeringDate = 'Date of offering is required';
  } else if (data.offeringDate < today) {
    errors.offeringDate = 'Offering date cannot be in the past';
  }

  return errors;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  hasItems,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const today = getTodayDateString();

  const handleBlur = (field: keyof OrderFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validateOrderForm(formData);
    setErrors(validationErrors);
  };

  const handleChange = (field: keyof OrderFormData, value: string) => {
    onChange(field, value);
    if (touched[field]) {
      const updatedData = { ...formData, [field]: value };
      const validationErrors = validateOrderForm(updatedData);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all as touched
    setTouched({
      devoteeName: true,
      phoneNumber: true,
      nakshatra: true,
      offeringDate: true,
    });

    const validationErrors = validateOrderForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-serif-temple text-slate-900">
          Devotee Details (ഭക്തന്റെ വിവരങ്ങൾ)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          The pooja/vazhipadu will be chanted by the priest in this name and birth star.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Order Submission Failed</span>
            <span className="text-xs">{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Devotee Name */}
        <div>
          <label
            htmlFor="devotee-name"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>Devotee Name *</span>
          </label>
          <input
            id="devotee-name"
            type="text"
            required
            disabled={isSubmitting}
            value={formData.devoteeName}
            onChange={(e) => handleChange('devoteeName', e.target.value)}
            onBlur={() => handleBlur('devoteeName')}
            placeholder="e.g. Ramesh Nair"
            aria-required="true"
            aria-invalid={!!errors.devoteeName}
            aria-describedby={errors.devoteeName ? 'devotee-name-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.devoteeName
                ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
          {errors.devoteeName && (
            <p
              id="devotee-name-error"
              role="alert"
              aria-live="polite"
              className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              <span role="alert">{errors.devoteeName}</span>
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone-number"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>Phone Number *</span>
          </label>
          <input
            id="phone-number"
            type="tel"
            required
            disabled={isSubmitting}
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            onBlur={() => handleBlur('phoneNumber')}
            placeholder="10-digit mobile (e.g. 9847012345)"
            aria-required="true"
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'phone-number-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.phoneNumber
                ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
          {errors.phoneNumber && (
            <p
              id="phone-number-error"
              role="alert"
              aria-live="polite"
              className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              <span role="alert">{errors.phoneNumber}</span>
            </p>
          )}
        </div>

        {/* Birth Star (Nakshatra) */}
        <div>
          <label
            htmlFor="nakshatra-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            <Star className="w-3.5 h-3.5 text-amber-600" />
            <span>Birth Star (Nakshatra / നാൾ) *</span>
          </label>
          <select
            id="nakshatra-select"
            required
            disabled={isSubmitting}
            value={formData.nakshatra}
            onChange={(e) => handleChange('nakshatra', e.target.value)}
            onBlur={() => handleBlur('nakshatra')}
            aria-required="true"
            aria-invalid={!!errors.nakshatra}
            aria-describedby={errors.nakshatra ? 'nakshatra-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.nakshatra
                ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
            }`}
          >
            <option value="">-- Choose one of the 27 Nakshatras --</option>
            {NAKSHATRAS.map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
          {errors.nakshatra && (
            <p
              id="nakshatra-error"
              role="alert"
              aria-live="polite"
              className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              <span role="alert">{errors.nakshatra}</span>
            </p>
          )}
        </div>

        {/* Offering Date */}
        <div>
          <label
            htmlFor="offering-date"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Date of Offering *</span>
          </label>
          <input
            id="offering-date"
            type="date"
            min={today}
            required
            disabled={isSubmitting}
            value={formData.offeringDate}
            onChange={(e) => handleChange('offeringDate', e.target.value)}
            onBlur={() => handleBlur('offeringDate')}
            aria-required="true"
            aria-invalid={!!errors.offeringDate}
            aria-describedby={errors.offeringDate ? 'offering-date-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.offeringDate
                ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
          {errors.offeringDate && (
            <p
              id="offering-date-error"
              role="alert"
              aria-live="polite"
              className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              <span role="alert">{errors.offeringDate}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            id="place-order-button"
            type="submit"
            disabled={!hasItems || isSubmitting}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              !hasItems || isSubmitting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-600/20 hover:shadow-md active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Placing Order with Temple...</span>
              </>
            ) : (
              <span>Place Vazhipadu Order</span>
            )}
          </button>
          {!hasItems && (
            <p className="text-center text-xs text-slate-400 mt-2">
              Add at least one offering to the cart to place an order.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
