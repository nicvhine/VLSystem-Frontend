const API_URL = "http://localhost:3001/loan-applications";

// Unified function to update loan status
async function handleApiUpdate(
  application: any,
  setApplications: any,
  authFetch: any,
  status: string,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void,
  extraCallback?: () => void
) {
  try {
    const id = application?.applicationId;
    if (!id) throw new Error("Missing application id");

    const res = await authFetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const msg = await safeErrorMessage(res);
      throw new Error(msg || `Failed to update status to ${status}`);
    }

    // Update application state only after success
    setApplications((prev: any[]) =>
      prev.map((app) =>
        app.applicationId === id ? { ...app, status } : app
      )
    );

    if (extraCallback) extraCallback();

    showSuccess(`Loan status has been set to ${status}.`);
  } catch (error: any) {
    console.error(`Failed to set status to ${status}:`, error);
    showError(error?.message || "Something went wrong.");
  }
}

// Individual handlers using the unified function
export const handleClearedLoan = (
  application: any,
  setApplications: any,
  authFetch: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) => handleApiUpdate(application, setApplications, authFetch, "Cleared", showSuccess, showError);

export const handleDisburse = (
  application: any,
  setApplications: any,
  authFetch: any,
  setIsAgreementOpen: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) => handleApiUpdate(
      application,
      setApplications,
      authFetch,
      "Disbursed",
      showSuccess,
      showError,
      () => setIsAgreementOpen(true)
    );

export const handleDenyApplication = (
  application: any,
  setApplications: any,
  authFetch: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) => handleApiUpdate(application, setApplications, authFetch, "Denied", showSuccess, showError);

export const handleApproveApplication = (
  application: any,
  setApplications: any,
  authFetch: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) => handleApiUpdate(application, setApplications, authFetch, "Approved", showSuccess, showError);

export const handleDenyFromCleared = (
  application: any,
  setApplications: any,
  authFetch: any,
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void
) => handleApiUpdate(application, setApplications, authFetch, "Denied by LO", showSuccess, showError);

// Helper: safely parse error messages from Response
async function safeErrorMessage(res: Response | any): Promise<string | undefined> {
  try {
    if (!res) return undefined;
    const contentType = res.headers?.get?.("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return data?.message || data?.error || JSON.stringify(data);
    }
    return await res.text();
  } catch {
    return undefined;
  }
}
