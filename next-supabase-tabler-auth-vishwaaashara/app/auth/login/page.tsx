"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {supabase} from "../../../lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/login.css"

export default function login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleLogin = async () =>{
    const {error} =await supabase.auth.signInWithPassword({email,password});
    if(error){
      setError(error.message);
    }
    else{
      router.push("/auth/search");
    }
  };
  const handleForgotPassword = () => {
    router.push('/auth/forgotPassword')
  }
  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <main className="main-login">
      <div className="container">
      <h1>Login</h1>
      <input
        className="login-input"
        type="email"
        style={{ color: "black" }} 
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="password-container">
      <input 
        className="login-input password-input" 
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        style={{ color: "black" }} 
        value={password}
        onChange={(e)=>setPassword(e.target.value)} 
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
      <div className="forgot-password-login">
        <p onClick={handleForgotPassword}>Forgot Password</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin} className="login-button">Login</button>
      <div className="login-link-signup">
        <p>Not a user?  
          <Link href="/auth/signup">
             <span>Signup</span>
          </Link>
           
        </p>
      </div>
      </div>
     
    </main>
  );
}
