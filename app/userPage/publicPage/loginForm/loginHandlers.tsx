import emailjs from 'emailjs-com';

interface LoginParams {
  username: string;
  password: string;
  onClose: () => void;
  router: any;
  setShowErrorModal?: (show: boolean) => void;
  setErrorMsg?: (msg: string) => void;
  setShowSMSModal?: (show: boolean) => void;
  setOtpRole?: (role: 'borrower' | 'staff') => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function loginHandler({
  username,
  password,
  onClose,
  router,
  setShowErrorModal,
  setErrorMsg,
  setShowSMSModal,
  setOtpRole,
}: LoginParams): Promise<boolean> {
  if (!username || !password) {
    setErrorMsg?.("Please enter both username and password.");
    setShowErrorModal?.(true);
    return false;
  }

  try {
    // --- Borrower login ---
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
      localStorage.setItem("phoneNumber", data.phoneNumber);
      localStorage.setItem("role", "borrower");
      data.borrowersId && localStorage.setItem("borrowersId", data.borrowersId);
      data.profilePic && localStorage.setItem("profilePic", data.profilePic);
      data.phoneNumber && localStorage.setItem("phoneNumber", data.phoneNumber);
      data.isFirstLogin
        ? localStorage.setItem("forcePasswordChange", "true")
        : localStorage.removeItem("forcePasswordChange");

      // Send OTP via API
      if (data.borrowersId) {
        await fetch(`${BASE_URL}/borrowers/send-login-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ borrowersId: data.borrowersId }),
        });
      }

      setOtpRole?.('borrower');
      setShowSMSModal?.(true);
      return true;
    }

    // --- Staff login ---
    const staffRes = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const staffData = await staffRes.json();

    if (staffRes.ok) {
      const user = staffData.user;
      
      // Debug: Log the user data
      console.log("Staff login successful, user data:", user);
      console.log("User ID:", user.userId);
      
      // Store user info temporarily with "pending" prefix (will be confirmed after OTP)
      localStorage.setItem("pendingToken", staffData.token);
      localStorage.setItem("pendingFullName", user.name || user.username || user.email);
      localStorage.setItem("pendingPhoneNumber", user.phoneNumber || "");
      localStorage.setItem("pendingEmail", user.email);
      localStorage.setItem("pendingUsername", user.username);
      localStorage.setItem("pendingRole", user.role?.toLowerCase() || "staff");
      localStorage.setItem("pendingUserId", user.userId); // IMPORTANT: Store with "pending" prefix
      if (user.profilePic) localStorage.setItem("pendingProfilePic", user.profilePic);
      if (user.isFirstLogin) localStorage.setItem("pendingForcePasswordChange", "true");
      
      // Debug: Verify it was stored
      console.log("Stored pendingUserId:", localStorage.getItem("pendingUserId"));
      console.log("All pending items:", {
        pendingUserId: localStorage.getItem("pendingUserId"),
        pendingEmail: localStorage.getItem("pendingEmail"),
        pendingRole: localStorage.getItem("pendingRole")
      });

      // Backend generates OTP and stores it, returns the OTP code
      const otpRes = await fetch(`${BASE_URL}/users/generate-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId }),
      });

      const otpData = await otpRes.json();
      
      if (!otpRes.ok) {
        throw new Error("Failed to generate OTP");
      }

      // Send OTP via EmailJS (frontend only)
      const templateParams = {
        to_email: user.email,
        passcode: otpData.otp, // OTP from backend
        time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString(),
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_OTP_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_PUBLIC_KEY!
      );

      // Don't store OTP anywhere on frontend!
      setOtpRole?.('staff');
      setShowSMSModal?.(true);
      return true;
    }

    // --- If both fail ---
    setErrorMsg?.(staffData.error || "Invalid credentials or user not found.");
    setShowErrorModal?.(true);
    return false;
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg?.("Error connecting to the server.");
    setShowErrorModal?.(true);
    return false;
  }
}