"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Phone, MessageSquare, MapPin, Clock, Droplets, Filter, Search, X, SlidersHorizontal } from "lucide-react"

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const mockDonors = [
  { id: 1, name: "Rahul Sharma", bloodGroup: "O+", city: "Ahmedabad", lastDonation: "2025-09-15", available: true, distance: "2.3 km" },
  { id: 2, name: "Priya Patel", bloodGroup: "A+", city: "Ahmedabad", lastDonation: "2025-11-02", available: true, distance: "3.1 km" },
  { id: 3, name: "Amit Desai", bloodGroup: "B+", city: "Gandhinagar", lastDonation: "2025-06-20", available: false, distance: "5.7 km" },
  { id: 4, name: "Neha Joshi", bloodGroup: "AB-", city: "Ahmedabad", lastDonation: "2025-10-10", available: true, distance: "1.8 km" },
  { id: 5, name: "Vijay Kumar", bloodGroup: "O-", city: "Surat", lastDonation: "2025-08-05", available: true, distance: "4.2 km" },
  { id: 6, name: "Sita Rao", bloodGroup: "A-", city: "Vadodara", lastDonation: "2025-12-01", available: true, distance: "6.5 km" },
  { id: 7, name: "Karan Singh", bloodGroup: "B-", city: "Ahmedabad", lastDonation: "2025-07-14", available: false, distance: "3.8 km" },
  { id: 8, name: "Meera Thakur", bloodGroup: "AB+", city: "Rajkot", lastDonation: "2025-11-20", available: true, distance: "7.1 km" },
]

export function DonorSearch() {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All")
  const [locationFilter, setLocationFilter] = useState("")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredDonors = mockDonors.filter((donor) => {
    if (selectedBloodGroup !== "All" && donor.bloodGroup !== selectedBloodGroup) return false
    if (locationFilter && !donor.city.toLowerCase().includes(locationFilter.toLowerCase())) return false
    if (showAvailableOnly && !donor.available) return false
    return true
  })

  const activeFilterCount = [
    selectedBloodGroup !== "All",
    locationFilter !== "",
    showAvailableOnly,
  ].filter(Boolean).length

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
              onClick={() => {
                setSelectedBloodGroup("All")
                setLocationFilter("")
                setShowAvailableOnly(false)
              }}
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
              Showing <span className="font-bold text-foreground">{filteredDonors.length}</span> donors
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

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/[0.04]"
            >
              {/* Availability indicator bar */}
              <div className={`absolute top-0 left-0 h-1 w-full ${donor.available ? "bg-emerald-500" : "bg-muted"}`} />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-transform group-hover:scale-105">
                    {donor.name.split(" ").map((n) => n[0]).join("")}
                    {donor.available && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{donor.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {donor.city} - {donor.distance}
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
                  Last: {new Date(donor.lastDonation).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />
                  {donor.available ? (
                    <span className="font-semibold text-emerald-600">Available</span>
                  ) : (
                    <span className="font-semibold text-muted-foreground">Unavailable</span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2.5">
                <Button size="sm" className="flex-1 gap-1.5 rounded-xl" disabled={!donor.available}>
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 rounded-xl" disabled={!donor.available}>
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDonors.length === 0 && (
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
              onClick={() => {
                setSelectedBloodGroup("All")
                setLocationFilter("")
                setShowAvailableOnly(false)
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
