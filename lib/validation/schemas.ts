/**
 * Centralized Zod validation schemas for API and forms
 *
 * - Use EAC-specific validators for phone/address
 * - Use sanitizeDeep for all string fields
 * - Translate errors using i18n
 * - See usage examples below
 */
import { z } from 'zod';
import { eacValidators } from './eac-validators';
import { sanitizeDeep } from './sanitize';

export const shipmentSchema = z.object({
/**
 * --- USAGE EXAMPLES ---
 *
 * // 1. Validate and sanitize API input (backend)
 * import { shipmentSchema } from './schemas';
 *
 * const result = shipmentSchema.safeParse(req.body);
 * if (!result.success) {
 *   // Handle validation error (see i18n example below)
 * }
 * // result.data is sanitized and safe for DB
 *
 * // 2. Use EAC-specific validators in custom schema
 * import { eacValidators } from './eac-validators';
 *
 * const driverSchema = z.object({
 *   name: z.string().min(2),
 *   phone: eacValidators.phone,
 *   address: eacValidators.address,
 * });
 *
 * // 3. Sanitize arbitrary input (utility)
 * import { sanitizeDeep } from './sanitize';
 * const clean = sanitizeDeep(userInput);
 *
 * // 4. Translate error messages (i18n)
 * import { translateError } from './i18n-errors';
 * const locale = 'fr';
 * const errorMsg = translateError('invalid_email', locale); // => Adresse e-mail invalide.
 *
 * // 5. React form validation hook (frontend)
 * import { useFormValidation } from '../../hooks/use-form-validation';
 * const { values, errors, validate, handleChange } = useFormValidation(shipmentSchema, initialValues);
 * // Use in <input onChange={e => handleChange('reference', e.target.value)} />
 * // Call validate() on submit
 */
  reference: z.string().min(3).transform(sanitizeDeep),
  status: z.enum(['pending', 'in_transit', 'at_border', 'customs', 'delivered', 'cancelled']),
  origin: z.string().min(2).transform(sanitizeDeep),
  destination: z.string().min(2).transform(sanitizeDeep),
  truck: z.string().uuid(),
  driver: z.string().uuid(),
  customer: z.string().uuid(),
  route: z.string().uuid(),
  price: z.number().nonnegative(),
  currency: z.enum(['KES', 'UGX', 'TZS']),
  predictive: z.object({
    delayProbability: z.number().min(0).max(1),
    eta: z.string().datetime().optional(),
    riskScore: z.number().min(0).max(1).optional(),
  }),
});

export const customerSchema = z.object({
  name: z.string().min(2).transform(sanitizeDeep),
  email: z.string().email().transform(sanitizeDeep),
  phone: eacValidators.phone.transform(sanitizeDeep),
  address: eacValidators.address.transform(sanitizeDeep),
});