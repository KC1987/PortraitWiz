"use client"

import { useState } from "react"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"

export default function SettingsTab() {
  const { user, profile } = useAtomValue(authAtom)
  const supabase = createClient()

  const [username, setUsername] = useState(profile?.username || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleUpdateUsername = async () => {
    if (!user) return

    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user.id)

      if (error) throw error

      setUpdateMessage({ type: "success", text: "Username updated successfully!" })
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update username"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Please sign in to access settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              <Button
                onClick={handleUpdateUsername}
                disabled={isUpdating || username === profile?.username}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {updateMessage && (
              <p className={`text-sm ${updateMessage.type === "success" ? "text-green-600" : "text-destructive"}`}>
                {updateMessage.text}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={user.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Delete Account</p>
              <p className="text-xs text-muted-foreground mb-3">
                This will permanently delete your account, all your images, and
                credits. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => alert("Account deletion will be implemented with proper confirmation flow")}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
