"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, buttonVariants } from "../ui/button"
import { Badge } from "../ui/badge"
import { createClient } from "@/utils/supabase/client"
import { useAtomValue, useSetAtom } from "jotai"
import { authAtom } from "@/lib/atoms"
import {
  Menu,
  User,
  Settings,
  LogOut,
  Coins,
  Home,
  Tag,
  Mail,
  LayoutDashboard,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
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
  SheetClose,
} from "@/components/ui/sheet"
import InsufficientCreditsDialog from "@/components/InsufficientCreditsDialog"
import ThemeToggle from "@/components/ui/theme-toggle"
import Logo from "@/components/ui/logo"

// NavLink component with active state
interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
  mobile?: boolean
  icon?: LucideIcon
}

function NavLink({ href, children, onClick, mobile = false, icon: Icon }: NavLinkProps) {

  const pathname = usePathname()
  const isActive = pathname === href

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-2 py-2 text-base font-medium transition-colors",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-5 w-5",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          />
        )}
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}

const MOBILE_LINKS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: Tag,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
  },
]

const AUTH_LINKS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  {
    href: "/dashboard/profile",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
]

export default function Navbar() {
  const supabase = createClient()

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
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="PortraitWiz home"
          >
            <Logo priority />
            <span className="text-lg font-semibold text-foreground">PortraitWiz</span>
          </Link>

          {/* Desktop Navigation */}
            <div className="flex items-center gap-2 md:gap-8 max-sm:hidden">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            {isLoggedIn ? (
              // User logged in
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1.5 px-3 py-1"
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
                      className="gap-2"
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
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link
                  href="/enter"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Get Started
                </Link>
              </div>
            )}
          {/*</div>*/}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex h-full w-[90vw] max-w-[340px] flex-col px-0 sm:max-w-[360px]">
                <div className="flex h-full flex-col">
                  <SheetHeader className="px-6 pb-2">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                      <Logo className="h-6 w-auto" />
                      <span className="font-semibold text-foreground">PortraitWiz</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isLoggedIn ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{username}</span>
                        <button
                          type="button"
                          onClick={handleCreditsClick}
                          className="flex items-center gap-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        >
                          <Coins className="h-4 w-4" />
                          <span suppressHydrationWarning>{userCredits}</span>
                        </button>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          href="/enter"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            buttonVariants({ size: "sm" }),
                            "w-full justify-center bg-primary text-primary-foreground"
                          )}
                        >
                          Get Started
                        </Link>
                      </SheetClose>
                    )}

                    <nav className="mt-6 space-y-1">
                      {MOBILE_LINKS.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <NavLink
                            href={link.href}
                            mobile
                            icon={link.icon}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </NavLink>
                        </SheetClose>
                      ))}
                      {isLoggedIn &&
                        AUTH_LINKS.map((link) => (
                          <SheetClose asChild key={link.href}>
                            <NavLink
                              href={link.href}
                              mobile
                              icon={link.icon}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.label}
                            </NavLink>
                          </SheetClose>
                        ))}
                    </nav>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="flex flex-col gap-3">
                      <ThemeToggle
                        className="w-full justify-between border-0 bg-transparent px-2 hover:bg-muted/30"
                        menuAlign="start"
                        label="Theme"
                      />
                      {isLoggedIn ? (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          className="justify-start gap-2 px-2 text-sm font-medium hover:bg-muted/30"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href="/pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "sm" }),
                              "w-full justify-start gap-2 px-2 text-sm font-medium hover:bg-muted/30"
                            )}
                          >
                            <Tag className="h-4 w-4" />
                            View Pricing
                          </Link>
                        </SheetClose>
                      )}
                    </div>
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
