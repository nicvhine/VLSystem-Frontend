interface LoginParams {
  username: string;
  password: string;
  onClose: () => void;
  router: any;
  setShowErrorModal?: (show: boolean) => void;
  setErrorMsg?: (msg: string) => void;
  setShowSMSModal?: (show: boolean) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function loginHandler({
  username,
  password,
  onClose,
  router,
  setShowErrorModal,
  setErrorMsg,
}: LoginParams) {
  if (!username || !password) {
    setErrorMsg?.("Please enter both username and password.");
    setShowErrorModal?.(true);
    return;
  }

  try {
    let loggedIn = false;

    // --- Try borrower login ---
    try {
      const borrowerRes = await fetch(`${BASE_URL}/borrowers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (borrowerRes.ok) {
        const data = await borrowerRes.json();
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("fullName", data.fullName || data.name || username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", "borrower");
        data.borrowersId && localStorage.setItem("borrowersId", data.borrowersId);
        data.profilePic && localStorage.setItem("profilePic", data.profilePic);
        data.phoneNumber && localStorage.setItem("phoneNumber", data.phoneNumber);
        data.isFirstLogin
          ? localStorage.setItem("forcePasswordChange", "true")
          : localStorage.removeItem("forcePasswordChange");

        onClose();
        router.push("/userPage/borrowerPage/dashboard");
        loggedIn = true;
        return;
      }
    } catch {
      // silently ignore borrower login errors
    }

    if (!loggedIn) {
      // --- Try staff login ---
      const staffRes = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (staffRes.ok) {
        const data = await staffRes.json();
        const user = data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("fullName", user.name || user.username || user.email);
        localStorage.setItem("email", user.email);
        user.phoneNumber && localStorage.setItem("phoneNumber", user.phoneNumber);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role?.toLowerCase() || "staff");
        localStorage.setItem("darkMode", user.darkMode?.toString() || "false");
        user.profilePic && localStorage.setItem("profilePic", user.profilePic);
        user.userId && localStorage.setItem("userId", user.userId);
        user.isFirstLogin
          ? localStorage.setItem("forcePasswordChange", "true")
          : localStorage.removeItem("forcePasswordChange");

        const redirectMap: Record<string, string> = {
          sysad: "/userPage/sysadPage/dashboard",
          head: "/userPage/headPage/dashboard",
          manager: "/userPage/managerPage/dashboard",
          "loan officer": "/userPage/loanOfficerPage/dashboard",
          collector: "/commonComponents/collection",
        };

        onClose();
        router.push(redirectMap[user.role?.toLowerCase() || ""] || "/");
        loggedIn = true;
        return;
      }
    }

    // --- Show error if neither login worked ---
    if (!loggedIn) {
      setErrorMsg?.("Invalid credentials or user not found.");
      setShowErrorModal?.(true);
    }
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg?.("Error connecting to the server.");
    setShowErrorModal?.(true);
  }
}
