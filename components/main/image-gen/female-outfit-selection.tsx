"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { outfits as femaleOutfits } from "@/lib/female_outfits"
import Image from "next/image"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FemaleOutfitSelection({ outfit, setOutfit }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectedOutfit = femaleOutfits.find((o) => o.text === outfit)
  const selectedIndex = femaleOutfits.findIndex((o) => o.text === outfit)

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll)
      return () => scrollEl.removeEventListener("scroll", checkScroll)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedIndex === -1) return

      let newIndex = focusedIndex
      if (e.key === "ArrowRight") {
        e.preventDefault()
        newIndex = Math.min(focusedIndex + 1, femaleOutfits.length - 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        newIndex = Math.max(focusedIndex - 1, 0)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOutfit(femaleOutfits[focusedIndex].text)
        return
      } else if (e.key === "Home") {
        e.preventDefault()
        newIndex = 0
      } else if (e.key === "End") {
        e.preventDefault()
        newIndex = femaleOutfits.length - 1
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex)
        // Scroll to focused item
        const buttons = scrollRef.current?.querySelectorAll("button")
        if (buttons && buttons[newIndex]) {
          buttons[newIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, setOutfit])

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full">
        <CardHeader className="pb-2 md:pb-4 p-3 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <CardTitle className="text-sm md:text-base">Female Outfit Style</CardTitle>
            </div>
            {selectedOutfit && (
              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-[10px] md:text-xs">
                  {selectedOutfit.category}
                </Badge>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline-flex">
                  {selectedIndex + 1} of {femaleOutfits.length}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-4 lg:p-6">
          <div className="relative">
            {/* Left scroll indicator */}
            {showLeftArrow && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 flex items-center">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {/* Right scroll indicator */}
            {showRightArrow && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            <ScrollArea className="w-full rounded-md whitespace-nowrap" ref={scrollRef}>
              <div className="flex w-max gap-2 md:gap-3 pb-2 md:pb-3">
                {femaleOutfits.map((set, index) => (
                  <Tooltip key={set.name}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setOutfit(set.text)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(-1)}
                        className={cn(
                          "shrink-0 group rounded-lg border-2 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation",
                          "hover:shadow-md md:hover:scale-105 hover:border-primary/50",
                          set.text === outfit
                            ? "border-primary bg-primary/5 shadow-sm md:scale-105"
                            : "border-border bg-background",
                          focusedIndex === index && "ring-2 ring-primary ring-offset-2"
                        )}
                        aria-label={`Select ${set.label}`}
                        aria-pressed={set.text === outfit}
                      >
                        <div className="relative w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24">
                          <Image
                            className="transition-opacity duration-200 group-hover:opacity-90 w-full h-full object-cover"
                            src="/bg.jpg"
                            width="96"
                            height="96"
                            alt={set.label}
                          />
                          {/* Category badge */}
                          <div className="absolute top-0.5 left-0.5 md:top-1 md:left-1">
                            <Badge variant="secondary" className="text-[8px] md:text-[10px] px-1 py-0 md:px-1.5 md:py-0.5 bg-background/90 backdrop-blur-sm leading-tight">
                              {set.category}
                            </Badge>
                          </div>
                          {/* Selected checkmark with animation */}
                          {set.text === outfit && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-1.5 md:p-2 text-center bg-muted/30">
                          <p className={cn(
                            "text-[10px] md:text-xs font-medium transition-colors duration-200 line-clamp-1",
                            set.text === outfit ? "text-primary" : "text-foreground"
                          )}>
                            {set.label}
                          </p>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="font-semibold">{set.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{set.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
