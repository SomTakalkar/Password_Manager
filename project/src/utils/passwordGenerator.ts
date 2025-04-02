import { PasswordGeneratorOptions } from '../types';

const NUMBERS = '0123456789';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = '0O1lI';

export const generatePassword = (options: PasswordGeneratorOptions): string => {
  let chars = '';
  
  if (options.includeLowercase) chars += LOWERCASE;
  if (options.includeUppercase) chars += UPPERCASE;
  if (options.includeNumbers) chars += NUMBERS;
  if (options.includeSymbols) chars += SYMBOLS;
  
  if (options.excludeAmbiguous) {
    chars = chars.split('').filter(char => !AMBIGUOUS.includes(char)).join('');
  }

  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
};

export const calculatePasswordStrength = (password: string): number => {
  // Basic password strength calculation (0-100)
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  return Math.min(100, strength);
};