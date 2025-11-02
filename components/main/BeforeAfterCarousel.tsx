"use client"

import Image from "next/image";

const SLIDES = [
  "/before-after/ba1.jpg",
  "/before-after/g1.jpg",
  "/before-after/ba2.jpg",
  "/before-after/g2.jpg",
  "/before-after/ba3.jpg",
  "/before-after/g3.jpg",
  "/before-after/ba4.jpg",
];
const MARQUEE_SLIDES = [...SLIDES, ...SLIDES];

export default function BeforeAfterCarousel() {
  return (
    <section className="w-full my-3">
      <div className="bg-background shadow-xl sm:p-5">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card/30 to-transparent z-10 sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/30 to-transparent z-10 sm:w-12" />

          <div className="flex h-[120px] w-max items-center gap-2 animate-before-after-marquee [--marquee-duration:48s] sm:h-[140px] sm:gap-4 lg:h-[160px]">
            {MARQUEE_SLIDES.map((imagePath, index) => (
              <figure
                key={`${imagePath}-${index}`}
                className="relative flex h-full w-auto overflow-hidden rounded-sm border border-border/60 bg-card shadow-lg"
                aria-hidden={index >= SLIDES.length}
              >
                <Image
                  src={imagePath}
                  alt={`Before and after portrait ${index % SLIDES.length + 1}`}
                  width={300}
                  height={160}
                  className="h-full w-auto object-contain"
                  draggable={false}
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
