import { z } from 'zod';
import { eacPhoneRegex } from './schemas';

/**
 * EAC-specific Zod validators for phone and address
 *
 * - Use eacValidators.phone for EAC phone numbers
 * - Use eacValidators.address for EAC address format
 * - Extend for other EAC-specific rules as needed
 */
// EAC phone: +2547XXXXXXXX, +2567XXXXXXXX, +2557XXXXXXXX
export const eacPhoneValidator = z.string().refine(
	(val) => eacPhoneRegex.test(val),
	{ message: 'Invalid EAC phone number' }
);

// EAC address: min 5 chars, must contain at least one digit (for street/plot)
export const eacAddressValidator = z.string()
	.min(5, { message: 'Address too short' })
	.refine((val) => /\d/.test(val), { message: 'Address must include a number' });

// Export reusable Zod refinements
export const eacValidators = {
	phone: eacPhoneValidator,
	address: eacAddressValidator,
};