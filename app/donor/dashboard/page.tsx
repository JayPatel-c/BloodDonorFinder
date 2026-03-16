"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Heart, Droplets, Calendar, Clock, User, Bell, LogOut,
  ChevronRight, Edit3, MapPin, Phone, CheckCircle2, AlertCircle,
  Activity, Award, Menu, X, Shield, Trash2, KeyRound,
  UserX, Send, TrendingUp, Stethoscope, Mail, Weight,
} from "lucide-react"
import Link from "next/link"

// ─── Mock donor — replace with real session/API data ──────
const DONOR = {
  fullName:          "Dhruvin Patel",
  gender:            "male",
  dob:               "2001-05-14",
  mobile:            "+91 98765 43210",
  email:             "dhruvin@example.com",
  bloodGroup:        "B+",
  lastDonation:      "2024-11-10",
  weight:            "68",
  chronicDisease:    false,
  address:           "12, Shanti Nagar",
  city:              "Anand",
  district:          "Anand",
  pin:               "388001",
  availabilityType:  "both",
  preferredContact:  "whatsapp",
  available:         true,
  totalDonations:    7,
  joinedDate:        "2023-04-15",
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function nextEligibleDate(last: string) {
  const d = new Date(last); d.setDate(d.getDate() + 90)
  return d.toISOString().split("T")[0]
}
function daysUntil(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000))
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function calcAge(dob: string) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const HISTORY = [
  { id: 1, date: "2024-11-10", hospital: "Shree Krishna Hospital",  units: 1 },
  { id: 2, date: "2024-07-22", hospital: "Civil Hospital Anand",    units: 1 },
  { id: 3, date: "2024-03-05", hospital: "Nirali Medical Center",   units: 1 },
  { id: 4, date: "2023-10-18", hospital: "Shree Krishna Hospital",  units: 1 },
  { id: 5, date: "2023-06-30", hospital: "Life Care Hospital",      units: 1 },
  { id: 6, date: "2023-02-14", hospital: "Civil Hospital Anand",    units: 1 },
  { id: 7, date: "2022-09-08", hospital: "Nirali Medical Center",   units: 1 },
]

const REQUESTS = [
  { id: 1, hospital: "Civil Hospital Anand",   bloodGroup: "B+", urgency: "Critical", time: "2 hrs ago",  units: 2, distance: "1.2 km" },
  { id: 2, hospital: "Shree Krishna Hospital", bloodGroup: "B+", urgency: "Urgent",   time: "5 hrs ago",  units: 1, distance: "2.8 km" },
  { id: 3, hospital: "Nirali Medical Center",  bloodGroup: "B+", urgency: "Normal",   time: "1 day ago",  units: 1, distance: "4.1 km" },
]

const NAV = [
  { label: "Overview",           icon: Activity   },
  { label: "My Profile",         icon: User       },
  { label: "Update Profile",     icon: Edit3      },
  { label: "Donation Tracker",   icon: Droplets   },
  { label: "Emergency Requests", icon: AlertCircle },
  { label: "Security",           icon: Shield     },
]

