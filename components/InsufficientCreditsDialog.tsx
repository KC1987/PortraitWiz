"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { pricingPackages } from "@/lib/pricing-data"
import PricingCard from "@/app/pricing/Card"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import TrustBadges from "@/components/TrustBadges"

interface InsufficientCreditsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function InsufficientCreditsDialog({
  open,
  onOpenChange,
}: InsufficientCreditsDialogProps) {
  const auth = useAtomValue(authAtom)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] sm:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-0.5 pb-0 sm:pb-1">
          <DialogTitle className="text-lg sm:text-xl">Get More Credits</DialogTitle>
          {/*<DialogDescription className="text-xs sm:text-sm">*/}
          {/*  You need at least 1 credit to generate an image. Choose a package below.*/}
          {/*</DialogDescription>*/}
        </DialogHeader>

        {/* Current Balance */}
        <div className="bg-muted/50 rounded-lg p-2 mb-2">
          <p className="text-xs text-muted-foreground">
            Current balance:{" "}
            <span className="font-bold text-sm sm:text-base text-foreground" suppressHydrationWarning>
              {auth?.profile?.credits || 0}
            </span>{" "}
            credits
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {pricingPackages.map((pkg) => (
            <div key={pkg.id} className="flex justify-center">
              <PricingCard package={pkg} variant="compact" />
            </div>
          ))}
        </div>

        <TrustBadges size="compact" className="mt-3" />

        {/* Footer with Close Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-sm h-8"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
