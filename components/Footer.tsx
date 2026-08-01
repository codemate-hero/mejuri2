import { SustainabilityBand } from "@/components/SustainabilityBand";

export function Footer() {
  const groups = [
    ["Help", "FAQs", "Order Status", "Shipping & Delivery", "Returns & Exchanges", "Warranty", "Contact Us", "Help Code"],
    ["Stores & Services", "Our Stores", "Piercing Services Near You", "Piercing Aftercare", "Corporate Events & Gifting"],
    ["Resources", "Jewelry Care", "Our Materials", "Size Guides", "How To Guides", "Blogs", "Mejuri + Terms & Conditions"],
    ["About Mejuri", "Our Mission", "Sustainability", "Commitments", "Modern Slavery Policy", "Accessibility Statement", "Supplier Code Of Conduct", "Careers"],
  ];

  return (
    <>
      <SustainabilityBand />
      <footer className="bg-white text-black">
        <div className="grid gap-10 px-[5.2vw] sm:py-16 py-8 xl:grid-cols-[0.75fr_1fr]">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {groups.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="mb-6 font-display text-[14px] font-semibold">{title}</h3>
                <div className="space-y-4 font-display text-[13px] font-normal">
                  {links.map((link) => <a key={link} href="#" className="block hover:underline">{link}</a>)}
                </div>
              </div>
            ))}
            <div className="xl:hidden lg:block col-span-2 flex flex-col md:justify-center md:items-center">
              <h3 className="mb-8 font-display text-[14px] font-bold">Our Certifications And Partnerships</h3>
              <img
                src="https://res.cloudinary.com/mejuri-com/image/upload/v1752760519/certifications-parternship_logos_frtvgx.png"
                alt="Certifications and Partnerships"
                className="w-full max-w-[300px]"
              />
            </div>
          </div>

          <div className="xl:block hidden ">
            <h3 className="mb-8 font-display text-[14px] font-bold">Our Certifications And Partnerships</h3>
            <img
              src="https://res.cloudinary.com/mejuri-com/image/upload/v1752760519/certifications-parternship_logos_frtvgx.png"
              alt="Certifications and Partnerships"
              className="w-full max-w-[300px]"
            />
          </div>
        </div>
        <div className="border-t border-black/10  px-[5.2vw] py-12">
          <div className="flex flex-row items-center gap-[10px] flex-wrap">
            <div className="w-fit">
              <h3 className="font-display text-[16px] font-bold">MEJURI+ &nbsp; BECOME A MEMBER</h3>
              <p className="mt-2 font-display text-[13px] leading-6">Join Mejuri+ for free and discover exclusive access to our biggest drops, promotions, members-only products, and more.</p>
            </div>
            <a href="#" className="flex h-12 items-center w-fit justify-center border border-black px-8 font-display text-[13px] font-bold uppercase hover:bg-black hover:text-white transition">JOIN NOW FOR FREE</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 bg-black px-[5.2vw] py-4 font-display text-[11px] text-white lg:flex-row lg:items-center lg:justify-between">
          <p>Country & Language: &nbsp; Rest Of World (USD) | English</p>
          <p>Privacy Policy &nbsp;&nbsp; Terms And Conditions &nbsp;&nbsp; © 2025 Mejuri Inc</p>
        </div>
      </footer>
    </>
  );
}
