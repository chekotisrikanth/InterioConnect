export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  SERVER_ERROR: 'Server error. Please try again later.',
  MISSING_CREDENTIALS: 'Email and password are required',
  USER_NOT_FOUND: 'User not found',
  PROFILE_NOT_FOUND: 'User profile not found',
  AUTH_FAILED: 'Authentication failed',
  VALIDATION_ERROR: 'Please check your input and try again',
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  DEFAULT_ADMIN_EMAIL: 'admin@interiormatch.com',
  DEFAULT_ADMIN_PASSWORD: 'Admin123!'
} as const;