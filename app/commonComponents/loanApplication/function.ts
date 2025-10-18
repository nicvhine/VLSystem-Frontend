import { Application, Language } from './types';

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const collectableAmount = (principal: number, interestRate: number, termMonths: number) => {
  const termYears = termMonths / 12;
  const total = principal + principal * (interestRate / 100) * termYears;
  return formatCurrency(total);
};

export function filterApplications(
  applications: Application[],
  searchQuery: string,
  activeFilter: string
) {
  return applications
    .map((application) => ({
      ...application,
      displayStatus:
        application.status === "Endorsed" ? "Pending" : application.status,
    }))
    .filter((application) => {
      const matchesSearch = Object.values({
        ...application,
        status: application.displayStatus,
      }).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (!matchesSearch) return false;
      if (activeFilter === "All") return true;

      return application.displayStatus === activeFilter;
    });
};
