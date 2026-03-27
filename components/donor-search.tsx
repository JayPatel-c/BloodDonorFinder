"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Phone, MessageSquare, MapPin, Clock, Droplets, Filter, Search, X, SlidersHorizontal, Loader2 } from "lucide-react"

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

type Donor = {
  id: number
  name: string
  bloodGroup: string
  city: string
  district: string
  lastDonation: string | null
  mobile: string | null
  preferredContact: string | null
  eligible: number // 1 or 0 from SQL
}

export function DonorSearch() {
  const searchParams = useSearchParams()
  const initialBloodGroup = searchParams.get("bloodGroup")

  const [selectedBloodGroup, setSelectedBloodGroup] = useState(
    initialBloodGroup && ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(initialBloodGroup)
      ? initialBloodGroup
      : "All"
  )
  const [locationFilter, setLocationFilter] = useState("")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch donors from API
  const fetchDonors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedBloodGroup !== "All") params.set("bloodGroup", selectedBloodGroup)
      if (locationFilter.trim()) params.set("city", locationFilter.trim())
      if (showAvailableOnly) params.set("available", "true")

      const res = await fetch(`http://localhost:5000/api/donors/search?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setDonors(data)
      }
    } catch (err) {
      console.error("Error fetching donors:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on initial load
  useEffect(() => {
    fetchDonors()
  }, [])

  // Re-fetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => fetchDonors(), 300)
    return () => clearTimeout(timer)
  }, [selectedBloodGroup, locationFilter, showAvailableOnly])

  const activeFilterCount = [
    selectedBloodGroup !== "All",
    locationFilter !== "",
    showAvailableOnly,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedBloodGroup("All")
    setLocationFilter("")
    setShowAvailableOnly(false)
  }

  function lastDonationLabel(d: string | null) {
    if (!d) return "No record"
    return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filters Sidebar */}
      <aside className={`w-full shrink-0 lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs hover:bg-primary/10">
                {activeFilterCount}
              </Badge>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Blood Group</Label>
              <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((g) => (
                    <SelectItem key={g} value={g}>{g === "All" ? "All Blood Groups" : g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search city..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label htmlFor="available-only" className="text-sm font-medium text-foreground">
                Available Only
              </Label>
              <Switch
                id="available-only"
                checked={showAvailableOnly}
                onCheckedChange={setShowAvailableOnly}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching donors...
                </span>
              ) : (
                <>Showing <span className="font-bold text-foreground">{donors.length}</span> donor{donors.length !== 1 ? "s" : ""}</>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs ml-1 hover:bg-primary/10">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Loading donors...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/[0.04]"
                >
                  {/* Availability indicator bar */}
                  <div className={`absolute top-0 left-0 h-1 w-full ${donor.eligible ? "bg-emerald-500" : "bg-muted"}`} />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-transform group-hover:scale-105">
                        {donor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        {donor.eligible ? (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{donor.name}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {donor.city}{donor.district ? `, ${donor.district}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-sm shadow-primary/20">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Last: {lastDonationLabel(donor.lastDonation)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5" />
                      {donor.eligible ? (
                        <span className="font-semibold text-emerald-600">Available</span>
                      ) : (
                        <span className="font-semibold text-muted-foreground">Unavailable</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2.5">
                    <Button size="sm" className="flex-1 gap-1.5 rounded-xl" disabled={!donor.eligible}>
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5 rounded-xl" disabled={!donor.eligible}>
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {donors.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="mt-5 text-base font-semibold text-foreground">No donors found</p>
                <p className="mt-1.5 text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-xl gap-2"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
