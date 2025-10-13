"use client"

import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Coins } from "lucide-react"

export default function ProfileTab() {
  const { user, profile } = useAtomValue(authAtom)

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Please sign in to view your profile</p>
      </div>
    )
  }

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "N/A"

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details and account status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p className="font-medium">{profile.username || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="font-medium">{joinDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg border bg-primary/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary/80">Available Credits</p>
              <p className="text-2xl font-bold text-primary">{profile.credits}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
