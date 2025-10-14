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
      <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[95vh] overflow-y-auto p-3 sm:p-4">
        <DialogHeader className="space-y-0.5 pb-1">
          <DialogTitle className="text-lg sm:text-xl">Get More Credits</DialogTitle>
          <DialogDescription className="text-xs">
            You need at least 1 credit to generate an image. Choose a package below.
          </DialogDescription>
        </DialogHeader>

        {/* Current Balance */}
        <div className="bg-muted/50 rounded-lg p-2 mb-2">
          <p className="text-xs text-muted-foreground">
            Current balance: <span className="font-bold text-sm sm:text-base text-foreground">{auth?.profile?.credits || 0} credits</span>
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {pricingPackages.map((pkg) => (
            <div key={pkg.id} className="flex justify-center scale-75 sm:scale-80 origin-top -my-6 sm:-my-4">
              <PricingCard package={pkg} />
            </div>
          ))}
        </div>

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
