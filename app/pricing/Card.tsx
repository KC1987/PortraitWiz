"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { purchaseCredits } from "@/app/api/calls/buy-credits"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import { CheckCircle2, Sparkles } from "lucide-react"
import { formatPrice, pricePerCredit, type PricingPackage } from "@/lib/pricing-data"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  package: PricingPackage
}

export default function PricingCard({ package: pkg }: PricingCardProps) {
  const { user } = useAtomValue(authAtom)
  const [isLoading, setIsLoading] = useState(false)

  async function handlePurchaseCredits() {
    if (!user?.id || !user?.email) {
      console.error("User not logged in")
      return
    }

    setIsLoading(true)
    try {
      const { url } = await purchaseCredits({
        userId: user.id,
        email: user.email,
        packageId: pkg.id,
      })
      window.location.href = url
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        "w-full max-w-sm relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        pkg.popular && "border-primary border-2 shadow-md scale-105"
      )}
    >
      {/* Popular Badge */}
      {pkg.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-0.5 text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {pkg.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-3 pt-6">
        <CardTitle className="text-xl font-semibold">{pkg.name}</CardTitle>
        <div className="mt-3">
          <div className="text-3xl font-bold">{formatPrice(pkg.price)}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {pricePerCredit(pkg.price, pkg.credits)} per credit
          </div>
        </div>
        <CardDescription className="text-sm font-medium mt-2">
          {pkg.credits} credits
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <ul className="space-y-2">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0">
        <Button
          onClick={handlePurchaseCredits}
          className="w-full"
          size="default"
          variant={pkg.popular ? "default" : "outline"}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Get Started"}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          100% Money-Back Guarantee
        </p>
      </CardFooter>
    </Card>
  )
}