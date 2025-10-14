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
import Image from "next/image"
import { settings } from "@/lib/settings"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingSelectionProps {
  setting: string;
  setSetting: (setting: string) => void;
}

export default function SettingSelection({ setting, setSetting }: SettingSelectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const selectedSetting = settings.find((s) => s.text === setting)
  const selectedIndex = settings.findIndex((s) => s.text === setting)

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
        // Scroll to focused item
        const buttons = scrollRef.current?.querySelectorAll("button")
        if (buttons && buttons[newIndex]) {
          buttons[newIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, setSetting])

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="w-full">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <CardTitle className="text-sm md:text-base">Background Setting</CardTitle>
            </div>
            {selectedSetting && (
              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-[10px] md:text-xs">
                  {selectedSetting.category}
                </Badge>
                <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline-flex">
                  {selectedIndex + 1} of {settings.length}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
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
              <div className="flex w-max gap-2 md:gap-2.5 pb-1 md:pb-2">
                {settings.map((set, index) => (
                  <Tooltip key={set.name}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSetting(set.text)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(-1)}
                        className={cn(
                          "shrink-0 group rounded-lg border-2 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation",
                          "hover:shadow-md md:hover:scale-105 hover:border-primary/50",
                          set.text === setting
                            ? "border-primary bg-primary/5 shadow-sm md:scale-105"
                            : "border-border bg-background",
                          focusedIndex === index && "ring-2 ring-primary ring-offset-2"
                        )}
                        aria-label={`Select ${set.label}`}
                        aria-pressed={set.text === setting}
                      >
                        <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18">
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
                          {set.text === setting && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                              <div className="w-5 h-5 md:w-5 md:h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary-foreground"
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
                        <div className="p-1 md:p-1.5 text-center bg-muted/30">
                          <p className={cn(
                            "text-[10px] md:text-xs font-medium transition-colors duration-200 line-clamp-1",
                            set.text === setting ? "text-primary" : "text-foreground"
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