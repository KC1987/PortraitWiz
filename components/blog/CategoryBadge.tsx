import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  asLink?: boolean
  className?: string
  variant?: "default" | "secondary" | "outline" | "destructive"
}

export function CategoryBadge({
  category,
  asLink = false,
  className,
  variant = "secondary",
}: CategoryBadgeProps) {
  const badgeContent = (
    <Badge variant={variant} className={cn(className)}>
      {category}
    </Badge>
  )

  if (asLink) {
    return (
      <Link
        href={`/blog/category/${encodeURIComponent(category.toLowerCase())}`}
        className="hover:opacity-80 transition-opacity"
      >
        {badgeContent}
      </Link>
    )
  }

  return badgeContent
}
