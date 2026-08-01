"use client";

import { X } from "lucide-react";

export default function ForgotPasswordModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/55 px-3">
      <div className="relative w-full max-w-[590px] bg-white text-black">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 text-white"
        >
          <X size={34} strokeWidth={1.5} />
        </button>

        <div className="bg-black px-7 py-8 text-white sm:px-10">
          <h2 className="text-[20px] font-black uppercase leading-none tracking-[0.04em] sm:text-[30px]">
            Forgot Password
          </h2>

          <p className='mt-5 max-w-[650px] text-[13px] font-bold leading-[18px] font-[SimonMono,"Courier_New",Courier,monospace] sm:text-[15px] sm:leading-[20px]'>
            We’ll send instructions to reset your password to the email below.
          </p>
        </div>

        <div className="px-8 py-9 sm:px-12">
          <label className='block font-[SimonMono,"Courier_New",Courier,monospace] text-[13px] text-[#79786c]'>
            Email*
          </label>

          <input
            type="email"
            className="mt-2 h-10 w-full border-b border-black outline-none"
            autoFocus
          />

          <button className="mt-6 w-full bg-black py-4 text-[15px] font-bold uppercase text-white transition hover:bg-[#79786c]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}