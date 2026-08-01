"use client";

import { ArrowLeft } from "lucide-react";

export default function PaymentGatewayPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-6">
      <div className="mx-auto max-w-[470px]">
        
        {/* Top Back */}
        <button className="mb-8 flex items-center gap-1 text-[15px] font-semibold text-black">
          <ArrowLeft size={18} strokeWidth={2.2} />
          Login
        </button>

        {/* Heading */}
        <h1 className="mb-8 text-[44px] font-semibold leading-none tracking-[-0.03em] text-black">
          Create an account
        </h1>

        {/* Card */}
        <div className="rounded-[22px] border border-[#9ce8d1] bg-white p-5 shadow-sm sm:p-6">
          
          {/* User Info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#9ce8d1]">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 8L5 12L9 16"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 8L19 12L15 16"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-[24px] font-semibold leading-none text-black">
                  Arbab Memon
                </h3>

                <p className="mt-2 text-[17px] text-[#6b6b6b]">
                  arbabmemondev@gmail.com
                </p>
              </div>
            </div>

            <button className="text-[16px] font-semibold underline">
              Edit
            </button>
          </div>

          {/* Description */}
          <p className="mt-8 text-[18px] leading-[28px] text-black">
            Enter your details to create an account.
          </p>

          {/* Mobile */}
          <div className="mt-7">
            <input
              type="text"
              placeholder="Mobile number"
              className="h-[78px] w-full rounded-[18px] border border-[#d9d9d9] bg-[#fafafa] px-5 text-[22px] outline-none placeholder:text-[#7b7b7b]"
            />
          </div>

          {/* Terms */}
          <button className="mt-4 flex items-center gap-3 text-[15px] font-semibold underline">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[12px] text-white">
              i
            </span>
            Mobile terms and conditions
          </button>

          {/* DOB */}
          <div className="mt-7">
            <input
              type="text"
              placeholder="Date of birth"
              className="h-[78px] w-full rounded-[18px] border border-[#d9d9d9] bg-[#fafafa] px-5 text-[22px] outline-none placeholder:text-[#7b7b7b]"
            />
          </div>

          {/* Address */}
          <div className="mt-7">
            <input
              type="text"
              placeholder="Residential address"
              className="h-[78px] w-full rounded-[18px] border border-[#d9d9d9] bg-[#fafafa] px-5 text-[22px] outline-none placeholder:text-[#7b7b7b]"
            />
          </div>

          {/* Address Help */}
          <button className="mt-3 text-[15px] font-semibold underline">
            Can't find address?
          </button>

          {/* Terms */}
          <p className="mt-7 text-[13px] leading-[22px] text-[#7a7a7a]">
            By continuing, I agree to the{" "}
            <span className="font-semibold underline">Terms of Use</span> and{" "}
            <span className="font-semibold underline">Privacy Policy</span>{" "}
            including consent to electronic communications.
          </p>

          {/* Continue */}
          <button className="mt-8 h-[78px] w-full rounded-[18px] bg-[#9ce8d1] text-[26px] font-semibold text-black transition hover:opacity-90">
            Continue
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[15px] text-black">
          <span>© 2026 Afterpay</span>

          <button className="underline">Terms</button>

          <button className="underline">Privacy policy</button>
        </div>
      </div>
    </div>
  );
}