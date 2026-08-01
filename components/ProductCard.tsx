"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";

export interface Product {
  badge: string;
  name: string;
  price: string;
  material: string;
  colors: string[];
  image: string;
  imageHover: string;
  handle?: string;
  colorVariations?: {
    color: string;
    image: string;
    imageHover: string;
    material?: string;
    price?: number;
  }[]; 
}

  //console.log("REAL PRODUCT CARD LOADED");

export function ProductCard(props: {
  product: Product;
  layout?: "carousel" | "grid";
  onAddClick?: (product: Product) => void;
}) {
  console.log("ALL PROPS:", props);

  const {
    product,
    layout = "carousel",
    onAddClick,
  } = props;

  //console.log("CARD:", product.name, "HAS CALLBACK:", !!onAddClick);

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const currentImage = product.colorVariations
    ? product.colorVariations[selectedColorIndex].image
    : product.image;

  const currentHoverImage = product.colorVariations
    ? product.colorVariations[selectedColorIndex].imageHover
    : product.imageHover;

  const currentMaterial =
    product.colorVariations &&
      product.colorVariations[selectedColorIndex].material
      ? product.colorVariations[selectedColorIndex].material
      : product.material;

  const currentPrice =
    product.colorVariations &&
      product.colorVariations[selectedColorIndex].price
      ? `$${product.colorVariations[selectedColorIndex].price}`
      : product.price;

  const productUrl = product.handle
    ? `/products/${product.handle}`
    : "#";

  // Handle add to cart click
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddClick) {
      // Create a product object with current selected variation
      const productToAdd: Product = {
        ...product,
        price: currentPrice,
        material: currentMaterial,
        image: currentImage,
        imageHover: currentHoverImage,
      };
      onAddClick(productToAdd);
    }
  };

  return (
    <div
      className={
        layout === "carousel"
          ? "w-[calc(50%-10px)] lg:w-[calc(20%-16px)] md:w-[calc(40%-16px)] shrink-0 snap-start"
          : "w-full"
      }
    >
      <div
        className={`relative !bg-[#F8F8F8] overflow-hidden flex flex-col ${layout === "grid"
            ? "h-[420px] md:h-[550px] bg-[#F8F8F8]"
            : "h-[390px] bg-white"
          }`}
      >
        <Link href={productUrl} className="block h-full">
          {product.badge && (
            <span className="absolute right-5 top-4 z-10 text-[14px] uppercase text-[#777]">
              {product.badge}
            </span>
          )}

          <div className="h-[calc(100%-105px)] w-full flex-1">
            <img
              src={isHovered ? currentHoverImage : currentImage}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-150 ease-in-out"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </div>
          <div
            className={`block px-[8px] py-[12px] ${layout === "grid" ? "bg-[#F8F8F8]" : "bg-[#f6f6f6]"
              }`}
          >
            <h3 className="truncate font-display font-normal tracking-[0.05em] text-[12px] uppercase text-[#68675E]">
              {product.name}
            </h3>

            <p className="mt-1  font-display text-[12px] text-[#000000]">
              {currentPrice}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {product.colors.map((color, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorIndex(index);
                  }}
                  className="relative h-2.5 w-2.5 shrink-0 transition-all"
                  style={{ backgroundColor: color }}
                >
                  {selectedColorIndex === index && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-black" />
                  )}
                </button>
              ))}

              <span className="ml-1 truncate font-display font-semibold text-[14px]  tracking-[0.05em] text-[#79786c]">
                {currentMaterial}
              </span>
            </div>
          </div>
        </Link>
        <button
          onClick={handleAddClick}
          className="absolute bottom-[110px] left-1/2 z-20 flex -translate-x-1/2 cursor-pointer items-center gap-1 border border-[#e5e5e5] bg-[#f3f3f3] sm:px-2 sm:py-[2px] p-1 font-display text-[14px] uppercase tracking-[0.02em] text-[#79786c] transition-colors duration-300 hover:text-[#000]"
        >
          <span className="sm:block hidden">Add</span>
          <Plus className="h-3 w-3" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}