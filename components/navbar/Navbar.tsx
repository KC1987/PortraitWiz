"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { createClient } from "@/utils/supabase/client"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import { Sparkles, Menu, User, Settings, LogOut, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import InsufficientCreditsDialog from "@/components/InsufficientCreditsDialog"

// NavLink component with active state
interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
  mobile?: boolean
}

function NavLink({ href, children, onClick, mobile = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "text-lg font-medium transition-all duration-200 relative group",
          isActive
            ? "text-primary"
            : "text-foreground hover:text-primary"
        )}
      >
        {children}
        <span className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )} />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-all duration-200 relative group py-1",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      <span className={cn(
        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
        isActive ? "w-full" : "w-0 group-hover:w-full"
      )} />
    </Link>
  )
}

export default function Navbar() {
  const supabase = createClient()
  const { profile } = useAtomValue(authAtom)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)

  const handleCreditsClick = () => {
    if (profile?.credits === 0) {
      setCreditsDialogOpen(true)
    } else {
      setCreditsDialogOpen(true)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/95 border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold group"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <Sparkles className="w-5 h-5 text-primary absolute inset-0 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground group-hover:from-primary group-hover:to-primary/60 bg-clip-text text-transparent transition-all duration-300">
              PortraitWiz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            {profile?.username ? (
              // User logged in
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer transition-colors duration-200 gap-1.5 px-3 py-1"
                  onClick={handleCreditsClick}
                >
                  <Coins className="w-3.5 h-3.5" />
                  {profile.credits}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      {profile.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => supabase.auth.signOut()}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // User logged out
              <div className="pl-6 border-l border-border">
                <Button asChild size="sm" className="hover:scale-105 transition-transform duration-200">
                  <Link href="/enter">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 hover:bg-primary/5 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[350px] flex flex-col"
              >
                <SheetHeader className="border-b border-border pb-4">
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                    PortraitWiz
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 mt-6 flex-1">
                  {/* Credits Badge - Only if logged in */}
                  {profile?.username && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer w-fit gap-1.5 px-3 py-1.5 transition-colors duration-200"
                      onClick={handleCreditsClick}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      {profile.credits}
                    </Badge>
                  )}

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-4">
                    <NavLink href="/" onClick={() => setMobileMenuOpen(false)} mobile>
                      Home
                    </NavLink>
                    <NavLink href="/pricing" onClick={() => setMobileMenuOpen(false)} mobile>
                      Pricing
                    </NavLink>
                    <NavLink href="/contact" onClick={() => setMobileMenuOpen(false)} mobile>
                      Contact
                    </NavLink>
                  </div>

                  {/* User Section */}
                  <div className="border-t border-border pt-6 mt-auto">
                    {profile?.username ? (
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-muted-foreground mb-2">
                          Signed in as{" "}
                          <span className="font-semibold text-foreground">
                            {profile.username}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          asChild
                          className="justify-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/dashboard/profile">
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          asChild
                          className="justify-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/dashboard/settings">
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            supabase.auth.signOut()
                            setMobileMenuOpen(false)
                          }}
                          className="justify-start gap-2 hover:scale-[0.98] transition-transform duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        className="w-full hover:scale-[0.98] transition-transform duration-200"
                      >
                        <Link href="/enter" onClick={() => setMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Insufficient Credits Dialog */}
      <InsufficientCreditsDialog
        open={creditsDialogOpen}
        onOpenChange={setCreditsDialogOpen}
      />
    </nav>
  )
}