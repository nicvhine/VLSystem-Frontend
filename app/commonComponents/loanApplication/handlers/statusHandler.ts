export const handleClearedLoan = async (application: any, setApplications: any, authFetch: any, API_URL: string) => {
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
      alert("Loan status has been set to Cleared.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };
  
  export const handleDisburse = async (application: any, setApplications: any, authFetch: any, API_URL: string, setIsAgreementOpen: any) => {
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
    } catch (error) {
      console.error(error);
      alert("Something went wrong while disbursing the loan.");
    }
  };
  
  export const handleDenyApplication = async (application: any, setApplications: any, authFetch: any, API_URL: string) => {
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
      alert("Loan status changed to 'Denied'.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };
  
  export const handleApproveApplication = async (application: any, setApplications: any, authFetch: any, API_URL: string) => {
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
  
      alert("Application approved.");
    } catch (error) {
      console.error("Failed to approve application:", error);
      alert("Could not approve application. Try again.");
    }
  };
  
  export const handleDenyFromCleared = async (application: any, setApplications: any, authFetch: any, API_URL: string) => {
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
  
      alert("Application denied.");
    } catch (error) {
      console.error("Failed to deny application:", error);
      alert("Could not deny application. Try again.");
    }
  };
  