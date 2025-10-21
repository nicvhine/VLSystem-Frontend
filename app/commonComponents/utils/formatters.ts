import translations from "../translation";

export const formatCurrency = (amount?: number | string) =>
  amount
    ? new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(Number(amount))
    : "₱0.00";

export const capitalizeWords = (text?: string) => {
  if (!text) return "—";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

export const translateLoanType = (
  type?: string,
  language: "en" | "ceb" = "en"
): string => {
  const t = translations.loanTermsTranslator[language];

  switch (type) {
    case "Regular Loan Without Collateral":
      return t.l1;
    case "Regular Loan With Collateral":
      return t.l2;
    case "Open-Term Loan":
      return t.l3;
    default:
      return type || "—";
  }
};

