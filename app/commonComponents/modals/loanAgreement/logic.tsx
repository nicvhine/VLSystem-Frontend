export const formatCurrency = (amount?: number) =>
  amount && !isNaN(amount)
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    : "₱0.00";

export const capitalizeWords = (str?: string) =>
  str?.toUpperCase() || "";

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
