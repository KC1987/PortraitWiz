import Image from "next/image"

import { cn } from "@/lib/utils"

type LogoVariant = "default" | "onDark"

interface LogoProps {
  className?: string
  variant?: LogoVariant
  priority?: boolean
}

export default function Logo({
  className,
  variant = "default",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/pw-logo.png"
      alt="PortraitWiz logo"
      width={466}
      height={332}
      priority={priority}
      className={cn(
        "h-8 w-auto select-none",
        "dark:brightness-0 dark:invert dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]",
        variant === "onDark" && "brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]",
        className
      )}
    />
  )
}
