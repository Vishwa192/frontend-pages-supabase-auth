"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
// import "../styles/home.css"

export default function Home() {
  const router = useRouter();

  const handleSignup = () =>{
    router.push("/auth/signup/")
  }
  return (
    <main className="main flex min-h-screen flex-col justify-center items-center bg-[black] p-5 font-sans">
      <h1 className="title text-[2.5rem] font-bold text-[white] mb-5">WELCOME TO <span className="span-tag text-[rgba(255,201,6,0.875)]">SOLVATIVE </span>!</h1>
      <div className="navgation-buttons ">
        <Link href = "/auth/login">
          <button className="login-button inline-block text-[white] bg-[#3b83f6] no-underline transition-[background-color] duration-[0.3s] mx-2 my-0 px-6 py-3 rounded-lg hover:bg-[#1a4bb6]">Login</button>
        </Link>
      
          <button onClick={handleSignup} className="signup-button inline-block text-[white] bg-[#3b83f6] no-underline transition-[background-color] duration-[0.3s] mx-2 my-0 px-6 py-3 rounded-lg hover:bg-[#1a4bb6]">Signup</button>
      </div>
    </main>
  );
}
