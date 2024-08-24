"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import "../../../styles/forgotpassword.css";
import { env } from "process";

export default function forgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");

  const handleForgotPassword = async () => {
    setError('');
    const { data: emailExists } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (!emailExists) {
      setError("Invalid Email, Please enter a valid email");
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectURL = `${baseURL}/auth/resetPassword`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL,
    });

    if (error) {
      setError(error.message);
    } else {
      setResponse("Password reset email sent..");
    }
  };
  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleForgotPassword();
    }
  };
  return (
    <main className="forgotpassword-main">
      <div className="forgotpassword-container">
        <h1 className="forgotpassword-title">Forgot Password</h1>
        <input
          type="email"
          className="forgotpassword-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          onKeyDown={handleKeyDown}
        />
        {error && <p className="error-message">{error}</p>}
        {response && <p className="response-message">{response}</p>}
        <button
          onClick={handleForgotPassword}
          className="forgotpassword-button"
        >
          Send Reset link
        </button>
      </div>
    </main>
  );
}
