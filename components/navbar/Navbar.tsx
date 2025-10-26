"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, buttonVariants } from "../ui/button"
import { Badge } from "../ui/badge"
import { createClient } from "@/utils/supabase/client"
import { useAtomValue, useSetAtom } from "jotai"
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
import ThemeToggle from "@/components/ui/theme-toggle"

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
  const navigation = useRouter();

  const { profile } = useAtomValue(authAtom)
  const setAuth = useSetAtom(authAtom)

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.log(error)
        return
      }

      setAuth({ user: null, profile: null })
      // navigation.push("/");

    } catch (error) {
      console.log(error)
    }
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)

  const isLoggedIn = Boolean(profile?.username)
  const userCredits = profile?.credits ?? 0
  const username = profile?.username ?? ""

  const handleCreditsClick = () => {
    if (profile?.credits === 0) {
      setCreditsDialogOpen(true)
    } else {
      setCreditsDialogOpen(true)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-primary/5"
          >
            <div className="relative">
              <Sparkles className="h-5 w-5 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <Sparkles className="absolute inset-0 h-5 w-5 text-primary opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-50" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground bg-clip-text text-lg font-semibold text-transparent transition-colors duration-200 group-hover:from-primary group-hover:to-primary/60">
                PortraitWiz
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground transition-colors duration-300 sm:block group-hover:text-primary/70">
                AI Portrait Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            {isLoggedIn ? (
              // User logged in
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <ThemeToggle />
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer transition-colors duration-200 gap-1.5 px-3 py-1"
                  onClick={handleCreditsClick}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>{userCredits}</span>
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                    >
                      <User className="h-4 w-4" />
                      {username}
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
                      onClick={handleSignOut}
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
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <ThemeToggle />
                <Link
                  href="/enter"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "inline-flex bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90"
                  )}
                >
                  Get Started
                </Link>
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
                    <Sparkles className="h-5 w-5 text-primary" />
                    PortraitWiz
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 mt-6 flex-1">
                  {/* Credits Badge - Only if logged in */}
                  {isLoggedIn && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer w-fit gap-1.5 px-3 py-1.5 transition-colors duration-200"
                      onClick={handleCreditsClick}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span suppressHydrationWarning>{userCredits}</span>
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

                  <div className="border-t border-border pt-6">
                    <ThemeToggle
                      className="w-full"
                      menuAlign="start"
                      label="Theme"
                    />
                  </div>

                  {/* User Section */}
                  <div className="border-t border-border pt-6 mt-auto">
                    {isLoggedIn ? (
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-muted-foreground mb-2">
                          Signed in as{" "}
                          <span className="font-semibold text-foreground">
                            {username}
                          </span>
                        </div>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "justify-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                          )}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "justify-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                          )}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          className="justify-start gap-2 hover:scale-[0.98] transition-transform duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Link
                        href="/enter"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          buttonVariants(),
                          "w-full justify-center hover:scale-[0.98] transition-transform duration-200"
                        )}
                      >
                        Get Started
                      </Link>
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
