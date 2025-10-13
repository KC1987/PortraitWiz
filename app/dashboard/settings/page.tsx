"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import SettingsTab from "@/components/dashboard/SettingsTab"

export default function SettingsPage() {
  const { user } = useAtomValue(authAtom)
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push("/enter")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <SettingsTab />
    </DashboardLayout>
  )
}
