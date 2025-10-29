"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Quote, Star } from "lucide-react"

import { testimonials } from "@/lib/testimonials"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const AUTOPLAY_INTERVAL = 6000

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % testimonials.length)
    }, AUTOPLAY_INTERVAL)

    return () => window.clearInterval(timer)
  }, [])

  if (testimonials.length === 0) {
    return null
  }

  const activeTestimonial = testimonials[activeIndex]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center lg:items-start lg:text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        Loved by customers worldwide
      </div>

      <Card className="w-full border border-primary/10 bg-muted/20 shadow-sm">
        <CardContent
          className="flex flex-col gap-4 p-4 text-left sm:gap-6 sm:p-6"
          aria-live="polite"
        >
          <Quote className="h-6 w-6 text-primary/70 sm:h-7 sm:w-7" />
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {activeTestimonial.quote}
          </p>

          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20 sm:h-20 sm:w-20">
              <Image
                src={activeTestimonial.avatar}
                alt={`${activeTestimonial.name} avatar`}
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground sm:text-base">
                {activeTestimonial.name}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {activeTestimonial.title}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.name}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full border border-primary/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              index === activeIndex
                ? "scale-110 bg-primary"
                : "bg-primary/20 hover:bg-primary/40"
            )}
            aria-label={`Show testimonial from ${testimonial.name}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  )
}
