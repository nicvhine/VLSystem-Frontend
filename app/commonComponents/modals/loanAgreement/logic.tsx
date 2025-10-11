/**
 * Format amount as Philippine Peso currency
 * @param amount - Amount to format
 * @returns Formatted currency string or ₱0.00 if invalid
 */
export const formatCurrency = (amount?: number) =>
  amount && !isNaN(amount)
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : "₱0.00";

/**
 * Capitalize all words in a string
 * @param str - String to capitalize
 * @returns Capitalized string or empty string if undefined
 */
export const capitalizeWords = (str?: string) =>
  str?.toUpperCase() || "";

/**
 * Safely add months to a date, handling month-end edge cases
 * @param date - Date to add months to
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonthsSafe(date: string | Date, months: number) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setDate(1);
  d.setMonth(targetMonth);
  const originalDay = new Date(date).getDate();
  const lastDayOfTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  return d;
}

// Interface for application data structure
export interface Application {
  applicationId: string;
  appName: string;
  appAddress?: string;
  appLoanAmount: number;
  appInterest: number;
  loanType: string;
  status: string;
  appLoanTerms: number;
  dateDisbursed: string | Date;
  totalPayable: number;
  appServiceFee: number;
  appNetReleased: number;
}
