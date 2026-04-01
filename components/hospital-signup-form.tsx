"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User, MapPin, Lock, ChevronLeft, ChevronRight, Check, Upload, FileText, Shield, Eye, EyeOff, X as XIcon } from "lucide-react"

const formSteps = [
  { id: 1, title: "Hospital Info", icon: Building2 },
  { id: 2, title: "Authorized Person", icon: User },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Account Setup", icon: Lock },
]

export function HospitalSignupForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setRawError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const idProofInputRef = useRef<HTMLInputElement>(null)
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
    hospitalName: "",
    hospType: "",
    regNumber: "",
    personName: "",
    designation: "",
    contactNumber: "",
    hospAddress: "",
    hospCity: "",
    hospDistrict: "",
    hospEmail: "",
    hospPassword: "",
    confirmPassword: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!formData.hospitalName.trim()) return setError("Hospital Name is required.");
      if (!/^[A-Za-z\s]+$/.test(formData.hospitalName)) {
        return setError("Hospital name must not contain numbers or special characters.");
      }
      if (!formData.hospType) return setError("Please select a hospital type.");
      if (!formData.regNumber.trim()) return setError("Hospital Registration Number is required.");
      if (!licenseFile) return setError("Hospital License Document Upload is required.");
    }
    
    if (currentStep === 2) {
      if (!formData.personName.trim()) return setError("Authorized person name is required.");
      if (!/^[A-Za-z\s]+$/.test(formData.personName)) {
        return setError("Authorized person name must not contain numbers.");
      }
      if (!formData.designation.trim()) return setError("Designation is required.");
      if (!formData.contactNumber) return setError("Contact Number is required.");
      if (!/^\d{10}$/.test(formData.contactNumber)) {
        return setError("Mobile number must be exactly 10 digits.");
      }
      if (!idProofFile) return setError("Authorized Person ID Proof Upload is required.");
    }
    
    if (currentStep === 3) {
      if (!formData.hospAddress.trim()) return setError("Please enter the full address.");
      if (!formData.hospCity.trim()) return setError("Please enter the city.");
      if (!formData.hospDistrict.trim()) return setError("Please enter the district.");
    }

    setCurrentStep((p) => Math.min(4, p + 1));
  };

  const passwordsMatch = formData.hospPassword && formData.hospPassword === formData.confirmPassword;
  const progress = (currentStep / formSteps.length) * 100

  const handleRegister = async () => {
    setError("");
    if (!formData.hospEmail.trim()) return setError("Email Address is required.");
    if (!/^[a-zA-Z0-9.]+@gmail\.com$/.test(formData.hospEmail)) {
        return setError("Please enter a valid @gmail.com address (e.g., hospitalname@gmail.com).");
    }
    if (!formData.hospPassword) return setError("Password is required.");
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(formData.hospPassword)) {
      return setError("Password must be at least 6 characters, containing 1 number and 1 special character.");
    }
    if (!formData.confirmPassword) return setError("Please confirm your password.");
    if (!passwordsMatch) return setError("Passwords do not match.");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.hospitalName);
      fd.append("email", formData.hospEmail);
      fd.append("password", formData.hospPassword);
      fd.append("type", formData.hospType);
      fd.append("city", formData.hospCity);
      fd.append("regNumber", formData.regNumber);
      fd.append("contactPerson", formData.personName);
      fd.append("designation", formData.designation);
      fd.append("contactNumber", formData.contactNumber);
      fd.append("address", formData.hospAddress);
      fd.append("district", formData.hospDistrict);
      if (licenseFile) fd.append("licenseFile", licenseFile);
      if (idProofFile) fd.append("idProofFile", idProofFile);

      const res = await fetch("http://localhost:5000/api/auth/hospital/register", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Signup failed.");
      } else {
        router.push("/hospital/login");
      }
    } catch (err) {
      setError("Network error. Backend server might not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
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
              <Input id="hospitalName" value={formData.hospitalName} onChange={(e) => updateField("hospitalName", e.target.value)} placeholder="Enter hospital name" className="rounded-xl" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Hospital Type</Label>
              <Select value={formData.hospType} onValueChange={(v) => updateField("hospType", v)}>
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
              <Input id="regNumber" value={formData.regNumber} onChange={(e) => updateField("regNumber", e.target.value)} placeholder="Hospital registration number" className="rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">License Upload</Label>
              <input
                ref={licenseInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) setLicenseFile(e.target.files[0]); }}
              />
              {licenseFile ? (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-700 truncate max-w-[200px]">{licenseFile.name}</p>
                      <p className="text-xs text-emerald-600">{(licenseFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setLicenseFile(null); if (licenseInputRef.current) licenseInputRef.current.value = ''; }} className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div onClick={() => licenseInputRef.current?.click()} className="group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
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
              )}
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
              <Input id="personName" value={formData.personName} onChange={(e) => updateField("personName", e.target.value)} placeholder="Authorized person name" className="rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="designation" className="text-sm font-medium">Designation</Label>
              <Input id="designation" value={formData.designation} onChange={(e) => updateField("designation", e.target.value)} placeholder="e.g. Chief Medical Officer" className="rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</Label>
              <Input id="contactNumber" value={formData.contactNumber} onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateField("contactNumber", val);
              }} placeholder="10-digit mobile number" className="rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">ID Proof Upload</Label>
              <input
                ref={idProofInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) setIdProofFile(e.target.files[0]); }}
              />
              {idProofFile ? (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-700 truncate max-w-[200px]">{idProofFile.name}</p>
                      <p className="text-xs text-emerald-600">{(idProofFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setIdProofFile(null); if (idProofInputRef.current) idProofInputRef.current.value = ''; }} className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div onClick={() => idProofInputRef.current?.click()} className="group flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 transition-all hover:border-primary/30 hover:bg-primary/[0.02]">
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
              )}
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
              <Input id="hospAddress" value={formData.hospAddress} onChange={(e) => updateField("hospAddress", e.target.value)} placeholder="Street address, landmark" className="rounded-xl" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="hospCity" className="text-sm font-medium">City</Label>
                <Input id="hospCity" value={formData.hospCity} onChange={(e) => updateField("hospCity", e.target.value)} placeholder="Enter city" className="rounded-xl" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hospDistrict" className="text-sm font-medium">District</Label>
                <Input id="hospDistrict" value={formData.hospDistrict} onChange={(e) => updateField("hospDistrict", e.target.value)} placeholder="Enter district" className="rounded-xl" />
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
              <Input id="hospEmail" type="email" value={formData.hospEmail} onChange={(e) => updateField("hospEmail", e.target.value)} placeholder="hospital@example.com" className="rounded-xl" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hospPassword" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="hospPassword" type={showPassword ? "text" : "password"} value={formData.hospPassword} onChange={(e) => updateField("hospPassword", e.target.value)} placeholder="Create a strong password" className="rounded-xl pr-10" required />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Confirm your password" className="rounded-xl pr-10" required />
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
            )}

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
          <Button onClick={handleNext} className="gap-2 rounded-xl shadow-sm shadow-primary/20">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!passwordsMatch || loading} onClick={handleRegister} className="gap-2 rounded-xl shadow-sm shadow-primary/20">
            <Check className="h-4 w-4" />
            {loading ? "Requesting..." : "Request Verification"}
          </Button>
        )}
      </div>
    </div>
  )
}
