"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth } from "@/lib/api"
import { HospitalDashboard } from "@/components/hospital-dashboard"
import { DonorDashboard } from "@/components/donor-dashboard"

export default function DashboardPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    if (!auth) {
      router.replace("/login")
      return
    }
    setUserType(auth.user_type)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (userType === "donor") {
    return <DonorDashboard />
  }

  return <HospitalDashboard />
}
