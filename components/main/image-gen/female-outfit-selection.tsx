"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { outfits as femaleOutfits } from "@/lib/female_outfits"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
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
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="hidden h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-semibold text-foreground sm:text-base">
              Female Outfit Style
            </h3>
          </div>
          {selectedOutfit && (
            <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">
              {selectedOutfit.category}
              <span className="ml-1 hidden text-muted-foreground/80 sm:inline">
                · {selectedIndex + 1}/{femaleOutfits.length}
              </span>
            </span>
          )}
        </div>
        <div className="relative">
          <div
            className={cn(
              "pointer-events-none absolute inset-y-1 left-0 w-8 bg-gradient-to-r from-muted/40 via-muted/10 to-transparent transition-opacity sm:w-10",
              showLeftArrow ? "opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-1 right-0 w-8 bg-gradient-to-l from-muted/40 via-muted/10 to-transparent transition-opacity sm:w-10",
              showRightArrow ? "opacity-100" : "opacity-0"
            )}
          />

          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleScrollBy("left")}
              className="absolute left-0.5 top-1/2 z-10 flex -translate-y-1/2 rounded-full bg-background/95 p-1 text-muted-foreground shadow-md ring-1 ring-border/50 transition hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:left-1 sm:p-1.5"
              aria-label="Scroll female outfits left"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
          )}

          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScrollBy("right")}
              className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 rounded-full bg-background/95 p-1 text-muted-foreground shadow-md ring-1 ring-border/50 transition hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:right-1 sm:p-1.5"
              aria-label="Scroll female outfits right"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex snap-x gap-2.5 overflow-x-auto pb-1 pt-1 px-1 scroll-smooth sm:gap-3 sm:px-2 sm:-mx-2 w-full"
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
                        "group flex w-[100px] min-w-[100px] snap-start flex-col items-center gap-2 rounded-xl bg-background/90 px-2.5 py-3 text-center shadow-sm ring-1 ring-border/50 transition-all duration-200 touch-manipulation active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-[124px] sm:min-w-[124px] sm:px-3",
                        isSelected
                          ? "ring-primary/60 bg-primary/5"
                          : "hover:ring-primary/40 hover:bg-background",
                        focusedIndex === index && !isSelected && "ring-primary/40"
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
                      <span
                        className={cn(
                          "text-[11px] font-semibold leading-tight text-foreground/85 transition-colors duration-200 sm:text-xs",
                          isSelected && "text-foreground"
                        )}
                      >
                        {set.label}
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground sm:text-[10px]">
                        {set.category}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs hidden sm:block">
                    <p className="font-semibold">{set.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{set.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