// ─── 1. Overview ──────────────────────────────────────────
function Overview({ available, setAvailable, setTab }: {
  available: boolean
  setAvailable: (v: boolean) => void
  setTab: (i: number) => void
}) {
  const nextEligible = nextEligibleDate(DONOR.lastDonation)
  const days         = daysUntil(nextEligible)
  const eligible     = days === 0

  return (
    <div className="flex flex-col gap-6">
      {/* Hero profile strip */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="bg-primary/5 border-b border-border px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <span className="text-2xl font-black">{DONOR.bloodGroup}</span>
              </div>
              <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${available ? "bg-emerald-500" : "bg-muted-foreground"}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{DONOR.fullName}</h2>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{DONOR.city}, {DONOR.district}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{DONOR.mobile}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${eligible ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"}`}>
              {eligible ? "✓ Eligible to Donate" : `Not Eligible · ${days}d left`}
            </Badge>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs border-primary/20 text-primary" onClick={() => setTab(2)}>
              <Edit3 className="h-3 w-3" />Edit
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {[
            { label: "Blood Group",     value: DONOR.bloodGroup,            highlight: true  },
            { label: "Total Donations", value: DONOR.totalDonations                          },
            { label: "Last Donated",    value: fmt(DONOR.lastDonation)                       },
            { label: "Member Since",    value: fmt(DONOR.joinedDate)                         },
          ].map((item, i) => (
            <div key={i} className="px-5 py-4 text-center">
              <p className={`text-lg font-bold ${item.highlight ? "text-primary" : "text-foreground"}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Lives Saved",        value: `${DONOR.totalDonations * 3}+`, icon: Heart,        color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10"     },
          { label: "Next Eligible",      value: eligible ? "Today!" : `${days}d`, icon: Calendar,   color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10"   },
          { label: "Donor Rank",         value: "Silver",                        icon: Award,        color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10" },
          { label: "Requests Near You",  value: REQUESTS.length,                 icon: AlertCircle,  color: "text-primary",     bg: "bg-primary/10"                      },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04]">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Availability toggle */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Donation Availability</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Toggle whether hospitals can find you in emergencies.</p>
          </div>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </div>
        <div className={`mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm ${available ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
          <div className={`h-2 w-2 rounded-full ${available ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
          {available
            ? `Your profile is visible to hospitals searching for ${DONOR.bloodGroup} donors in ${DONOR.city}.`
            : "You are hidden from donor searches."}
        </div>
      </div>
    </div>
  )
}

// ─── 2. My Profile (view-only) ────────────────────────────
function MyProfile({ setTab }: { setTab: (i: number) => void }) {
  const age      = calcAge(DONOR.dob)
  const eligible = Number(DONOR.weight) >= 50 && !DONOR.chronicDisease

  const Row = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => (
    <div className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value || "—"}</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Your registered profile information.</p>
        <Button size="sm" className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={() => setTab(2)}>
          <Edit3 className="h-3.5 w-3.5" />Edit Profile
        </Button>
      </div>

      {/* Personal info */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Personal Information</h3>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Row label="Full Name"    value={DONOR.fullName} />
          <Row label="Gender"       value={DONOR.gender.charAt(0).toUpperCase() + DONOR.gender.slice(1)} />
          <Row label="Date of Birth" value={`${fmt(DONOR.dob)} (Age ${age})`} />
          <Row label="Mobile"       value={DONOR.mobile} />
          <Row label="Email"        value={DONOR.email} wide />
        </div>
      </div>

      {/* Medical info */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Medical Information</h3>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          {/* Blood group tile */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blood Group</p>
            <div className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <span className="text-base font-black">{DONOR.bloodGroup}</span>
            </div>
          </div>
          <Row label="Weight"           value={`${DONOR.weight} kg`} />
          <Row label="Last Donation"    value={fmt(DONOR.lastDonation)} />
          <Row label="Chronic Disease"  value={DONOR.chronicDisease ? "Yes" : "No"} />
          {/* Eligibility badge */}
          <div className="sm:col-span-2">
            <div className={`flex items-center gap-3 rounded-xl border p-4 ${eligible ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10" : "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10"}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${eligible ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-amber-100 dark:bg-amber-500/20"}`}>
                <Shield className={`h-5 w-5 ${eligible ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${eligible ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {eligible ? "Medically Eligible to Donate" : "Not Currently Eligible"}
                </p>
                <p className={`text-xs mt-0.5 ${eligible ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-amber-600/70 dark:text-amber-400/70"}`}>
                  Weight ≥ 50 kg and no chronic disease required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Location</h3>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Row label="Full Address" value={DONOR.address} wide />
          <Row label="City"         value={DONOR.city} />
          <Row label="District"     value={DONOR.district} />
          <Row label="PIN Code"     value={DONOR.pin} />
        </div>
      </div>

      {/* Availability preferences */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Availability Preferences</h3>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Availability Type</p>
            <Badge variant="secondary" className="mt-1 w-fit rounded-full">
              {DONOR.availabilityType === "both" ? "Regular + Emergency" : "Emergency Only"}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preferred Contact</p>
            <Badge variant="secondary" className="mt-1 w-fit rounded-full capitalize">
              {DONOR.preferredContact}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 3. Update Profile ────────────────────────────────────
function UpdateProfile() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ ...DONOR })
  const upd = (field: string, value: string | boolean) => setForm(p => ({ ...p, [field]: value }))

  const isEligible = Number(form.weight) >= 50 && !form.chronicDisease

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* ── Step 1: Personal Info ── */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Personal Information</h3>
            <p className="text-sm text-muted-foreground">Update your basic personal details.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Full Name</Label>
            <Input value={form.fullName} onChange={e => upd("fullName", e.target.value)} className="rounded-xl" placeholder="Enter your full name" />
          </div>

          <div className="flex flex-col gap-2.5">
            <Label className="text-sm font-medium">Gender</Label>
            <RadioGroup value={form.gender} onValueChange={v => upd("gender", v)} className="flex gap-3">
              {["Male", "Female", "Other"].map(g => (
                <label key={g} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${form.gender === g.toLowerCase() ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/20"}`}>
                  <RadioGroupItem value={g.toLowerCase()} className="sr-only" />
                  {g}
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={e => upd("dob", e.target.value)} className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Mobile Number</Label>
              <Input value={form.mobile} onChange={e => upd("mobile", e.target.value)} className="rounded-xl" placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Email Address</Label>
            <Input type="email" value={form.email} onChange={e => upd("email", e.target.value)} className="rounded-xl" placeholder="you@example.com" />
          </div>
        </div>
      </div>

      {/* ── Step 2: Medical Info ── */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Medical Information</h3>
            <p className="text-sm text-muted-foreground">Your medical details ensure safe donation.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Blood group grid — same as registration */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Blood Group</Label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(group => (
                <button key={group} type="button" onClick={() => upd("bloodGroup", group)}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-bold transition-all ${form.bloodGroup === group ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"}`}>
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Last Donation Date</Label>
              <Input type="date" value={form.lastDonation} onChange={e => upd("lastDonation", e.target.value)} className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Weight (kg)</Label>
              <Input type="number" value={form.weight} onChange={e => upd("weight", e.target.value)} className="rounded-xl" placeholder="e.g. 65" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <Label className="text-sm font-medium">Any Chronic Disease?</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Select if you have chronic conditions.</p>
            </div>
            <Switch checked={form.chronicDisease} onCheckedChange={v => upd("chronicDisease", v)} />
          </div>

          {/* Eligibility indicator */}
          <div className={`rounded-xl border p-4 ${isEligible ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10" : "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10"}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isEligible ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-amber-100 dark:bg-amber-500/20"}`}>
                <Shield className={`h-5 w-5 ${isEligible ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${isEligible ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {isEligible ? "Eligible to Donate" : "Not Currently Eligible"}
                </p>
                <p className={`text-xs ${isEligible ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-amber-600/70 dark:text-amber-400/70"}`}>
                  Donors must weigh at least 50 kg and not have chronic diseases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step 3: Location ── */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Location Details</h3>
            <p className="text-sm text-muted-foreground">Helps connect nearby patients during emergencies.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Full Address</Label>
            <Input value={form.address} onChange={e => upd("address", e.target.value)} className="rounded-xl" placeholder="Street address, area" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">City</Label>
              <Input value={form.city} onChange={e => upd("city", e.target.value)} className="rounded-xl" placeholder="Enter city" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">District</Label>
              <Input value={form.district} onChange={e => upd("district", e.target.value)} className="rounded-xl" placeholder="Enter district" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">PIN Code</Label>
            <Input value={form.pin} onChange={e => upd("pin", e.target.value)} className="rounded-xl" placeholder="6-digit PIN" />
          </div>
          <Button variant="outline" className="w-full gap-2 rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5">
            <MapPin className="h-4 w-4" />Auto-detect My Location (GPS)
          </Button>
        </div>
      </div>

      {/* ── Step 4: Availability ── */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Availability Preferences</h3>
            <p className="text-sm text-muted-foreground">When and how you prefer to be contacted.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-sm font-medium">Availability Type</Label>
            <RadioGroup value={form.availabilityType} onValueChange={v => upd("availabilityType", v)} className="flex flex-col gap-3">
              {[
                { value: "emergency", title: "Emergency Only",         desc: "Contact me only during critical emergencies." },
                { value: "both",      title: "Regular + Emergency",    desc: "Available for both scheduled and emergency donations." },
              ].map(opt => (
                <label key={opt.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${form.availabilityType === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"}`}>
                  <RadioGroupItem value={opt.value} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{opt.title}</span>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2.5">
            <Label className="text-sm font-medium">Preferred Contact Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "phone",     label: "Phone Call" },
                { value: "sms",       label: "SMS"        },
                { value: "whatsapp",  label: "WhatsApp"   },
              ].map(m => (
                <button key={m.value} type="button" onClick={() => upd("preferredContact", m.value)}
                  className={`rounded-xl border p-3 text-sm font-medium transition-all ${form.preferredContact === m.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/20"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mini review panel */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm font-semibold text-foreground mb-3">Review your information</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {[
                { label: "Name",       value: form.fullName    },
                { label: "Blood Group",value: form.bloodGroup  },
                { label: "City",       value: form.city        },
                { label: "Mobile",     value: form.mobile      },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-card p-2.5 px-3">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value || "---"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save / Cancel */}
      <div className="flex gap-3">
        <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={handleSave}>
          <CheckCircle2 className="h-4 w-4" />Save All Changes
        </Button>
        <Button variant="outline" className="rounded-xl">Cancel</Button>
      </div>
    </div>
  )
}

// ─── 4. Donation Tracker ──────────────────────────────────
function DonationTracker() {
  const nextEligible = nextEligibleDate(DONOR.lastDonation)
  const days     = daysUntil(nextEligible)
  const eligible = days === 0
  const progress = Math.round(((90 - days) / 90) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded-2xl border p-6 ${eligible ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10" : "border-border bg-card"}`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${eligible ? "bg-emerald-500/20" : "bg-amber-50 dark:bg-amber-500/10"}`}>
            {eligible ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Clock className="h-6 w-6 text-amber-500" />}
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${eligible ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
              {eligible ? "You can donate today! 🎉" : `Next eligible in ${days} days`}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Eligible from: <strong className="text-foreground">{fmt(nextEligible)}</strong>
            </p>
            {!eligible && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Recovery progress (90-day cycle)</span>
                  <span className="font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>{fmt(DONOR.lastDonation)}</span><span>{fmt(nextEligible)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Total Donations", value: DONOR.totalDonations,               icon: Droplets,   color: "text-primary",    bg: "bg-primary/10" },
          { label: "Lives Impacted",  value: DONOR.totalDonations * 3,           icon: Heart,      color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-500/10" },
          { label: "Years Active",    value: `${new Date().getFullYear() - new Date(DONOR.joinedDate).getFullYear()}+`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-3xl font-black text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-semibold text-foreground">Donation History</h3>
          <Badge variant="secondary" className="rounded-full">{HISTORY.length} donations</Badge>
        </div>
        <div className="divide-y divide-border">
          {HISTORY.map((d, i) => (
            <div key={d.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">#{HISTORY.length - i}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{d.hospital}</p>
                <p className="text-xs text-muted-foreground">{fmt(d.date)}</p>
              </div>
              <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100 text-xs">Completed</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 5. Emergency Requests ────────────────────────────────
function EmergencyRequests() {
  const [responded, setResponded] = useState<number[]>([])
  const [declined,  setDeclined]  = useState<number[]>([])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            {REQUESTS.filter(r => !responded.includes(r.id) && !declined.includes(r.id)).length} active {DONOR.bloodGroup} requests near {DONOR.city}
          </p>
        </div>
      </div>
      {REQUESTS.map(req => {
        const isResponded = responded.includes(req.id)
        const isDeclined  = declined.includes(req.id)
        return (
          <div key={req.id} className={`rounded-2xl border bg-card p-5 transition-all ${isResponded ? "border-emerald-200 dark:border-emerald-500/20" : isDeclined ? "border-border opacity-50" : "border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04]"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Droplets className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{req.hospital}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.distance}</span>
                    <span>· {req.units} unit(s) · {req.time}</span>
                  </div>
                </div>
              </div>
              <Badge className={`rounded-full text-xs shrink-0 ${req.urgency === "Critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" : req.urgency === "Urgent" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                {req.urgency}
              </Badge>
            </div>
            {isResponded ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />Responded — hospital will contact you soon.
              </div>
            ) : isDeclined ? (
              <p className="mt-4 text-sm text-muted-foreground">You declined this request.</p>
            ) : (
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1 rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={() => setResponded(p => [...p, req.id])}>
                  <Send className="h-3.5 w-3.5" />Respond
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setDeclined(p => [...p, req.id])}>Decline</Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── 6. Security ──────────────────────────────────────────
function Security() {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" })
  const [pwSaved, setPwSaved] = useState(false)
  const [showDeactivate, setShowDeactivate] = useState(false)
  const match = pw.next && pw.next === pw.confirm

  const handleSave = () => {
    if (!match) return
    setPwSaved(true); setPw({ current: "", next: "", confirm: "" })
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"><KeyRound className="h-5 w-5 text-primary" /></div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Change Password</h3>
            <p className="text-sm text-muted-foreground">Use a strong password to keep your account secure.</p>
          </div>
        </div>
        {pwSaved && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Password changed successfully!</p>
          </div>
        )}
        <div className="flex flex-col gap-5 max-w-md">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Current Password</Label>
            <Input type="password" placeholder="Enter current password" className="rounded-xl" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">New Password</Label>
            <Input type="password" placeholder="Enter new password" className="rounded-xl" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Confirm New Password</Label>
            <Input type="password" placeholder="Confirm new password" className="rounded-xl" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
            {pw.confirm && !match && <p className="text-xs text-rose-500">Passwords do not match.</p>}
          </div>
          <Button className="w-full rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={handleSave} disabled={!pw.current || !match}>
            <Shield className="h-4 w-4" />Update Password
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><LogOut className="h-5 w-5 text-muted-foreground" /></div>
          <div>
            <p className="font-semibold text-foreground">Sign Out</p>
            <p className="text-sm text-muted-foreground">Log out of your donor account.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl gap-2" asChild>
          <Link href="/donor/login"><LogOut className="h-4 w-4" />Logout</Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-card p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10"><UserX className="h-5 w-5 text-rose-500" /></div>
            <div>
              <p className="font-semibold text-foreground">Deactivate Account</p>
              <p className="text-sm text-muted-foreground">Your profile will be hidden from all searches.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 gap-2" onClick={() => setShowDeactivate(true)}>
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

export default function DonorDashboard() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(0)
  const [available, setAvailable] = useState(DONOR.available)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const nextEligible = nextEligibleDate(DONOR.lastDonation)
  const eligible = daysUntil(nextEligible) === 0

  const VIEWS = [
    <Overview key="o" available={available} setAvailable={setAvailable} setTab={setActiveTab} />,
    <MyProfile key="mp" setTab={setActiveTab} />,
    <UpdateProfile key="up" />,
    <DonationTracker key="dt" />,
    <EmergencyRequests key="er" />,
    <Security key="s" />,
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
                <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span
                className="text-lg font-bold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                BloodLink
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border pt-20 pb-6 px-3 transition-transform duration-300 md:static md:translate-x-0 md:border-0 md:pt-0 md:pb-0 md:w-56 md:shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            
            <nav className="flex flex-col gap-1">
              {NAV.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveTab(i)
                    setSidebarOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-left ${
                    activeTab === i
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              {/* 🔥 Updated Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Link
                  href="/donor"
                  className="hover:text-foreground transition-colors"
                >
                  Donor
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">
                  {NAV[activeTab].label}
                </span>
              </div>

              <h1
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {activeTab === 0
                  ? `Welcome back, ${DONOR.fullName.split(" ")[0]}! 👋`
                  : NAV[activeTab].label}
              </h1>
            </div>

            {VIEWS[activeTab]}
          </main>
        </div>
      </div>
    </div>
  )
}