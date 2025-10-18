export const formatCurrency = (amount?: number | string) =>
  amount ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount)) : "₱0.00";

export const capitalizeWords = (text?: string) => {
  if (!text) return "—";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
    : "-";
