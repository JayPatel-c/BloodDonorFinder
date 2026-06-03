"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart, Search, AlertCircle, History, Building2, Activity,
  MapPin, Phone, Clock, CheckCircle2, Send, Minus, Plus,
  Edit3, LogOut, ChevronRight, UserCheck,
  Users, Droplets, User, X, Menu, TrendingUp, UserX, Trash2, Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   DEFAULT DATA (empty — real data loads from API)
═══════════════════════════════════════════════════════════ */
const DEFAULT_HOSPITAL = {
  name: "",
  type: "",
  regNumber: "",
  address: "",
  city: "",
  district: "",
  email: "",
  contactPerson: "",
  designation: "",
  contactNumber: "",
  id: "",
  joinedDate: "",
  verified: false,
}


import React from 'react';
const HospContext = React.createContext(DEFAULT_HOSPITAL);
const useHosp = () => React.useContext(HospContext);

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const ALL_DONORS: { id: number; name: string; bg: string; city: string; area: string; lastDon: string; eligible: boolean; phone: string }[] = []

const INIT_REQUESTS: { id: string; bg: string; units: number; urgency: string; status: string; date: string; donorName?: string; donorMobile?: string }[] = []

const CITY_STOCK = [
  { bg: "A+", n: 0 }, { bg: "A-", n: 0 },
  { bg: "B+", n: 0 }, { bg: "B-", n: 0 },
  { bg: "O+", n: 0 }, { bg: "O-", n: 0 },
  { bg: "AB+", n: 0 }, { bg: "AB-", n: 0 },
]

/* ─── Helpers ─── */
function fmt(d: string) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function fmtTime(d: string) {
  if (!d) return "—"
  return new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}
function daysAgo(d: string) {
  if (!d) return "—"
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  return diff === 0 ? "Today" : `${diff}d ago`
}

/* ─── Nav ─── */
const NAV = [
  { label: "Overview", icon: Activity },
  { label: "Find Donors", icon: Search },
  { label: "Emergency Request", icon: AlertCircle },
  { label: "Request History", icon: History },
  { label: "Hospital Profile", icon: Building2 },
]

/* ─── Badge helpers ─── */
function UrgencyBadge({ urgency }: { urgency: string }) {
  return (
    <Badge className={cn("rounded-full text-xs",
      urgency === "Critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
        : urgency === "High" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
          : "bg-muted text-muted-foreground"
    )}>{urgency}</Badge>
  )
}
function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("rounded-full text-xs",
      status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
        : status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
          : "bg-muted text-muted-foreground"
    )}>{status}</Badge>
  )
}

