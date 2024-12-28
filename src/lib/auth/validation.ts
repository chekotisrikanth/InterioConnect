import { AUTH_ERRORS, AUTH_CONFIG } from './constants';

export function validateCredentials(email: string, password: string): void {
  if (!email || !password) {
    throw new Error(AUTH_ERRORS.MISSING_CREDENTIALS);
  }
  
  if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters`);
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}