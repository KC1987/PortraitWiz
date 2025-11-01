"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { settings } from "@/lib/settings"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SelectionIconToken,
  settingCategoryIcons,
  defaultSettingIcon,
} from "./selection-icons"

interface SettingSelectionProps {
  setting: string;
  setSetting: (setting: string) => void;
}

const categoryGradients: Record<string, string> = {
  Studio: "bg-gradient-to-br from-sky-300/60 via-sky-200/60 to-white/90",
  Office: "bg-gradient-to-br from-slate-300/60 via-slate-200/60 to-white/90",
  Hospitality: "bg-gradient-to-br from-amber-300/60 via-orange-200/60 to-white/90",
  Outdoor: "bg-gradient-to-br from-emerald-300/60 via-teal-200/55 to-white/90",
  Professional: "bg-gradient-to-br from-indigo-300/60 via-violet-200/60 to-white/90",
  Industrial: "bg-gradient-to-br from-slate-400/55 via-slate-300/60 to-white/90",
}

export default function SettingSelection({ setting, setSetting }: SettingSelectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectedSetting = settings.find((s) => s.text === setting)
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
        newIndex = Math.min(focusedIndex + 1, settings.length - 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        newIndex = Math.max(focusedIndex - 1, 0)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setSetting(settings[focusedIndex].text)
        return
      } else if (e.key === "Home") {
        e.preventDefault()
        newIndex = 0
      } else if (e.key === "End") {
        e.preventDefault()
        newIndex = settings.length - 1
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex)
        const buttons = scrollContainerRef.current?.querySelectorAll("button[data-setting-option]")
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
  }, [focusedIndex, setSetting])

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
          <h3 className="text-sm font-semibold text-foreground sm:text-base">Background Setting</h3>
          {selectedSetting && (
            <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">
              {selectedSetting.category}
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
              aria-label="Scroll settings left"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
          )}

          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScrollBy("right")}
              className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 rounded-full bg-background/95 p-1 text-muted-foreground shadow-md ring-1 ring-border/50 transition hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 sm:right-1 sm:p-1.5"
              aria-label="Scroll settings right"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex snap-x gap-2.5 overflow-x-auto pb-1 pt-1 px-1 scroll-smooth sm:gap-3 sm:px-2 sm:-mx-2 w-full"
          >
            {settings.map((set, index) => {
              const isSelected = set.text === setting
              const gradient =
                categoryGradients[set.category] ||
                "bg-gradient-to-br from-muted/50 via-muted/40 to-background/80"
              const IconComponent =
                settingCategoryIcons[set.category] || defaultSettingIcon
              return (
                <Tooltip key={set.name}>
                  <TooltipTrigger asChild>
                    <button
                      data-setting-option
                      type="button"
                      onClick={() => setSetting(set.text)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(-1)}
                      className={cn(
                        "group flex w-[100px] min-w-[100px] snap-start flex-col items-center gap-2 rounded-xl bg-background/90 px-2.5 py-3 text-center text-foreground shadow-sm ring-1 ring-border/50 transition-all duration-200 touch-manipulation active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-[124px] sm:min-w-[124px] sm:px-3",
                        isSelected
                          ? "ring-primary/60 bg-primary/5 text-foreground"
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
