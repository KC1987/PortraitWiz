"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { outfits as femaleOutfits } from "@/lib/female_outfits"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FemaleOutfitSelectionProps {
  outfit: string;
  setOutfit: (outfit: string) => void;
}

const categoryGradients: Record<string, string> = {
  Formal: "from-rose-200/70 via-rose-100 to-pink-200/70",
  "Business Casual": "from-amber-200/70 via-orange-100 to-rose-200/70",
  Professional: "from-fuchsia-200/70 via-purple-100 to-indigo-200/70",
  Creative: "from-emerald-200/70 via-teal-100 to-sky-200/70",
  Seasonal: "from-sky-200/70 via-blue-100 to-indigo-200/70",
}

export default function FemaleOutfitSelection({ outfit, setOutfit }: FemaleOutfitSelectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectedOutfit = femaleOutfits.find((o) => o.text === outfit)
  const selectedIndex = useMemo(
    () => femaleOutfits.findIndex((o) => o.text === outfit),
    [outfit]
  )

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setShowLeftArrow(scrollLeft > 8)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 8)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollContainerRef.current
    if (!el) return
    const handleResize = () => updateScrollState()
    el.addEventListener("scroll", updateScrollState)
    window.addEventListener("resize", handleResize)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", handleResize)
    }
  }, [updateScrollState])

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
        const buttons = scrollContainerRef.current?.querySelectorAll("button[data-female-outfit-option]")
        if (buttons && buttons[newIndex]) {
          ;(buttons[newIndex] as HTMLButtonElement).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, setOutfit])

  const handleScrollBy = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = el.offsetWidth * 0.75
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-sm md:text-base">Female Outfit Style</CardTitle>
            </div>
            {selectedOutfit && (
              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-[10px] md:text-xs">
                  {selectedOutfit.category}
                </Badge>
                <span className="hidden text-[10px] text-muted-foreground md:text-xs sm:inline-flex">
                  {selectedIndex + 1} of {femaleOutfits.length}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <div
              className={cn(
                "pointer-events-none absolute inset-y-2 left-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent transition-opacity hidden sm:block",
                showLeftArrow ? "opacity-100" : "opacity-0"
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-2 right-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent transition-opacity hidden sm:block",
                showRightArrow ? "opacity-100" : "opacity-0"
              )}
            />

            {showLeftArrow && (
              <button
                type="button"
                onClick={() => handleScrollBy("left")}
                className="absolute left-1 top-1/2 hidden -translate-y-1/2 rounded-full border border-border/60 bg-background/95 p-1 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex"
                aria-label="Scroll female outfits left"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            {showRightArrow && (
              <button
                type="button"
                onClick={() => handleScrollBy("right")}
                className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-full border border-border/60 bg-background/95 p-1 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex"
                aria-label="Scroll female outfits right"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <ScrollArea className="w-full rounded-lg">
              <div
                ref={scrollContainerRef}
                className="flex w-max gap-3 overflow-x-auto px-1 pb-2 pt-1 md:gap-3.5 md:px-2 md:pb-3 scroll-smooth"
              >
                {femaleOutfits.map((set, index) => {
                  const isSelected = set.text === outfit
                  const gradient = categoryGradients[set.category] || "from-muted/70 via-muted to-muted-foreground/20"
                  return (
                    <Tooltip key={set.name}>
                      <TooltipTrigger asChild>
                        <button
                          data-female-outfit-option
                          type="button"
                          onClick={() => setOutfit(set.text)}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(-1)}
                          className={cn(
                            "group flex w-[110px] flex-col overflow-hidden rounded-xl border bg-background transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:w-[120px]",
                            isSelected
                              ? "border-primary/70 shadow-sm"
                              : "border-border/70 hover:border-primary/40 hover:shadow-sm",
                            focusedIndex === index && !isSelected && "ring-2 ring-primary/40 ring-offset-2"
                          )}
                          aria-label={`Select ${set.label}`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className={cn(
                              "relative flex h-24 w-full items-center justify-center rounded-t-xl bg-gradient-to-br px-2 text-xs font-medium text-foreground/80 transition-colors md:h-28 md:text-sm",
                              gradient
                            )}
                          >
                            <span className="text-center leading-tight">
                              {set.label}
                            </span>
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="absolute left-2 top-2">
                              <Badge variant="secondary" className="bg-background/90 px-1.5 py-0 text-[9px] leading-tight md:text-[10px]">
                                {set.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="border-t border-border/60 bg-muted/40 px-2 py-1.5 text-center">
                            <p
                              className={cn(
                                "text-[11px] font-medium leading-tight text-muted-foreground transition-colors duration-200 md:text-xs line-clamp-2",
                                isSelected && "text-foreground"
                              )}
                            >
                              {set.description}
                            </p>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="font-semibold">{set.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{set.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
              <ScrollBar orientation="horizontal" className="mt-1" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
