"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User, MapPin, Lock, ChevronLeft, ChevronRight, Check, Upload, FileText, Shield, Loader2 } from "lucide-react"
import { registerHospital, saveAuth } from "@/lib/api"

const formSteps = [
  { id: 1, title: "Hospital Info", icon: Building2 },
  { id: 2, title: "Authorized Person", icon: User },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Account Setup", icon: Lock },
]

export function HospitalSignupForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalType: "",
    regNumber: "",
    personName: "",
    designation: "",
    contactNumber: "",
    address: "",
    city: "",
    district: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const progress = (currentStep / formSteps.length) * 100

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      const data = await registerHospital({
        name: formData.hospitalName,
        email: formData.email,
        password: formData.password,
        phone: formData.contactNumber,
        address: formData.address,
        city: formData.city,
        state: formData.district,
        license_number: formData.regNumber,
        hospital_type: formData.hospitalType,
        contact_person: formData.personName,
      })
      saveAuth(data)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
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
          {formSteps.map((step, index) => (
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
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <span className={`hidden text-xs font-medium sm:block ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
              {index < formSteps.length - 1 && (
                <div className={`mx-3 h-0.5 flex-1 rounded-full transition-all duration-500 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Hospital Info */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Hospital Information
              </h3>
              <p className="text-sm text-muted-foreground">Basic details about your healthcare facility.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hospitalName" className="text-sm font-medium">Hospital Name</Label>
              <Input id="hospitalName" placeholder="Enter hospital name" className="rounded-xl" value={formData.hospitalName} onChange={(e) => updateField("hospitalName", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Hospital Type</Label>
              <Select value={formData.hospitalType} onValueChange={(v) => updateField("hospitalType", v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Hospital</SelectItem>
                  <SelectItem value="private">Private Hospital</SelectItem>
                  <SelectItem value="blood-bank">Blood Bank</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="regNumber" className="text-sm font-medium">Registration Number</Label>
              <Input id="regNumber" placeholder="Hospital registration number" className="rounded-xl" value={formData.regNumber} onChange={(e) => updateField("regNumber", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">License Upload</Label>
              <div className="group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-105">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Authorized Person */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Authorized Person
              </h3>
              <p className="text-sm text-muted-foreground">Details of the account administrator.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="personName" className="text-sm font-medium">Full Name</Label>
              <Input id="personName" placeholder="Authorized person name" className="rounded-xl" value={formData.personName} onChange={(e) => updateField("personName", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="designation" className="text-sm font-medium">Designation</Label>
              <Input id="designation" placeholder="e.g. Chief Medical Officer" className="rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</Label>
              <Input id="contactNumber" placeholder="+91 XXXXX XXXXX" className="rounded-xl" value={formData.contactNumber} onChange={(e) => updateField("contactNumber", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">ID Proof Upload</Label>
              <div className="group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-105">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      <span className="text-primary">Upload ID proof</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Aadhar, PAN, or other govt. ID</p>
                  </div>
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
                Hospital Location
              </h3>
              <p className="text-sm text-muted-foreground">Helps patients and donors find your facility.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hospAddress" className="text-sm font-medium">Full Address</Label>
              <Input id="hospAddress" placeholder="Street address, landmark" className="rounded-xl" value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="hospCity" className="text-sm font-medium">City</Label>
                <Input id="hospCity" placeholder="Enter city" className="rounded-xl" value={formData.city} onChange={(e) => updateField("city", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hospDistrict" className="text-sm font-medium">District</Label>
                <Input id="hospDistrict" placeholder="Enter district" className="rounded-xl" value={formData.district} onChange={(e) => updateField("district", e.target.value)} />
              </div>
            </div>

            <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Pin Your Location</p>
                <p className="mt-1 text-xs text-muted-foreground">Map preview appears here</p>
                <Button variant="outline" size="sm" className="mt-3 gap-2 rounded-xl border-primary/20 text-primary hover:bg-primary/5">
                  <MapPin className="h-4 w-4" />
                  Pin Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Account Setup */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Account Setup
              </h3>
              <p className="text-sm text-muted-foreground">Create credentials for the hospital dashboard.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hospEmail" className="text-sm font-medium">Email Address</Label>
              <Input id="hospEmail" type="email" placeholder="hospital@example.com" className="rounded-xl" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hospPassword" className="text-sm font-medium">Password</Label>
              <Input id="hospPassword" type="password" placeholder="Create a strong password" className="rounded-xl" value={formData.password} onChange={(e) => updateField("password", e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" className="rounded-xl" value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Verification Process</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Our team will verify documents within 24-48 hours. Confirmation email sent on approval.
                  </p>
                </div>
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
          {formSteps.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                s.id === currentStep ? "w-6 bg-primary" : s.id < currentStep ? "w-1.5 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep((p) => Math.min(4, p + 1))} className="gap-2 rounded-xl shadow-sm shadow-primary/20">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 rounded-xl shadow-sm shadow-primary/20">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Check className="h-4 w-4" /> Request Verification</>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
