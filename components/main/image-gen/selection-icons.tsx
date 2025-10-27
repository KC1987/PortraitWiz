"use client"

import { cn } from "@/lib/utils"
import {
  type LucideIcon,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  Clapperboard,
  CupSoda,
  Leaf,
  Palette,
  PencilRuler,
  Shirt,
  Sunrise,
  BookOpen,
} from "lucide-react"

interface SelectionIconTokenProps {
  icon: LucideIcon;
  gradientClass: string;
  isSelected: boolean;
}

export function SelectionIconToken({
  icon: Icon,
  gradientClass,
  isSelected,
}: SelectionIconTokenProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br shadow-sm transition-all duration-200",
        gradientClass,
        isSelected
          ? "border-primary/70 shadow-[0_12px_24px_-14px_rgba(59,130,246,0.7)] ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
          : "group-hover:border-primary/40 group-hover:shadow-sm"
      )}
    >
      <div className="absolute inset-[2px] rounded-[0.8rem] bg-background/85 backdrop-blur-sm" />
      <Icon
        className="relative h-[22px] w-[22px] text-foreground/80 transition-colors duration-200 group-hover:text-foreground"
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </div>
  )
}

export const defaultOutfitIcon = CircleUserRound
export const defaultSettingIcon = Sunrise

export const outfitCategoryIcons: Record<string, LucideIcon> = {
  Formal: BriefcaseBusiness,
  "Business Casual": Shirt,
  Professional: CircleUserRound,
  Creative: Palette,
  Seasonal: Leaf,
}

export const settingCategoryIcons: Record<string, LucideIcon> = {
  Studio: Clapperboard,
  Office: Building2,
  Hospitality: CupSoda,
  Outdoor: Sunrise,
  Professional: BookOpen,
  Industrial: PencilRuler,
}

