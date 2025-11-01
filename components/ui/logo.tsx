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
      src="/pw-logo-color.png"
      alt="PortraitWiz logo"
      width={1184}
      height={864}
      quality={100}
      priority={priority}
      className={cn(
        "h-8 w-auto select-none",
        variant === "onDark" && "drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]",
        className
      )}
    />
  )
}
