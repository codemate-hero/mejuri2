"use client";

import { ArrowLeft, Info, X } from "lucide-react";
import Image from "next/image";

export default function PaymentGatewayPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 py-6 text-black">
      <div className="mx-auto max-w-[470px]">
        <header className="mb-7">
  <div className="flex items-center justify-between border-b border-[#d6d6d6] pb-8">
    <Image
      src="/AfterPayLogo.png"
      alt="Afterpay"
      width={130}
      height={34}
      className="h-auto w-[130px]"
      priority
    />

    <button type="button" aria-label="Close">
      <X size={25} strokeWidth={2} />
    </button>
  </div>

  
</header>
        {/* <button className="mb-8 mt-5 flex items-center gap-1 text-[15px] font-semibold">
          <ArrowLeft size={18} />
          Login
        </button> */}


        <h1 className="mb-7 text-[24px] font-bold tracking-[-0.03em]" style={{ fontFamily: "Italianplate, Helvetica, Arial, sans-serif" }}>
  Create an account
</h1>

        <div className="rounded-[22px] border border-[#9ce8d1] bg-white p-5 sm:p-6">
  <div className="flex items-start justify-between">
    <div className="flex gap-4">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#9ce8d1] text-[24px]">
        🔗
      </div>

      <div>
        <h3 className="text-[18px] font-bold leading-none text-black">
          Arbab Memon
        </h3>

        <p className="mt-2 text-[15px] text-[#777]">
          arbabmemonddev@gmail.com
        </p>
      </div>
    </div>

    {/* <button className="text-[14px] font-bold underline">
      Edit
    </button> */}
  </div>

  <p className="mt-8 text-[15px] text-black">
    Enter your details to create an account.
  </p>

  <div className="mt-6 space-y-5">

  {/* First Name + Last Name */}
  <div className="flex gap-3">
    <div className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
      <label className="block text-[14px] leading-none text-[#6d6d6d]">First name</label>
      <input type="text" defaultValue="Arbab" className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none" />
    </div>

    <div className="flex-1 rounded-[18px] border border-[#00a67d] bg-white px-5 py-3 ring-1 ring-[#00a67d]">
      <label className="block text-[14px] leading-none text-[#6d6d6d]">Last name</label>
      <input type="text" defaultValue="Memon" className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none" />
    </div>
  </div>

  {/* Mobile + DOB */}
  <div className="flex gap-3">
    <div className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
      <label className="block text-[14px] leading-none text-[#6d6d6d]">Mobile number</label>
      <input type="text" defaultValue="+1 (418) 543-8090" className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none" />
    </div>

    <div className="flex-1 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
      <label className="block text-[14px] leading-none text-[#6d6d6d]">Email Address</label>
      <input type="text" placeholder="example@gmail.com" className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none placeholder:text-[#999]" />
    </div>
  </div>

</div>

  <button className="mt-4 flex items-center gap-2 text-[13px] font-bold underline">
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
      <Info size={12} />
    </span>

    Mobile terms and conditions
  </button>

  {/* DOB */}
  <div className="mt-6 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
    <label className="block text-[14px] leading-none text-[#6d6d6d]">
      Date of birth
    </label>

    <input
      type="text"
      placeholder="MM/DD/YYYY"
      className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none placeholder:text-[#999]"
    />
  </div>

  {/* Address */}
  <div className="mt-5 rounded-[18px] border border-[#d7d7d7] bg-white px-5 py-3 focus-within:border-[#00a67d] focus-within:ring-1 focus-within:ring-[#00a67d]">
    <label className="block text-[14px] leading-none text-[#6d6d6d]">
      Residential address
    </label>

    <input
      type="text"
      className="mt-2 w-full bg-transparent text-[15px] leading-none text-black outline-none"
    />
  </div>

  <button className="mt-3 text-[13px] font-bold underline">
    Can’t find address?
  </button>

  <p className="mt-7 text-[12px] leading-[20px] text-[#777]">
    By continuing, I agree to the{" "}
    <span className="font-bold text-[#2863c9] underline">
      Terms of Use
    </span>{" "}
    and{" "}
    <span className="font-bold text-[#2863c9] underline">
      Privacy Policy
    </span>{" "}
    including consent to electronic communications.
  </p>

 <button
  style={{
    width: "100%",
    padding: "20px 0",
    backgroundColor: "#aef0d8",
    color: "#000",
    fontSize: "18px",
    fontWeight: "700",
    border: "2px solid transparent",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = "#0f6e56"}
  onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
>
  Continue
</button>
</div>
        <div className="mt-12 flex justify-center gap-6 text-[14px] font-semibold">
          <span>© 2026 Afterpay</span>
          <button className="underline">Terms</button>
          <button className="underline">Privacy policy</button>
        </div>
      </div>
    </main>
  );
}