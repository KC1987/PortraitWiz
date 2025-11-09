"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

const BADGES = [
  {
    src: "/brandkits/Powered by Stripe - blurple.svg",
    alt: "Powered by Stripe",
  },
  {
    src: "/brandkits/visa-brandmark-blue-1960x622.webp",
    alt: "Visa Accepted",
    scale: 0.75,
  },
  {
    src: "/brandkits/ma_symbol_opt_73_3x.png",
    alt: "Mastercard Secure Payments",
  },
  {
    src: "/brandkits/trust-badge-aes-256-bit-ssl.png",
    alt: "AES-256 SSL Encryption",
  },
]

type TrustBadgesProps = {
  size?: "default" | "compact"
  className?: string
}

export default function TrustBadges({ size = "default", className }: TrustBadgesProps) {
  const containerGaps = size === "compact" ? "gap-3 sm:gap-4" : "gap-4 sm:gap-6"
  const badgeSizing =
    size === "compact"
      ? "h-6 px-2 sm:h-7 sm:px-2.5"
      : "h-7 px-2.5 sm:h-8 sm:px-3"

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center text-center text-muted-foreground",
        containerGaps,
        className
      )}
    >
      {BADGES.map((badge) => (
        <div
          key={badge.src}
          className={cn(
            "flex items-center justify-center",
            badgeSizing
          )}
        >
          <Image
            src={badge.src}
            alt={badge.alt}
            width={105}
            height={38}
            className="h-full w-auto object-contain"
            style={
              badge.scale
                ? { transform: `scale(${badge.scale})`, transformOrigin: "center" }
                : undefined
            }
            priority={false}
          />
        </div>
      ))}
    </div>
  )
}
