"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"

export default function DashboardPage() {
  const { user } = useAtomValue(authAtom)
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push("/enter")
    } else {
      // Redirect to profile by default
      router.push("/dashboard/profile")
    }
  }, [user, router])

  return null
}