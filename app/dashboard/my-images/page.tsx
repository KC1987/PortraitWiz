"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtomValue } from "jotai"
import { authAtom } from "@/lib/atoms"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import MyImagesTab from "@/components/dashboard/MyImagesTab"

export default function MyImagesPage() {
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
      <MyImagesTab />
    </DashboardLayout>
  )
}
