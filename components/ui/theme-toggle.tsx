"use client"

import { useEffect, useMemo, useState } from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  menuAlign?: "start" | "center" | "end"
  label?: string
}

export default function ThemeToggle({
  className,
  menuAlign = "end",
  label,
}: ThemeToggleProps) {
  const { setTheme, theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = useMemo(() => {
    if (theme === "system") {
      return systemTheme ?? "system"
    }
    return theme
  }, [theme, systemTheme])

  const iconClass =
    "h-[1.1rem] w-[1.1rem] transition-transform duration-200 text-foreground"

  const selectionLabel = useMemo(() => {
    if (!mounted || theme === undefined) {
      return ""
    }

    if (theme === "system") {
      return "System"
    }

    return activeTheme ?? ""
  }, [activeTheme, mounted, theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "relative flex items-center gap-2",
            label ? "justify-between" : "",
            className
          )}
          aria-label="Toggle theme"
        >
          <span className="relative flex items-center">
            <Sun
              className={cn(
                iconClass,
                "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              )}
            />
            <Moon
              className={cn(
                iconClass,
                "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              )}
            />
          </span>
          {label ? (
            <>
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
              <span className="ml-auto text-xs font-medium capitalize text-muted-foreground">
                {selectionLabel}
              </span>
            </>
          ) : (
            <span className="hidden text-xs font-medium capitalize text-muted-foreground lg:block">
              {selectionLabel}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={menuAlign} className="w-40">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2"
        >
          <Laptop className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
