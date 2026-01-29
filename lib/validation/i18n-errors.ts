import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import sw from '../../messages/sw.json';

type Locale = 'en' | 'fr' | 'sw';

const errorMap: Record<Locale, Record<string, string>> = {
  en: {
    required: 'This field is required.',
    invalid_email: 'Invalid email address.',
    invalid_phone: 'Invalid EAC phone number.',
    min: 'Too short.',
    max: 'Too long.',
    ...((en.errors as any) || {})
  },
  fr: {
    required: 'Ce champ est requis.',
    invalid_email: 'Adresse e-mail invalide.',
    invalid_phone: 'Numéro de téléphone EAC invalide.',
    min: 'Trop court.',
    max: 'Trop long.',
    ...((fr.errors as any) || {})
  },
  sw: {
    required: 'Sehemu hii inahitajika.',
    invalid_email: 'Barua pepe si sahihi.',
    invalid_phone: 'Nambari ya simu ya EAC si sahihi.',
    min: 'Fupi sana.',
    max: 'Ndefu sana.',
    ...((sw.errors as any) || {})
  },
};

export function translateError(key: string, locale: Locale = 'en'): string {
  return errorMap[locale][key] || key;
}

// Example: translateError('invalid_email', 'fr')