"use client";

import emailjs from "emailjs-com";

interface SendEmailParams {
  to_name: string;
  email?: string | null;
  user_username: string;
  user_password: string;
  onError: (msg: string) => void;
}

export const sendEmail = async ({
  to_name,
  email,
  user_username,
  user_password,
  onError,
}: SendEmailParams) => {
  if (!email) return;
  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_RESET_TEMPLATE_ID!,
      { to_name, email, user_username, user_password },
      process.env.NEXT_PUBLIC_EMAILJS_VLSYSTEM_PUBLIC_KEY!
      );
    console.log("Email sent:", result?.text || result);
  } catch (error: any) {
    console.error("EmailJS error:", error);
    onError("Email failed: " + (error?.text || error.message || "Unknown error"));
  }
};
