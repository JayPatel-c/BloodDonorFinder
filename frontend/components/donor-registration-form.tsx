"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, ChevronRight, User, Stethoscope, MapPin, Bell, Shield, Eye, EyeOff } from "lucide-react"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Medical Info", icon: Stethoscope },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Availability", icon: Bell },
]

export function DonorRegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setRawError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  const setError = (msg: string) => {
    setRawError(msg);
    setTimeout(() => {
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        errorRef.current.focus({ preventScroll: true });
      }
    }, 50);
  };

  useEffect(() => {
    // Scroll to top of the page smoothly when step changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

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

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return setError("Full Name is required.");
      if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
        return setError("Name must not contain numbers or special characters.");
      }
      if (!formData.gender) return setError("Please select your gender.");
      
      if (!formData.dob) return setError("Date of Birth is required.");
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) return setError("You must be 18 or older to donate blood.");
      
      if (!formData.mobile) return setError("Mobile number is required.");
      if (!/^\d{10}$/.test(formData.mobile)) {
        return setError("Mobile number must be exactly 10 digits.");
      }
      
      if (!formData.email.trim()) return setError("Email is required.");
      if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(formData.email)) {
        return setError("Please enter a valid @gmail.com address (e.g., yourname@gmail.com).");
      }
      
      if (!formData.password) return setError("Password is required.");
      if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(formData.password)) {
        return setError("Password must be at least 6 characters, containing 1 number and 1 special character.");
      }
      
      if (!formData.confirmPassword) return setError("Please confirm your password.");
      if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match.");
      }
    }
    
    if (currentStep === 2) {
      if (!formData.bloodGroup) return setError("Please select a blood group.");
      
      if (formData.lastDonation) {
        if (new Date(formData.lastDonation) > new Date()) {
          return setError("Last donation date cannot be in the future.");
        }
      }
      
      if (!formData.weight) return setError("Weight is required.");
      if (Number(formData.weight) <= 50) {
        return setError("Weight must be greater than 50 kg.");
      }
    }
    
    if (currentStep === 3) {
      if (!formData.address.trim()) return setError("Full Address is required.");
      if (!formData.city.trim()) return setError("City is required.");
      if (!formData.district.trim()) return setError("District is required.");
      
      if (!formData.pin) return setError("PIN Code is required.");
      if (!/^\d{6}$/.test(formData.pin)) {
        return setError("PIN Code must be exactly 6 digits.");
      }
    }

    setCurrentStep((p) => Math.min(4, p + 1));
  };

  const passwordsMatch =
  formData.password &&
  formData.confirmPassword &&
  formData.password === formData.confirmPassword

  const isEligible = Number(formData.weight) >= 50 && !formData.chronicDisease
  const progress = (currentStep / steps.length) * 100
  const maxTodayStr = new Date().toISOString().split("T")[0];

  const handleRegister = async () => {
    if (!passwordsMatch) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/donor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          bloodGroup: formData.bloodGroup,
          city: formData.city,
          gender: formData.gender,
          dob: formData.dob,
          mobile: formData.mobile,
          lastDonation: formData.lastDonation || null,
          weight: formData.weight,
          chronicDisease: formData.chronicDisease,
          address: formData.address,
          district: formData.district,
          pin: formData.pin,
          availabilityType: formData.availabilityType,
          preferredContact: formData.preferredContact
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/donor/login");
      }
    } catch (err) {
      setError("Network error. Backend server might not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {error && (
        <div 
          ref={errorRef}
          tabIndex={-1}
          className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20 text-center outline-none"
        >
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
                  max={maxTodayStr}
                  className="rounded-xl"
                  value={formData.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="10-digit mobile number"
                  className="rounded-xl"
                  value={formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    updateField("mobile", val);
                  }}
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="rounded-xl pr-10"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="rounded-xl pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                  max={maxTodayStr}
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
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  updateField("pin", val);
                }}
              />
            </div>


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
            onClick={handleNext}
            className="gap-2 rounded-xl shadow-sm shadow-primary/20"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
            <Button
              disabled={!passwordsMatch || loading}
              onClick={handleRegister}
              className="gap-2 rounded-xl shadow-sm shadow-primary/20"
            >
            <Check className="h-4 w-4" />
            {loading ? "Registering..." : "Register as Donor"}
          </Button>
        )}
      </div>
    </div>
  )
}
