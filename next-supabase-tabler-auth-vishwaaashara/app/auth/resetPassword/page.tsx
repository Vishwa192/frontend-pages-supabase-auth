"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/resetpassword.css";
import { useRouter } from "next/navigation";

export default function resetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    setError("");
    setResponse("");

    if (password != confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8 characters long, must contain an uppercase letter, a number, and a special character"
      );
      return;
    }
    const { error: resetError } = await supabase.auth.updateUser({ password });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResponse("Password reset successful. Please Login");
      setPassword("");
      setConfirmPassword("");
      alert("Password reset successful. Please Login");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleResetPassword();
    }
  };
  return (
    <main className="resetpassword-main">
      <div className="resetpassword-container">
        <h1 className="resetpassword-title">Reset Password</h1>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            className="resetpassword-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="resetpassword-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            onKeyDown={handleKeyDown}
          />
           <button
            type="button"
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {response && <p className="response-message">{response}</p>}
        <button onClick={handleResetPassword} className="resetpassword-button">
          Submit
        </button>
      </div>
    </main>
  );
}
