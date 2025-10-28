"use client"

import Image from "next/image";
import ba1 from "@/lib/before-after-photos/ba1.jpg";
import ba2 from "@/lib/before-after-photos/ba2.jpg";
import ba3 from "@/lib/before-after-photos/ba3.jpg";
import ba4 from "@/lib/before-after-photos/ba4.jpg";

const SLIDES = [ba1, ba2, ba3, ba4];
const MARQUEE_SLIDES = [...SLIDES, ...SLIDES];

export default function BeforeAfterCarousel() {
  return (
    <section className="w-full py-2 sm:py-4">
      <div className="rounded-3xl border border-primary/10 bg-background shadow-xl sm:p-5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 sm:p-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card/30 to-transparent z-10 sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/30 to-transparent z-10 sm:w-12" />

          <div className="flex h-[120px] w-max items-center gap-3 animate-before-after-marquee [--marquee-duration:48s] sm:h-[140px] sm:gap-4 lg:h-[160px]">
            {MARQUEE_SLIDES.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className="relative flex h-full w-auto overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg"
                aria-hidden={index >= SLIDES.length}
              >
                <Image
                  src={image}
                  alt={`Before and after portrait ${index % SLIDES.length + 1}`}
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
