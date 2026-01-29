/**
 * React hook for Zod-based form validation
 *
 * - Use with centralized Zod schemas
 * - Returns values, errors, validate, handleChange
 * - Integrate with i18n for error messages
 */
import { useCallback } from 'react';
import { z, ZodSchema } from 'zod';
import { useState } from 'react';

export interface ValidationResult<T> {
  values: T;
  errors: Record<string, string>;
  isValid: boolean;
}

export function useFormValidation<T>(schema: ZodSchema<T>, initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: Partial<T> = values): ValidationResult<T> => {
    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      return { values: result.data, errors: {}, isValid: true };
    } else {
      const errs: Record<string, string> = {};
      for (const err of result.error.errors) {
        errs[err.path.join('.')] = err.message;
      }
      setErrors(errs);
      return { values: data as T, errors: errs, isValid: false };
    }
  }, [schema, values]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { values, setValues, errors, validate, handleChange };
}