/* ═══════════════════════════════════════════════════════════
   1. OVERVIEW — mirrors donor Overview exactly
═══════════════════════════════════════════════════════════ */
function Overview({ requests, donors, setTab }: {
  requests: typeof INIT_REQUESTS
  donors: any[]
  setTab: (i: number) => void
}) {
  const hosp = useHosp();
  const eligible = donors.filter(d => d.eligible).length
  const pending = requests.filter(r => r.status === "Pending").length
  const completed = requests.filter(r => r.status === "Completed").length

  return (
    <div className="flex flex-col gap-6">

      {/* ── Hero hospital strip — mirrors donor profile strip ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Top row: avatar + name + badges — same as donor */}
        <div className="bg-primary/5 border-b border-border px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {hosp.name}
              </h2>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{hosp.city}, {hosp.district}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{hosp.contactNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              ✓ Verified Hospital
            </Badge>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs border-primary/20 text-primary"
              onClick={() => setTab(4)}>
              <Edit3 className="h-3 w-3" />Edit
            </Button>
          </div>
        </div>

        {/* Stats strip — 4 columns, same as donor B+ / 7 / date / date */}
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {[
            { label: "Hospital Type", value: hosp.type, highlight: false },
            { label: "Total Requests", value: requests.length, highlight: false },
            { label: "Last Request", value: fmt(requests[0]?.date ?? hosp.joinedDate), highlight: false },
            { label: "Member Since", value: fmt(hosp.joinedDate), highlight: false },
          ].map((item, i) => (
            <div key={i} className={cn("px-5 py-4 text-center", i > 0 && "border-t border-border sm:border-t-0")}>
              <p className={cn("text-lg font-bold", item.highlight ? "text-primary" : "text-foreground")}>
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            value: donors.length,
            label: "Total Donors",
            sub: "Registered in your city",
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
            tab: 1,
          },
          {
            value: eligible,
            label: "Ready to Donate",
            sub: "Eligible & available now",
            icon: UserCheck,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            tab: 1,
          },
          {
            value: pending,
            label: "Pending Requests",
            sub: "Awaiting donor response",
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            tab: 3,
          },
          {
            value: completed,
            label: "Fulfilled Requests",
            sub: "Successfully completed",
            icon: CheckCircle2,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            tab: 3,
          },
        ].map(s => (
          <div key={s.label}
            onClick={() => setTab(s.tab)}
            className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04] cursor-pointer group">
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mt-0.5 transition-transform group-hover:scale-110",
              s.bg
            )}>
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-black text-foreground leading-none">{s.value}</p>
              <p className="text-sm font-semibold text-foreground mt-1.5">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Availability toggle — mirrors donor "Donation Availability" ── */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Emergency Search Visibility</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Toggle whether donors can see your emergency requests.</p>
          </div>
          <Button size="sm" className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={() => setTab(2)}>
            <Send className="h-3.5 w-3.5" />New Request
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Your hospital is visible to donors searching for blood requests in {hosp.city}.
        </div>
      </div>

      {/* ── Recent requests ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-semibold text-foreground">Recent Requests</h3>
          <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 rounded-lg" onClick={() => setTab(3)}>
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {requests.slice(0, 4).map(r => (
            <div key={r.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary font-mono">
                {r.bg}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.id} — {r.units} unit{r.units > 1 ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fmtTime(r.date)}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <UrgencyBadge urgency={r.urgency} />
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. FIND DONORS
═══════════════════════════════════════════════════════════ */
function FindDonors({ onSent }: { onSent: () => void }) {
  const hosp = useHosp();
  const [selBG, setSelBG] = useState("")
  const [city, setCity] = useState("")
  const [avail, setAvail] = useState<"all" | "eligible">("all")
  const [results, setResults] = useState<typeof ALL_DONORS | null>(null)
  const [contacted, setContacted] = useState<number[]>([])

  const [loading, setLoading] = useState(false)

  const doSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selBG) params.set("bloodGroup", selBG)
      if (city.trim()) params.set("city", city.trim())
      if (avail === "eligible") params.set("available", "true")

      const res = await fetch(`http://localhost:5000/api/donors/search?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          bg: d.bloodGroup,
          city: d.city,
          area: d.district || "",
          lastDon: d.lastDonation || "",
          eligible: d.eligible === 1,
          phone: d.mobile || ""
        }))
        setResults(mapped)
      }
    } catch (err) {
      console.error("Error searching donors:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (donor: any) => {
    try {
      const token = sessionStorage.getItem('hospitalToken') || localStorage.getItem('hospitalToken') || localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          donor_id: donor.id,
          bloodGroup: donor.bg,
          units: 1, // Default to 1 for direct search requests
          urgency: 'Normal',
          notes: `Direct request to ${donor.name}`,
          request_type: 'Direct',
          city: donor.city
        })
      })
      if (res.ok) {
        setContacted(p => [...p, donor.id])
        onSent()
      }
    } catch (err) {
      console.error("Error sending request:", err)
    }
  }

  const clear = () => { setSelBG(""); setCity(""); setAvail("all"); setResults(null) }

  return (
    <div className="flex flex-col gap-6">

      {/* Search panel */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Smart Donor Search
            </h3>
            <p className="text-sm text-muted-foreground">Filter by blood group, city and eligibility.</p>
          </div>
        </div>

        {/* Blood group grid */}
        <div className="flex flex-col gap-2 mb-5">
          <Label className="text-sm font-medium">Blood Group</Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg} type="button" onClick={() => setSelBG(p => p === bg ? "" : bg)}
                className={cn(
                  "flex items-center justify-center rounded-xl border py-2.5 text-sm font-bold transition-all font-mono",
                  selBG === bg
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                )}>
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">City / Area</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Anand, Vadodara…" className="rounded-xl pl-9" value={city}
                onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && doSearch()} />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label className="text-sm font-medium">Availability</Label>
            <div className="flex gap-2 h-10">
              {(["all", "eligible"] as const).map(v => (
                <button key={v} onClick={() => setAvail(v)}
                  className={cn(
                    "flex-1 rounded-xl border text-sm font-medium transition-all",
                    avail === v
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/20"
                  )}>
                  {v === "all" ? "All Donors" : "Eligible Only"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={doSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Searching…" : "Search Donors"}
          </Button>
          {results !== null && <Button variant="outline" className="rounded-xl" onClick={clear}>Reset</Button>}
        </div>
      </div>

      {/* Default empty state */}
      {results === null && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
            <Search className="h-7 w-7 text-primary" />
          </div>
          <p className="font-semibold text-foreground">Search for Donors</p>
          <p className="mt-1 text-sm text-muted-foreground">Use the filters above to find compatible donors.</p>
        </div>
      )}

      {/* Results */}
      {results !== null && results.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground text-sm">No donors match your filters</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different blood group, city, or remove the eligibility filter.</p>
        </div>
      )}

      {results !== null && results.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{results.length}</strong> donor{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map(d => (
              <div key={d.id}
                className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-black text-sm font-mono">
                        {d.bg}
                      </div>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                        d.eligible ? "bg-emerald-500" : "bg-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />{d.area}, {d.city}
                      </p>
                    </div>
                  </div>
                  {d.eligible
                    ? <Badge className="rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Eligible</Badge>
                    : <Badge variant="secondary" className="rounded-full text-xs">Not Eligible</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" />{d.phone}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 shrink-0" />Last: {daysAgo(d.lastDon)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl flex-1 gap-1.5">
                    <Phone className="h-3.5 w-3.5" />Call
                  </Button>
                  {contacted.includes(d.id) ? (
                    <Button size="sm" className="rounded-xl flex-1 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-none" disabled>
                      <CheckCircle2 className="h-3.5 w-3.5" />Sent!
                    </Button>
                  ) : (
                    <Button size="sm" className="rounded-xl flex-1 gap-1.5 shadow-sm shadow-primary/20"
                      disabled={!d.eligible}
                      onClick={() => handleRequest(d)}>
                      <Send className="h-3.5 w-3.5" />{d.eligible ? "Request" : "Unavailable"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. EMERGENCY REQUEST
═══════════════════════════════════════════════════════════ */
function EmergencyRequest({ onSent, donors }: { onSent: () => void; donors: any[] }) {
  const hospData = useHosp();
  const [selBG, setSelBG] = useState("")
  
  const cityStock = React.useMemo(() => {
    const stock: Record<string, number> = { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "AB+": 0, "AB-": 0, "O+": 0, "O-": 0 }
    donors.forEach(d => {
      if (d.eligible && d.bloodGroup && stock[d.bloodGroup] !== undefined) {
        stock[d.bloodGroup]++
      }
    })
    return BLOOD_GROUPS.map(bg => ({ bg, n: stock[bg] }))
  }, [donors])

  const [hospName, setHospName] = useState(hospData.name)
  const [units, setUnits] = useState(1)
  const [level, setLevel] = useState<"Normal" | "High" | "Critical">("Critical")
  const [notes, setNotes] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!selBG) return
    setLoading(true)
    try {
      const token = sessionStorage.getItem('hospitalToken') || localStorage.getItem('hospitalToken') || localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bloodGroup: selBG,
          units,
          urgency: level,
          notes,
          request_type: 'Emergency',
          city: hospData.city
        })
      })
      if (res.ok) {
        setDone(true)
        onSent()
      }
    } catch (err) {
      console.error("Error sending emergency request:", err)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-20 text-center gap-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: "var(--font-heading)" }}>Request Sent!</p>
        <p className="mt-1 text-sm text-emerald-600/80 dark:text-emerald-400/70 max-w-xs mx-auto">
          Eligible <strong>{selBG}</strong> donors near {hospData.city} have been notified.
        </p>
      </div>
      <Button variant="outline" className="rounded-xl" onClick={() => { setDone(false); setSelBG(""); setUnits(1); setLevel("Critical"); setNotes("") }}>
        Send Another Request
      </Button>
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Emergency Request</h3>
              <p className="text-sm text-muted-foreground">Donors notified instantly on submission.</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />Live
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Hospital Name</Label>
            <Input value={hospName} onChange={e => setHospName(e.target.value)} className="rounded-xl" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Blood Group Required <span className="text-primary">*</span></Label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} type="button" onClick={() => setSelBG(bg)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border py-3 text-sm font-black transition-all font-mono",
                    selBG === bg
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                  )}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Units Required <span className="text-primary">*</span></Label>
            <div className="flex items-center gap-4">
              <button onClick={() => setUnits(u => Math.max(1, u - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{units}</span>
                <span className="text-sm text-muted-foreground ml-1.5">unit{units > 1 ? "s" : ""}</span>
              </div>
              <button onClick={() => setUnits(u => u + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Emergency Level <span className="text-primary">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: "Normal", note: "Within 24 hours", sel: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
                { v: "High", note: "Within 6 hours", sel: "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
                { v: "Critical", note: "Immediately", sel: "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400" },
              ] as const).map(u => (
                <button key={u.v} type="button" onClick={() => setLevel(u.v)}
                  className={cn(
                    "rounded-xl border py-3 text-sm font-semibold transition-all",
                    level === u.v ? u.sel : "border-border text-muted-foreground hover:border-border/80"
                  )}>
                  <div className="font-bold">{u.v}</div>
                  <div className="text-[10px] mt-0.5 opacity-70">{u.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Additional Notes</Label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[88px] text-foreground placeholder:text-muted-foreground"
              placeholder="Ward number, patient details, contact person on duty…" />
          </div>

          <Button className="w-full rounded-xl gap-2 shadow-sm shadow-primary/20 h-11" onClick={submit} disabled={!selBG}>
            <Send className="h-4 w-4" />Send Emergency Request
          </Button>
        </div>
      </div>

      {/* Info sidebar */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">How it works</p>
          </div>
          <div className="flex flex-col gap-2.5 text-xs text-amber-700/80 dark:text-amber-400/80">
            {["Select the required blood group.", "Set urgency — Critical alerts donors instantly.", "Submit — eligible donors in your city are notified.", "Donors who respond will contact you directly."].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold">{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Sending From</p>
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0" />{hospData.name}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{hospData.city}, {hospData.district}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{hospData.contactNumber}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Available in {hospData.city}</p>
          <div className="grid grid-cols-2 gap-2">
            {cityStock.map(s => (
              <div key={s.bg} className="flex items-center gap-2.5 rounded-xl bg-muted/40 border border-border/60 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-[10px] font-black font-mono shadow-sm shadow-primary/20 shrink-0">{s.bg}</div>
                <div>
                  <div className="text-base font-black text-foreground leading-none">{s.n}</div>
                  <div className="text-[10px] text-muted-foreground">available</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. REQUEST HISTORY — mirrors DonationTracker
═══════════════════════════════════════════════════════════ */
function RequestHistory({ requests, onDelete }: { requests: typeof INIT_REQUESTS; onDelete: (id: string) => void }) {
  const hosp = useHosp();
  const [statusFilter, setStatusFilter] = useState("All")
  const [bgFilter, setBgFilter] = useState("all")

  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status === "Pending").length,
    Completed: requests.filter(r => r.status === "Completed").length,
  }

  const filtered = requests.filter(r => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false
    if (bgFilter !== "all" && r.bg !== bgFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards — mirrors DonationTracker stat cards exactly */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Total Requests", value: counts.All, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Lives Impacted", value: counts.Completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Pending", value: counts.Pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className={cn("mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl", s.bg)}>
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <p className="text-3xl font-black text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs — same as DonationTracker */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(["All", "Pending", "Completed"] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                statusFilter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
              {f} <span className="ml-1 text-xs opacity-60">{counts[f as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Select value={bgFilter} onValueChange={setBgFilter}>
            <SelectTrigger className="rounded-xl w-40 h-9 text-sm">
              <SelectValue placeholder="All Blood Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* History list — mirrors donation history list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <History className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground">No requests found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-semibold text-foreground">Request History</h3>
            <Badge variant="secondary" className="rounded-full">{filtered.length} requests</Badge>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((r, i) => (
              <div key={r.id} className="flex flex-col hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4 px-6 py-3.5">
                  {/* Index badge — same style as donation #N badge */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    #{filtered.length - i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {r.id} · {r.bg} · {r.units} unit{r.units > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">{fmtTime(r.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <UrgencyBadge urgency={r.urgency} />
                    <StatusBadge status={r.status} />
                    {r.status === "Pending" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg text-xs h-7 px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        onClick={() => onDelete(r.id.replace('REQ-', ''))}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Donor Info Section */}
                {(r.status === "Accepted" || r.status === "Completed") && r.donorName && (
                  <div className="px-6 pb-4 pt-1 ml-13 flex flex-wrap items-center gap-4 border-t border-border/40 bg-primary/[0.02]">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Donor:</span> {r.donorName}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Contact:</span> {r.donorMobile}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. HOSPITAL PROFILE — mirrors Security + MyProfile
═══════════════════════════════════════════════════════════ */
function HospitalProfile() {
  const hosp = useHosp();
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rawError, setRawError] = useState("")
  const [form, setForm] = useState({ ...hosp })
  const [showDeactivate, setShowDeactivate] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  const upd = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))

  const setError = (msg: string) => {
    setRawError(msg)
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        errorRef.current.focus({ preventScroll: true })
      }
    }, 50)
  }

  const handleSave = async () => {
    setRawError("")
    // ── Validation matching hospital registration ──
    if (!form.name.trim()) return setError("Hospital Name is required.")
    if (!/^[A-Za-z\s]+$/.test(form.name)) return setError("Hospital name must not contain numbers or special characters.")
    if (!form.type) return setError("Please select a hospital type.")
    if (!form.contactPerson.trim()) return setError("Authorized person name is required.")
    if (!/^[A-Za-z\s]+$/.test(form.contactPerson)) return setError("Authorized person name must not contain numbers.")
    if (!form.contactNumber) return setError("Contact Number is required.")
    if (!/^\d{10}$/.test(form.contactNumber)) return setError("Mobile number must be exactly 10 digits.")
    if (!form.address.trim()) return setError("Full Address is required.")
    if (!form.city.trim()) return setError("City is required.")
    if (!form.district.trim()) return setError("District is required.")
    if (!form.email.trim()) return setError("Email is required.")
    if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(form.email)) return setError("Please enter a valid @gmail.com address.")

    setSaving(true)
    try {
      const token = sessionStorage.getItem('hospitalToken') || localStorage.getItem('hospitalToken') || localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/auth/hospital/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          regNumber: form.regNumber,
          contactPerson: form.contactPerson,
          designation: form.designation,
          contactNumber: form.contactNumber,
          address: form.address,
          city: form.city,
          district: form.district,
        })
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem('hospitalUser', JSON.stringify(data.user))
        setSaved(true)
        setEditMode(false)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error || 'Failed to update profile.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const Row = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value || "—"}</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      {saved && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {rawError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          className="rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20 text-center outline-none"
        >
          {rawError}
        </div>
      )}

      {/* My Profile action bar — mirrors donor MyProfile */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Your registered hospital information.</p>
        <Button size="sm" className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={() => setEditMode(e => !e)}>
          <Edit3 className="h-3.5 w-3.5" />{editMode ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>

      {/* Hospital Information — same card style as Personal Information */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Hospital Information</h3>
        </div>
        <div className="p-6">
          {editMode ? (
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Hospital Name *</Label>
                  <Input value={form.name} onChange={e => upd("name", e.target.value)} className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Hospital Type</Label>
                  <Select value={form.type} onValueChange={v => upd("type", v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Government Hospital", "Private Hospital", "Blood Bank", "Clinic"].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Full Address *</Label>
                <Input value={form.address} onChange={e => upd("address", e.target.value)} className="rounded-xl" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">City *</Label>
                  <Input value={form.city} onChange={e => upd("city", e.target.value)} className="rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">District</Label>
                  <Input value={form.district} onChange={e => upd("district", e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input type="email" value={form.email} onChange={e => upd("email", e.target.value)} className="rounded-xl" />
              </div>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <Row label="Hospital Name" value={form.name} />
              <Row label="Hospital Type" value={form.type} />
              <Row label="Reg. Number" value={form.regNumber} />
              <Row label="Email" value={form.email} />
              <Row label="Full Address" value={form.address} wide />
              <Row label="City" value={form.city} />
              <Row label="District" value={form.district} />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Verification</p>
                <Badge className="mt-1 w-fit rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs">✓ Verified</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Person — same as Location card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Contact Person</h3>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          {editMode ? (
            <>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Contact Person *</Label>
                <Input value={form.contactPerson} onChange={e => upd("contactPerson", e.target.value)} className="rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Designation</Label>
                <Input value={form.designation} onChange={e => upd("designation", e.target.value)} className="rounded-xl" />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label className="text-sm font-medium">Contact Number *</Label>
                <Input type="tel" value={form.contactNumber} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); upd("contactNumber", val); }} className="rounded-xl" placeholder="10-digit mobile number" />
              </div>
            </>
          ) : (
            <>
              <Row label="Contact Person" value={form.contactPerson} />
              <Row label="Designation" value={form.designation} />
              <Row label="Contact Number" value={form.contactNumber} />
            </>
          )}
        </div>
      </div>

      {editMode && (
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" className="rounded-xl" onClick={() => { setEditMode(false); setForm({ ...hosp }); setRawError("") }}>Cancel</Button>
          <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={handleSave} disabled={saving}>
            <CheckCircle2 className="h-4 w-4" />{saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      )}

      {/* Sign out — exact same as donor Security */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Sign Out</p>
            <p className="text-sm text-muted-foreground">Log out of your hospital account.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl gap-2" asChild>
          <Link
            href="/hospital/login"
            onClick={() => {
              clearHospitalAuth()
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>

      {/* Deactivate — same as donor Security deactivate block */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-card p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
              <UserX className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Deactivate Account</p>
              <p className="text-sm text-muted-foreground">Your hospital will be hidden from all donor searches.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 gap-2"
            onClick={() => setShowDeactivate(true)}>
            <Trash2 className="h-4 w-4" />Deactivate
          </Button>
        </div>
        {showDeactivate && (
          <div className="mt-5 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-4">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-1">Are you sure?</p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mb-4">Your profile will be hidden from all donor searches. You can reactivate anytime.</p>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white">Yes, Deactivate</Button>
              <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setShowDeactivate(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD SHELL — pixel-identical to donor DonorDashboard
═══════════════════════════════════════════════════════════ */
const getHospitalToken = () => {
  if (typeof window === 'undefined') return null
  const token = sessionStorage.getItem('hospitalToken')
  if (token) return token
  const legacy = localStorage.getItem('hospitalToken') || localStorage.getItem('token')
  if (legacy) {
    sessionStorage.setItem('hospitalToken', legacy)
    localStorage.removeItem('hospitalToken')
    localStorage.removeItem('token')
    return legacy
  }
  return null
}
const getHospitalUser = () => {
  if (typeof window === 'undefined') return null
  const user = sessionStorage.getItem('hospitalUser')
  if (user) return user
  const legacy = localStorage.getItem('hospitalUser') || localStorage.getItem('user')
  if (legacy) {
    sessionStorage.setItem('hospitalUser', legacy)
    localStorage.removeItem('hospitalUser')
    localStorage.removeItem('user')
    return legacy
  }
  return null
}
const clearHospitalAuth = () => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('hospitalToken')
  sessionStorage.removeItem('hospitalUser')
  localStorage.removeItem('hospitalToken')
  localStorage.removeItem('hospitalUser')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default function HospitalDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState(0)
  const [userData, setUserData] = React.useState(DEFAULT_HOSPITAL)
  const hosp = userData; // Required for main component inline references
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [requests, setRequests] = React.useState(INIT_REQUESTS)
  const [donors, setDonors] = React.useState<any[]>([])
  const pending = requests.filter(r => r.status === "Pending").length

  React.useEffect(() => {
    const mapHospData = (src: any, prev: any) => ({
      ...prev,
      id: src.id || prev.id,
      name: src.name || prev.name,
      type: src.type || prev.type,
      regNumber: src.regNumber || prev.regNumber,
      email: src.email || prev.email,
      contactPerson: src.contactPerson || prev.contactPerson,
      designation: src.designation || prev.designation,
      contactNumber: src.contactNumber || prev.contactNumber,
      address: src.address || prev.address,
      city: src.city || prev.city,
      district: src.district || prev.district,
      joinedDate: src.created_at ? src.created_at.split('T')[0] : prev.joinedDate,
      verified: src.status === 'approved',
    })

    try {
      const cached = getHospitalUser()
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.role && parsed.role !== 'hospital') {
          clearHospitalAuth()
          router.push('/hospital/login?error=role_mismatch')
          return
        }
        setUserData(prev => mapHospData(parsed, prev))
      }
    } catch (e) { }

    const fetchUser = async () => {
      const token = getHospitalToken()
      if (!token) { router.push('/hospital/login'); return; }
      try {
        const res = await fetch('http://localhost:5000/api/auth/hospital/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUserData(prev => mapHospData(data, prev))
          sessionStorage.setItem('hospitalUser', JSON.stringify(data))
        } else if (res.status === 401 || res.status === 403) {
          clearHospitalAuth()
          const isRoleMismatch = (await res.text()).toLowerCase().includes('permission') || res.status === 403
          router.push(`/hospital/login?error=${isRoleMismatch ? 'role_mismatch' : 'session_expired'}`)
        }
      } catch (err) { }
    }
    fetchUser()
  }, [router])

  React.useEffect(() => {
    if (!userData.city) return
    const fetchDonors = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donors/search?city=${userData.city}`)
        if (res.ok) {
          const data = await res.json()
          setDonors(data.map((d: any) => ({ ...d, eligible: d.eligible === 1 })))
        }
      } catch (err) { console.error(err) }
    }
    fetchDonors()
  }, [userData.city])

  const fetchRequests = async () => {
    const token = getHospitalToken()
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/requests/hospital', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data.map((r: any) => ({
          id: `REQ-${r.id}`,
          bg: r.bloodGroup,
          units: r.units,
          urgency: r.urgency,
          status: r.status,
          date: r.created_at,
          donorName: r.donorName,
          donorMobile: r.donorMobile
        })))
      }
    } catch (err) { console.error(err) }
  }

  const deleteRequest = async (id: string) => {
    const token = getHospitalToken()
    if (!token) return
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        fetchRequests()
      }
    } catch (err) { console.error(err) }
  }

  React.useEffect(() => {
    if (userData.id) fetchRequests()
  }, [userData.id])

  const VIEWS = [
    <Overview key="o" requests={requests} donors={donors} setTab={setActiveTab} />,
    <FindDonors key="fd" onSent={fetchRequests} />,
    <EmergencyRequest key="er" onSent={fetchRequests} donors={donors} />,
    <RequestHistory key="rh" requests={requests} onDelete={deleteRequest} />,
    <HospitalProfile key="hp" />,
  ]

  return (
    <HospContext.Provider value={userData}>
      <div className="min-h-screen bg-background">

        {/* ── Topbar — copy-paste from donor, swapping blood group chip for hospital chip ── */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-6">

            {/* Left */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9"
                onClick={() => setSidebarOpen(s => !s)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
                  <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  BloodLink
                </span>
              </Link>
            </div>

            {/* Right: hospital chip — same layout as donor blood group chip */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-1.5">
                {/* Hospital icon + green dot — mirrors blood group badge + green dot */}
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-foreground leading-none">{hosp.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Verified ✓</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Body: sidebar + main — exact same structure as donor ── */}
        <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-6">
          <div className="flex gap-6">

            {/* Sidebar — identical markup/classes to donor */}
            <aside className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border pt-20 pb-6 px-3 transition-transform duration-300",
              "md:static md:translate-x-0 md:border-0 md:pt-0 md:pb-0 md:w-56 md:shrink-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>

              {/* Combined Logout in Nav (matches Donor Dashboard) */}

              {/* Nav — identical to donor */}
              <nav className="flex flex-col gap-1">
                {NAV.map((item, i) => (
                  <button key={item.label}
                    onClick={() => { setActiveTab(i); setSidebarOpen(false) }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-left",
                      activeTab === i
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}

                  </button>
                ))}
              </nav>

              <div className="mt-4 border-t border-border pt-4">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-foreground text-sm" asChild>
                  <Link
                    href="/hospital/login"
                    onClick={() => {
                      clearHospitalAuth()
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Link>
                </Button>
              </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content — identical to donor */}
            <main className="flex-1 min-w-0">
              {/* Breadcrumb + page title — pixel-identical to donor */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Link
                    href="/hospital"
                    className="hover:text-foreground transition-colors"
                  >
                    Hospital
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">
                    {NAV[activeTab].label}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {activeTab === 0
                    ? `Welcome, ${hosp.name.split(" ")[0]} ${hosp.name.split(" ")[1]}! 🏥`
                    : NAV[activeTab].label}
                </h1>
              </div>

              {VIEWS[activeTab]}
            </main>

          </div>
        </div>
      </div>
    </HospContext.Provider>
  )
}