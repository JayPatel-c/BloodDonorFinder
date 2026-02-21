"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, User, Stethoscope, MapPin, Bell, Shield } from "lucide-react"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Medical Info", icon: Stethoscope },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Availability", icon: Bell },
]

export function DonorRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    password: "",           // ✅ ADD THIS
    confirmPassword: "",
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
  })

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const passwordsMatch =
  formData.password &&
  formData.confirmPassword &&
  formData.password === formData.confirmPassword

  const isEligible = Number(formData.weight) >= 50 && !formData.chronicDisease
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2.5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : currentStep === step.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-3 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Personal Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Provide your basic personal details.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                className="rounded-xl"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-sm font-medium">Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(v) => updateField("gender", v)}
                className="flex gap-3"
              >
                {["Male", "Female", "Other"].map((g) => (
                  <label
                    key={g}
                    htmlFor={g.toLowerCase()}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                      formData.gender === g.toLowerCase()
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    <RadioGroupItem value={g.toLowerCase()} id={g.toLowerCase()} className="sr-only" />
                    {g}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  className="rounded-xl"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="+91 XXXXX XXXXX"
                  className="rounded-xl"
                  value={formData.mobile}
                  onChange={(e) => updateField("mobile", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-xl"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Create Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="rounded-xl"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="rounded-xl"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Medical Info */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Medical Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Your medical details ensure safe donation.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Blood Group</Label>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => updateField("bloodGroup", group)}
                    className={`flex items-center justify-center rounded-xl border p-3 text-sm font-bold transition-all ${
                      formData.bloodGroup === group
                        ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastDonation" className="text-sm font-medium">Last Donation Date</Label>
                <Input
                  id="lastDonation"
                  type="date"
                  className="rounded-xl"
                  value={formData.lastDonation}
                  onChange={(e) => updateField("lastDonation", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g. 65"
                  className="rounded-xl"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <Label htmlFor="chronicDisease" className="text-sm font-medium">Any Chronic Disease?</Label>
                <p className="text-xs text-muted-foreground">Select if you have chronic conditions.</p>
              </div>
              <Switch
                id="chronicDisease"
                checked={formData.chronicDisease}
                onCheckedChange={(v) => updateField("chronicDisease", v)}
              />
            </div>

            <div className={`rounded-xl border p-4 ${isEligible ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isEligible ? "bg-emerald-100" : "bg-amber-100"}`}>
                  <Shield className={`h-5 w-5 ${isEligible ? "text-emerald-600" : "text-amber-600"}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isEligible ? "text-emerald-700" : "text-amber-700"}`}>
                    {isEligible ? "Eligible to Donate" : "Not Currently Eligible"}
                  </p>
                  <p className={`text-xs ${isEligible ? "text-emerald-600" : "text-amber-600"}`}>
                    Donors must weigh at least 50kg and not have chronic diseases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Location Details
              </h3>
              <p className="text-sm text-muted-foreground">
                Helps connect nearby patients during emergencies.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="address" className="text-sm font-medium">Full Address</Label>
              <Input
                id="address"
                placeholder="Street address, area"
                className="rounded-xl"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  className="rounded-xl"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="district" className="text-sm font-medium">District</Label>
                <Input
                  id="district"
                  placeholder="Enter district"
                  className="rounded-xl"
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="pin" className="text-sm font-medium">PIN Code</Label>
              <Input
                id="pin"
                placeholder="6-digit PIN"
                className="rounded-xl"
                value={formData.pin}
                onChange={(e) => updateField("pin", e.target.value)}
              />
            </div>

            <Button variant="outline" className="w-full gap-2 rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5">
              <MapPin className="h-4 w-4" />
              Auto-detect My Location (GPS)
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Availability */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Availability Preferences
              </h3>
              <p className="text-sm text-muted-foreground">
                When and how you prefer to be contacted.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <Label className="text-sm font-medium">Availability Type</Label>
              <RadioGroup
                value={formData.availabilityType}
                onValueChange={(v) => updateField("availabilityType", v)}
                className="flex flex-col gap-3"
              >
                <label
                  htmlFor="emergency"
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                    formData.availabilityType === "emergency"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  <RadioGroupItem value="emergency" id="emergency" className="mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">Emergency Only</span>
                    <p className="text-xs text-muted-foreground">Contact me only during critical emergencies.</p>
                  </div>
                </label>
                <label
                  htmlFor="both"
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                    formData.availabilityType === "both"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  <RadioGroupItem value="both" id="both" className="mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">Regular + Emergency</span>
                    <p className="text-xs text-muted-foreground">Available for both scheduled and emergency donations.</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-sm font-medium">Preferred Contact Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "phone", label: "Phone Call" },
                  { value: "sms", label: "SMS" },
                  { value: "whatsapp", label: "WhatsApp" },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => updateField("preferredContact", method.value)}
                    className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                      formData.preferredContact === method.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground">Review your information</p>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  { label: "Name", value: formData.fullName },
                  { label: "Blood Group", value: formData.bloodGroup },
                  { label: "City", value: formData.city },
                  { label: "Mobile", value: formData.mobile },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-card p-2.5 px-3">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value || "---"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-7 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
          disabled={currentStep === 1}
          className="gap-2 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                s.id === currentStep ? "w-6 bg-primary" : s.id < currentStep ? "w-1.5 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep((p) => Math.min(4, p + 1))}
            className="gap-2 rounded-xl shadow-sm shadow-primary/20"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
            <Button
              disabled={!passwordsMatch}
              className="gap-2 rounded-xl shadow-sm shadow-primary/20"
            >
            <Check className="h-4 w-4" />
            Register as Donor
          </Button>
        )}
      </div>
    </div>
  )
}
