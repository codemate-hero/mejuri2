import { ShoppingBag } from "lucide-react";
import { Reveal } from "./ui/Reveal";

const shopLookImages = [
  {
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=90",
    position: "object-center",
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1100&q=90",
    position: "object-center",
  },
  {
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1100&q=90",
    position: "object-center",
  },
];

export function ShopTheLook() {
  return (
    <section className="bg-white px-[5.2vw] pb-[92px]">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {shopLookImages.map((item, index) => (
          <Reveal key={index} delay={index * 80}>
            <div className="group relative h-[620px] overflow-hidden bg-neutral-200">
              <img src={item.image} alt="Shop the look" className={`h-full w-full object-cover ${item.position} transition duration-700 group-hover:scale-105`} />
              <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-3 py-1.5 font-mono font-bold text-[12px] uppercase text-black shadow-sm">
                <ShoppingBag className="h-4 w-4" /> SHOP THE LOOK
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
