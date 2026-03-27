"use client"

import { useState, useRef } from "react"
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

// ─── Default donor (empty – real data loads from API) ──────
const DEFAULT_DONOR = {
  fullName: "",
  gender: "",
  dob: "",
  mobile: "",
  email: "",
  bloodGroup: "",
  lastDonation: "",
  weight: "",
  chronicDisease: false,
  address: "",
  city: "",
  district: "",
  pin: "",
  availabilityType: "both",
  preferredContact: "phone",
  available: true,
  totalDonations: 0,
  joinedDate: "",
  id: "",
}


import React from 'react';
const UserContext = React.createContext(DEFAULT_DONOR);
const useUser = () => React.useContext(UserContext);

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

function nextEligibleDate(last: string) {
  if (!last) return ""
  const d = new Date(last); d.setDate(d.getDate() + 90)
  return d.toISOString().split("T")[0]
}
function daysUntil(dateStr: string) {
  if (!dateStr) return 0
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000))
}
function fmt(d: string) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function calcAge(dob: string) {
  if (!dob) return 0
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const HISTORY: { id: number; date: string; hospital: string; units: number }[] = []

const REQUESTS: { id: number; hospital: string; bloodGroup: string; urgency: string; time: string; units: number; distance: string }[] = []

const NAV = [
  { label: "Overview", icon: Activity },
  { label: "My Profile", icon: User },
  { label: "Update Profile", icon: Edit3 },
  { label: "Emergency Requests", icon: AlertCircle },
]

// ─── 1. Overview ──────────────────────────────────────────
function Overview({ available, setAvailable, setTab }: {
  available: boolean
  setAvailable: (v: boolean) => void
  setTab: (i: number) => void
}) {
  const user = useUser();
  const nextEligible = nextEligibleDate(user.lastDonation)
  const days = daysUntil(nextEligible)
  const eligible = days === 0

  return (
    <div className="flex flex-col gap-6">
      {/* Hero profile strip */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="bg-primary/5 border-b border-border px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                <span className="text-2xl font-black">{user.bloodGroup}</span>
              </div>
              <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${available ? "bg-emerald-500" : "bg-muted-foreground"}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{user.city}, {user.district}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{user.mobile}</span>
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
        <div className="grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-border sm:grid-cols-3">
          {[
            { label: "Blood Group", value: user.bloodGroup, highlight: true },
            { label: "Last Donated", value: fmt(user.lastDonation) },
            { label: "Member Since", value: fmt(user.joinedDate) },
          ].map((item, i) => (
            <div key={i} className="px-5 py-4 text-center">
              <p className={`text-lg font-bold ${item.highlight ? "text-primary" : "text-foreground"}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Next Eligible", value: eligible ? "Today!" : `${days}d`, icon: Calendar, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Requests Near You", value: REQUESTS.length, icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
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
            ? `Your profile is visible to hospitals searching for ${user.bloodGroup} donors in ${user.city}.`
            : "You are hidden from donor searches."}
        </div>
      </div>
    </div>
  )
}

// ─── 2. My Profile (view-only) ────────────────────────────
function MyProfile({ setTab }: { setTab: (i: number) => void }) {
  const user = useUser();
  const age = calcAge(user.dob)
  const eligible = Number(user.weight) >= 50 && !user.chronicDisease

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
          <Row label="Full Name" value={user.fullName} />
          <Row label="Gender" value={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} />
          <Row label="Date of Birth" value={`${fmt(user.dob)} (Age ${age})`} />
          <Row label="Mobile" value={user.mobile} />
          <Row label="Email" value={user.email} wide />
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
              <span className="text-base font-black">{user.bloodGroup}</span>
            </div>
          </div>
          <Row label="Weight" value={`${user.weight} kg`} />
          <Row label="Last Donation" value={fmt(user.lastDonation)} />
          <Row label="Chronic Disease" value={user.chronicDisease ? "Yes" : "No"} />
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
          <Row label="Full Address" value={user.address} wide />
          <Row label="City" value={user.city} />
          <Row label="District" value={user.district} />
          <Row label="PIN Code" value={user.pin} />
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
              {user.availabilityType === "both" ? "Regular + Emergency" : "Emergency Only"}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preferred Contact</p>
            <Badge variant="secondary" className="mt-1 w-fit rounded-full capitalize">
              {user.preferredContact}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 3. Update Profile ────────────────────────────────────
function UpdateProfile() {
  const user = useUser();
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rawError, setRawError] = useState("")
  const [form, setForm] = useState({ ...user })
  const errorRef = useRef<HTMLDivElement>(null)
  const upd = (field: string, value: string | boolean) => setForm(p => ({ ...p, [field]: value }))

  const setError = (msg: string) => {
    setRawError(msg)
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        errorRef.current.focus({ preventScroll: true })
      }
    }, 50)
  }

  const isEligible = Number(form.weight) >= 50 && !form.chronicDisease

  const maxTodayStr = new Date().toISOString().split("T")[0]

  const handleSave = async () => {
    setRawError("")
    // ── Validation matching registration ──
    if (!form.fullName.trim()) return setError("Full Name is required.")
    if (!/^[A-Za-z\s]+$/.test(form.fullName)) return setError("Name must not contain numbers or special characters.")
    if (!form.gender) return setError("Please select your gender.")
    if (!form.dob) return setError("Date of Birth is required.")
    const birthDate = new Date(form.dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    if (age < 18) return setError("You must be 18 or older to donate blood.")
    if (!form.mobile) return setError("Mobile number is required.")
    if (!/^\d{10}$/.test(form.mobile)) return setError("Mobile number must be exactly 10 digits.")
    if (!form.email.trim()) return setError("Email is required.")
    if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(form.email)) return setError("Please enter a valid @gmail.com address.")
    if (!form.bloodGroup) return setError("Please select a blood group.")
    if (form.lastDonation && new Date(form.lastDonation) > new Date()) return setError("Last donation date cannot be in the future.")
    if (!form.weight) return setError("Weight is required.")
    if (Number(form.weight) <= 50) return setError("Weight must be greater than 50 kg.")
    if (!form.address.trim()) return setError("Full Address is required.")
    if (!form.city.trim()) return setError("City is required.")
    if (!form.district.trim()) return setError("District is required.")
    if (!form.pin) return setError("PIN Code is required.")
    if (!/^\d{6}$/.test(form.pin)) return setError("PIN Code must be exactly 6 digits.")

    setSaving(true)
    try {
      const token = sessionStorage.getItem('donorToken') || localStorage.getItem('donorToken') || localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/auth/donor/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.fullName,
          gender: form.gender,
          dob: form.dob,
          mobile: form.mobile,
          bloodGroup: form.bloodGroup,
          lastDonation: form.lastDonation || null,
          weight: form.weight,
          chronicDisease: form.chronicDisease,
          address: form.address,
          city: form.city,
          district: form.district,
          pin: form.pin,
          availabilityType: form.availabilityType,
          preferredContact: form.preferredContact,
        })
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem('donorUser', JSON.stringify(data.user))
        setSaved(true)
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

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div
          style={{
            position: "fixed",
            top: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            minWidth: "340px",
            maxWidth: "480px",
            background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(5, 150, 105, 0.35), 0 8px 24px rgba(0,0,0,0.15)",
            padding: "0",
            overflow: "hidden",
            animation: "successSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <style>{`
            @keyframes successSlideIn {
              0% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.95); }
              100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
            @keyframes successProgressBar {
              0% { width: 100%; }
              100% { width: 0%; }
            }
            @keyframes successCheckPop {
              0% { transform: scale(0) rotate(-45deg); opacity: 0; }
              50% { transform: scale(1.2) rotate(0deg); opacity: 1; }
              100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes successShine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
          `}</style>

          {/* Shine effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              animation: "successShine 1.5s ease-in-out 0.3s",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 22px 14px 22px",
            }}
          >
            {/* Animated checkmark circle */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                animation: "successCheckPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Text content */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                Changes Saved Successfully!
              </p>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Your profile has been updated.
              </p>
            </div>
          </div>

          {/* Auto-dismiss progress bar */}
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "0 0 16px 16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "rgba(255,255,255,0.6)",
                borderRadius: "0 0 16px 16px",
                animation: "successProgressBar 3s linear forwards",
              }}
            />
          </div>
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
              <Input type="date" max={maxTodayStr} value={form.dob} onChange={e => upd("dob", e.target.value)} className="rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Mobile Number</Label>
              <Input value={form.mobile} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); upd("mobile", val); }} className="rounded-xl" placeholder="10-digit mobile number" />
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
              <Input type="date" max={maxTodayStr} value={form.lastDonation} onChange={e => upd("lastDonation", e.target.value)} className="rounded-xl" />
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
            <Input value={form.pin} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 6); upd("pin", val); }} className="rounded-xl" placeholder="6-digit PIN" />
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
                { value: "emergency", title: "Emergency Only", desc: "Contact me only during critical emergencies." },
                { value: "both", title: "Regular + Emergency", desc: "Available for both scheduled and emergency donations." },
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
                { value: "phone", label: "Phone Call" },
                { value: "sms", label: "SMS" },
                { value: "whatsapp", label: "WhatsApp" },
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
                { label: "Name", value: form.fullName },
                { label: "Blood Group", value: form.bloodGroup },
                { label: "City", value: form.city },
                { label: "Mobile", value: form.mobile },
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
        <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={handleSave} disabled={saving}>
          <CheckCircle2 className="h-4 w-4" />{saving ? "Saving..." : "Save All Changes"}
        </Button>
        <Button variant="outline" className="rounded-xl" onClick={() => { setForm({ ...user }); setRawError("") }}>Cancel</Button>
      </div>
    </div>
  )
}



// ─── 5. Emergency Requests ────────────────────────────────
function EmergencyRequests({ requests, onUpdate }: { requests: any[]; onUpdate: () => void }) {
  const user = useUser();
  const [loading, setLoading] = useState<number | null>(null)

  const handleStatus = async (id: number, status: 'Accepted' | 'Rejected') => {
    setLoading(id)
    try {
      const token = sessionStorage.getItem('donorToken') || localStorage.getItem('donorToken') || localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            {requests.length} active {user.bloodGroup} requests near {user.city}
          </p>
        </div>
      </div>
      {requests.map(req => (
        <div key={req.id} className="rounded-2xl border bg-card p-5 transition-all border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04]">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{req.hospitalName}</p>
                <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.hospitalCity}</span>
                  <span>· {req.units} unit(s) · {fmt(req.created_at)}</span>
                </div>
                {req.notes && <p className="mt-2 text-xs text-muted-foreground italic">"{req.notes}"</p>}
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-primary">
                  <Phone className="h-3 w-3" /> {req.hospitalPhone}
                </div>
              </div>
            </div>
            <Badge className={`rounded-full text-xs shrink-0 ${req.urgency === "Critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" : req.urgency === "High" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
              {req.urgency}
            </Badge>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1 rounded-xl gap-2 shadow-sm shadow-primary/20"
              onClick={() => handleStatus(req.id, 'Accepted')}
              disabled={loading === req.id}>
              {loading === req.id ? "..." : <><Send className="h-3.5 w-3.5" />Respond</>}
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl"
              onClick={() => handleStatus(req.id, 'Rejected')}
              disabled={loading === req.id}>
              Decline
            </Button>
          </div>
        </div>
      ))}
      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">No pending requests at the moment.</p>
        </div>
      )}
    </div>
  )
}



export default function DonorDashboard() {
  const router = useRouter()
  const getDonorToken = () => {
    const token = sessionStorage.getItem('donorToken')
    if (token) return token
    const legacy = localStorage.getItem('donorToken') || localStorage.getItem('token')
    if (legacy) {
      sessionStorage.setItem('donorToken', legacy)
      localStorage.removeItem('donorToken')
      localStorage.removeItem('token')
      return legacy
    }
    return null
  }
  const getDonorUser = () => {
    const user = sessionStorage.getItem('donorUser')
    if (user) return user
    const legacy = localStorage.getItem('donorUser') || localStorage.getItem('user')
    if (legacy) {
      sessionStorage.setItem('donorUser', legacy)
      localStorage.removeItem('donorUser')
      localStorage.removeItem('user')
      return legacy
    }
    return null
  }
  const clearDonorAuth = () => {
    sessionStorage.removeItem('donorToken')
    sessionStorage.removeItem('donorUser')
    localStorage.removeItem('donorToken')
    localStorage.removeItem('donorUser')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  const [activeTab, setActiveTab] = React.useState(0)
  const [userData, setUserData] = React.useState(DEFAULT_DONOR)
  const user = userData; // Required for the main component's inline references
  const [available, setAvailableState] = React.useState(DEFAULT_DONOR.available)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Toggle availability via API
  const setAvailable = async (val: boolean) => {
    setAvailableState(val)
    try {
      const token = getDonorToken()
      await fetch('http://localhost:5000/api/donors/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ available: val })
      })
    } catch (err) {
      console.error('Error updating availability:', err)
      setAvailableState(!val) // revert on failure
    }
  }

  React.useEffect(() => {
    const mapDonorData = (src: any, prev: any) => ({
      ...prev,
      id: src.id || prev.id,
      fullName: src.name || prev.fullName,
      gender: src.gender || prev.gender,
      dob: src.dob ? src.dob.split('T')[0] : prev.dob,
      mobile: src.mobile || prev.mobile,
      email: src.email || prev.email,
      bloodGroup: src.bloodGroup || prev.bloodGroup,
      lastDonation: src.lastDonation ? src.lastDonation.split('T')[0] : prev.lastDonation,
      weight: src.weight || prev.weight,
      chronicDisease: src.chronicDisease ? true : false,
      address: src.address || prev.address,
      city: src.city || prev.city,
      district: src.district || prev.district,
      pin: src.pin || prev.pin,
      availabilityType: src.availabilityType || prev.availabilityType,
      preferredContact: src.preferredContact || prev.preferredContact,
      joinedDate: src.created_at ? src.created_at.split('T')[0] : prev.joinedDate,
    })

    let isMounted = true;
    const fetchUser = async () => {
      const token = getDonorToken()
      if (!token) {
        if (isMounted) router.push('/donor/login')
        return
      }
      try {
        const res = await fetch('http://localhost:5000/api/auth/donor/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (!isMounted) return
          setUserData(prev => mapDonorData(data, prev))
          if (data.available !== undefined) setAvailableState(!!data.available)
          sessionStorage.setItem('donorUser', JSON.stringify(data))
        } else if (res.status === 401 || res.status === 403) {
          const errorText = await res.text()
          if (!isMounted) return
          clearDonorAuth()
          const isRoleMismatch = errorText.toLowerCase().includes('permission') || res.status === 403
          router.push(`/donor/login?error=${isRoleMismatch ? 'role_mismatch' : 'session_expired'}`)
        }
      } catch (err) { }
    }

    // Role check from cache
    try {
      const cached = getDonorUser()
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.role && parsed.role !== 'donor') {
          clearDonorAuth()
          router.push('/donor/login?error=role_mismatch')
          return
        }
        setUserData(prev => mapDonorData(parsed, prev))
        if (parsed.available !== undefined) setAvailableState(!!parsed.available)
      }
    } catch (e) { }

    fetchUser()
    return () => { isMounted = false }
  }, []) // Only run once on mount

  const [requests, setRequests] = React.useState<any[]>([])

  const fetchRequests = async () => {
    const token = getDonorToken()
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/requests/donor', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (err) { console.error(err) }
  }

  React.useEffect(() => {
    if (userData.id) fetchRequests()
  }, [userData.id])

  const VIEWS = [
    <Overview key="o" available={available} setAvailable={setAvailable} setTab={setActiveTab} />,
    <MyProfile key="mp" setTab={setActiveTab} />,
    <UpdateProfile key="up" />,
    <EmergencyRequests key="er" requests={requests} onUpdate={fetchRequests} />,
  ]

  return (
    <UserContext.Provider value={userData}>
      <div className="min-h-screen bg-background">
        {/* Topbar */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-6">
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

        <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-6">
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
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-left ${activeTab === i
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                ))}

                <div className="my-2 border-t border-border" />

                <button
                  onClick={() => {
                    clearDonorAuth()
                    router.push('/donor/login')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Log Out
                </button>
              </nav>
            </aside>

            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

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
                    {NAV[activeTab]?.label || NAV[0].label}
                  </span>
                </div>

                <h1
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {activeTab === 0
                    ? `Welcome back, ${user.fullName.split(" ")[0]}! 👋`
                    : NAV[activeTab]?.label || NAV[0].label}
                </h1>
              </div>

              {VIEWS[activeTab] || VIEWS[0]}
            </main>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  )
}