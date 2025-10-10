// Handle clearing a loan application
export const handleClearedLoan = async (application: any, setApplications: any, authFetch: any, API_URL: string, showSuccess: (msg: string) => void, showError: (msg: string) => void) => {
    try {
      const id = application?.applicationId;
      if (!id) throw new Error("Missing application id");
  
      await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cleared" }),
      });
  
      setApplications((prev: any[]) =>
        prev.map((app) => app.applicationId === id ? { ...app, status: "Cleared" } : app)
      );
      showSuccess("Loan status has been set to Cleared.");
    } catch (error) {
      console.error(error);
      showError("Something went wrong.");
    }
  };
  
  // Handle disbursing a loan application
  export const handleDisburse = async (application: any, setApplications: any, authFetch: any, API_URL: string, setIsAgreementOpen: any, showSuccess: (msg: string) => void, showError: (msg: string) => void) => {
    try {
      const id = application?.applicationId;
      if (!id) throw new Error("Missing application id");
  
      await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Disbursed" }),
      });
  
      setApplications((prev: any[]) =>
        prev.map((app) => app.applicationId === id ? { ...app, status: "Disbursed" } : app)
      );
  
      setIsAgreementOpen(true);
      showSuccess("Loan status has been set to Disbursed.");
    } catch (error) {
      console.error(error);
      showError("Something went wrong while disbursing the loan.");
    }
  };
  
  // Handle denying a loan application
  export const handleDenyApplication = async (application: any, setApplications: any, authFetch: any, API_URL: string, showSuccess: (msg: string) => void, showError: (msg: string) => void) => {
    try {
      const id = application?.applicationId;
      if (!id) throw new Error("Missing application id");
  
      await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Denied" }),
      });
  
      setApplications((prev: any[]) =>
        prev.map((app) => app.applicationId === id ? { ...app, status: "Denied" } : app)
      );
      showSuccess("Loan status changed to 'Denied'.");
    } catch (error) {
      console.error(error);
      showError("Something went wrong.");
    }
  };
  
  // Handle approving a loan application
  export const handleApproveApplication = async (application: any, setApplications: any, authFetch: any, API_URL: string, showSuccess: (msg: string) => void, showError: (msg: string) => void) => {
    try {
      const id = application?.applicationId;
      if (!id) throw new Error("Missing application id");
  
      const response = await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      if (!response.ok) throw new Error("Failed to update status");
  
      setApplications((prev: any[]) =>
        prev.map((app) => (app.applicationId === id ? { ...app, status: "Approved" } : app))
      );
  
      showSuccess("Application approved.");
    } catch (error) {
      console.error("Failed to approve application:", error);
      showError("Could not approve application. Try again.");
    }
  };
  
  // Handle denying a cleared loan application
  export const handleDenyFromCleared = async (application: any, setApplications: any, authFetch: any, API_URL: string, showSuccess: (msg: string) => void, showError: (msg: string) => void) => {
    try {
      const id = application?.applicationId;
      if (!id) throw new Error("Missing application id");
  
      const response = await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Denied by LO" }),
      });
      if (!response.ok) throw new Error("Failed to update status");
  
      setApplications((prev: any[]) =>
        prev.map((app) => (app.applicationId === id ? { ...app, status: "Denied by LO" } : app))
      );
  
      showSuccess("Application denied.");
    } catch (error) {
      console.error("Failed to deny application:", error);
      showError("Could not deny application. Try again.");
    }
  };
