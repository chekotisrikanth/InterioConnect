import { BudgetRange } from '../types/client';

/**
 * Formats a BudgetRange object into a PostgreSQL int4range string format
 */
export const formatBudgetRange = (range: BudgetRange): string => {
  return `[${range.lower},${range.upper}]`;
};

/**
 * Parses a PostgreSQL int4range string into a BudgetRange object
 * Handles both '[lower,upper]' and '(lower,upper)' formats
 */
export const parseBudgetRange = (range: string): BudgetRange => {
  // Remove brackets/parentheses and split by comma
  const [lower, upper] = range
    .replace(/[\[\]\(\)]/g, '')
    .split(',')
    .map(Number);

  if (isNaN(lower) || isNaN(upper)) {
    throw new Error('Invalid budget range format');
  }

  return { lower, upper };
};