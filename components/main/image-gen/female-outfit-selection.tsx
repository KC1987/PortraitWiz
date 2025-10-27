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
import {
  SelectionIconToken,
  outfitCategoryIcons,
  defaultOutfitIcon,
} from "./selection-icons"

interface FemaleOutfitSelectionProps {
  outfit: string;
  setOutfit: (outfit: string) => void;
}

const categoryGradients: Record<string, string> = {
  Formal: "bg-gradient-to-br from-rose-300/55 via-rose-200/60 to-white/90",
  "Business Casual": "bg-gradient-to-br from-amber-300/55 via-orange-200/55 to-white/90",
  Professional: "bg-gradient-to-br from-fuchsia-300/55 via-indigo-200/55 to-white/90",
  Creative: "bg-gradient-to-br from-emerald-300/55 via-teal-200/55 to-white/90",
  Seasonal: "bg-gradient-to-br from-sky-300/55 via-blue-200/55 to-white/90",
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
                  const gradient =
                    categoryGradients[set.category] ||
                    "bg-gradient-to-br from-muted/50 via-muted/40 to-background/80"
                  const IconComponent =
                    outfitCategoryIcons[set.category] || defaultOutfitIcon
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
                            "group flex w-[108px] flex-col gap-2 rounded-xl border border-border/60 bg-background/80 px-3 py-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-[1px] md:w-[118px]",
                            isSelected
                              ? "border-primary/70 bg-primary/5 shadow-sm"
                              : "hover:border-primary/40 hover:shadow-sm",
                            focusedIndex === index && !isSelected && "ring-2 ring-primary/40 ring-offset-2"
                          )}
                          aria-label={`Select ${set.label}`}
                          aria-pressed={isSelected}
                        >
                          <div className="flex justify-center">
                            <SelectionIconToken
                              icon={IconComponent}
                              gradientClass={gradient}
                              isSelected={isSelected}
                            />
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={cn(
                                "text-xs font-semibold leading-tight text-foreground/80 transition-colors duration-200",
                                isSelected && "text-foreground"
                              )}
                            >
                              {set.label}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                              {set.category}
                            </span>
                          </div>
                          <p className="text-[11px] leading-snug text-muted-foreground transition-colors duration-200 line-clamp-2 md:text-xs">
                            {set.description}
                          </p>
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
