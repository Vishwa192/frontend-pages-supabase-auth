"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {supabase} from "../../../lib/supabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/signup.css"

export default function Signup() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const [username,setUsername] = useState("")
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async() =>{
    setError('');

    const {data: emailExists} = await supabase.from('users').select('email').eq('email',email).single();

    if(emailExists){
      setError("This email is already registered.Please Login");
      return;
    } 

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(password)){
      setError('Password must be 8 characters long, must contain an uppercase letter, a number, and a special character');
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectURL = `${baseURL}/auth/login`

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectURL,
      },
    });

    
    if(signupError){
      setError(signupError.message);
    }
    else{
      const {error: insertError} = await supabase.from('users').insert({email,username});
      if(insertError){
        setError(insertError.message);
      }else{
        setResponse("Verification email sent. Please check your email and verify")
        // router.push("/auth/login");
      }
    }
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <main className="main-signup">
      <div className="container">
      <h1>Signup</h1>
      <input
        className="signup-input"
        type="text"
        style={{ color: "black" }} 
        placeholder="Username"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className="signup-input"
        type="email"
        style={{ color: "black" }} 
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
       <div className="password-container">
          <input
            className="signup-input password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={{ color: "black" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      {error && <p className="error-message">{error}</p>}
      {response && <p style={{ color: 'green' }}>{response}</p>}
      <button className="signup-button" onClick={handleSignup}>Signup</button>
      <div className="login-link-signup">
        <p>Already a user?
          <Link href="/auth/login">
          <span>Login</span>
          </Link>
           
        </p>
      </div>
      </div>
     
    </main>
  );
}
