// ProductImageSwiper.tsx
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import ZoomInButton from './ZoomInButton';
import './product_image_swiper.css'

interface ProductImageSwiperProps {
  images: Array<{
    src: string;
    width?: number;
    height?: number;
  }>;
  productTitle?: string;
  className?: string;
}

export const ProductImageSwiper: React.FC<ProductImageSwiperProps> = ({
  images,
  productTitle = 'Product',
  className = ''
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const swiperRef = useRef<any>(null);

  // Handle zoom toggle on button click
  const handleZoomToggle = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      const zoom = swiper.zoom;
      if (zoom.scale > 1) {
        zoom.out();
        setIsZoomed(false);
      } else {
        zoom.in();
        setIsZoomed(true);
      }
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
     <Swiper
        ref={swiperRef}
        scrollbar={{
          hide: false,
          draggable: true,
        }}
        modules={[Scrollbar, Zoom]}
        zoom={{
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
        }}
        speed={600}
        onZoomChange={(swiper, scale) => {
          setIsZoomed(scale > 1);
        }}
        className={`relative lg:min-h-[700px] lg:h-[calc(100vh-118px)] product-swiper-mobile  w-full ${className}`}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            <div className="swiper-zoom-container h-full w-full">
              <img
                src={image.src}
                alt={`${productTitle} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Zoom Button with toggle functionality */}
            <button
              onClick={handleZoomToggle}
              className="absolute bottom-4 right-4 cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomInButton
                size={25}
                opacity={0.4}
                isZoomed={isZoomed}
              />
            </button>

            {/* Zoom hint */}
            {isZoomed && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 text-sm text-white rounded animate-fadeIn">
                Tap to zoom out
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
  );
};

export default ProductImageSwiper;