"use client"

import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type SignInRequiredDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function SignInRequiredDialog({
  open,
  onOpenChange,
  title,
  description,
  ctaLabel,
  ctaHref,
}: SignInRequiredDialogProps) {
  const dialogTitle = title ?? "Sign in to add photos"
  const dialogDescription =
    description ?? "Create a free account to begin creating professional portraits."
  const callToActionLabel = ctaLabel ?? "Get Started"
  const callToActionHref = ctaHref ?? "/enter"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg font-semibold">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <Button asChild size="lg" className="w-full">
          <Link href={callToActionHref}>{callToActionLabel}</Link>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
