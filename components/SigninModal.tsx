"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

export default function SigninModal({
  open,
  onClose,
  onCreateAccountClick,
  onForgotPasswordClick,
}: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      
      }

      setMessage("Login successful");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-3">
      <div className="relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto bg-white text-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 text-white"
        >
          <X size={32} strokeWidth={1.5} />
        </button>

        <div className="bg-black px-6 py-8 text-white sm:px-9 sm:py-10">
          <h2 className="text-[30px] font-black leading-none tracking-tight sm:text-[34px]">
            MEJURI+
          </h2>

          <h3 className="mt-4 text-[22px] font-bold uppercase leading-none sm:text-[26px]">
            Welcome Back
          </h3>

          <p className='mt-5 text-[12px] leading-[18px] font-bold font-[SimonMono,"Courier_New",Courier,monospace] sm:text-[13px] sm:leading-[20px]'>
            Enjoy the fine life with early sale access and birthday treats when
            you're a Mejuri+ member. Sign in to see your perks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-7 sm:px-8">
          <button
            type="button"
            className="flex h-[58px] w-full items-center border border-black px-5 text-[13px] font-bold uppercase tracking-[0.12em] transition hover:bg-gray-100 sm:h-[64px] sm:text-[15px]"
          >
            <FcGoogle className="mr-7 shrink-0 text-[30px] sm:mr-12 sm:text-[34px]" />
            <span className="flex-1 text-center">Continue with Google</span>
          </button>

          <button
            type="button"
            className="mt-4 flex h-[58px] w-full items-center border border-black px-5 text-[13px] font-bold uppercase tracking-[0.12em] transition hover:bg-gray-100 sm:h-[64px] sm:text-[15px]"
          >
            <FaApple className="mr-7 shrink-0 text-[30px] sm:mr-12 sm:text-[34px]" />
            <span className="flex-1 text-center">Signup with Apple</span>
          </button>

          <button
            type="button"
            className="mt-4 flex h-[58px] w-full items-center border border-black px-5 text-[13px] font-bold uppercase tracking-[0.12em] transition hover:bg-gray-100 sm:h-[64px] sm:text-[15px]"
          >
            <FaFacebook className="mr-7 shrink-0 text-[30px] text-[#1877f2] sm:mr-12 sm:text-[34px]" />
            <span className="flex-1 text-center">Continue with Facebook</span>
          </button>

          <div className="my-7 flex items-center gap-5">
            <div className="h-px flex-1 bg-gray-300" />
            <span className='font-[SimonMono,"Courier_New",Courier,monospace] text-[15px]'>
              or
            </span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <label className='block font-[SimonMono,"Courier_New",Courier,monospace] text-[13px] text-[#79786c]'>
            Email*
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-10 w-full border-b border-black outline-none"
          />

          <label className='mt-5 block font-[SimonMono,"Courier_New",Courier,monospace] text-[13px] text-[#79786c]'>
            Password*
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-10 w-full border-b border-black pr-16 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-[13px] font-bold uppercase underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-5 text-center text-[13px] font-bold ${
                message.includes("successful")
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-black py-4 text-[15px] font-bold uppercase text-white transition hover:bg-[#79786c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className='mt-5 flex flex
          -col gap-3 font-bold font-[SimonMono,"Courier_New",Courier,monospace] text-[11px] sm:flex-row sm:items-center sm:justify-between'>
            <p>
              Not a Mejuri+ member?{" "}
              <button
                type="button"
                onClick={onCreateAccountClick}
                className="underline underline-offset-4"
              >
                Join Now
              </button>
            </p>

            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-left underline underline-offset-4"
            >
              Forgot Your Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}