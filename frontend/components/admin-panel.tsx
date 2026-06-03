"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Users,
  Building2,
  BarChart3,
  ShieldAlert,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Droplets,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  LogOut,
  Settings,
  Mail,
  Shield,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Eye,
  ChevronRight,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: UserCheck, label: "Pending Donors", id: "pendingDonors" },
  { icon: Users, label: "Manage Donors", id: "donors" },
  { icon: Building2, label: "Approve Hospitals", id: "hospitals" },
  { icon: ShieldAlert, label: "Block Users", id: "block" },
]

function fmtDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [donorSearch, setDonorSearch] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [donors, setDonors] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [stats, setStats] = useState({ totalDonors: 0, totalHospitals: 0, donations: 0, activeRequests: 0 })
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/admin'
        return
      }
      try {
        const headers = { Authorization: `Bearer ${token}` }
        
        const [donorsRes, hospsRes, statsRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/donors', { headers }),
          fetch('http://localhost:5000/api/admin/hospitals', { headers }),
          fetch('http://localhost:5000/api/admin/stats', { headers })
        ])
        
        if (donorsRes.ok) setDonors(await donorsRes.json())
        if (hospsRes.ok) setHospitals(await hospsRes.json())
        if (statsRes.ok) setStats(await statsRes.json())
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const handleUpdateStatus = async (type: 'donor' | 'hospital', id: number, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/admin/${type}s/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        if (type === 'donor') {
          setDonors(donors.map(d => d.id === id ? { ...d, status } : d))
          if (selectedDonor?.id === id) setSelectedDonor(null)
        } else {
          setHospitals(hospitals.map(h => h.id === id ? { ...h, status } : h))
          if (selectedHospital?.id === id) setSelectedHospital(null)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const pendingDonors = donors.filter(d => d.status === "pending")
  const filteredDonors = donors.filter(d =>
    d.name?.toLowerCase().includes(donorSearch.toLowerCase()) ||
    d.email?.toLowerCase().includes(donorSearch.toLowerCase()) ||
    d.bloodGroup?.toLowerCase().includes(donorSearch.toLowerCase()) ||
    d.city?.toLowerCase().includes(donorSearch.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-card transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/25">
              <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                BloodLink
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 px-1.5 py-0">
                Admin
              </Badge>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Navigation</p>
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
                {item.id === "pendingDonors" && pendingDonors.length > 0 && (
                  <Badge className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0 hover:bg-amber-500">{pendingDonors.length}</Badge>
                )}
                {activeTab === item.id && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </nav>


      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] items-center justify-between border-b border-border bg-card px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">BloodLink</p>
              <h1 className="text-base font-bold text-foreground leading-tight" style={{ fontFamily: "var(--font-heading)" }}>Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block" />
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-transform hover:scale-105"
              >
                A
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border bg-card p-5 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex items-center justify-center bg-primary text-base font-bold text-primary-foreground"
                        style={{ width: 44, height: 44, borderRadius: "50%" }}
                      >
                        A
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Administrator</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        admin@bloodlink.in
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 shrink-0" />
                        Role: Super Admin
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <button 
                        onClick={() => {
                          localStorage.removeItem('token')
                          localStorage.removeItem('user')
                          window.location.href = '/admin'
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">

          {/* ── Image Lightbox ── */}
          {lightboxImage && (
            <>
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" onClick={() => setLightboxImage(null)} />
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setLightboxImage(null)}>
                <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border shadow-lg text-foreground hover:bg-accent transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src={lightboxImage}
                    alt="Document Preview"
                    className="w-full h-full object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Donor Detail Modal ── */}
          {selectedDonor && (
            <>
              <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedDonor(null)} />
              <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Donor Details
                  </h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedDonor(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Profile header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm shadow-primary/20">
                    {selectedDonor.bloodGroup}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{selectedDonor.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedDonor.email}</p>
                    <StatusBadge status={selectedDonor.status} />
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Blood Group", value: selectedDonor.bloodGroup, icon: Droplets },
                    { label: "Gender", value: selectedDonor.gender || "—", icon: Users },
                    { label: "Phone", value: selectedDonor.mobile || "—", icon: Phone },
                    { label: "City", value: selectedDonor.city || "—", icon: MapPin },
                    { label: "District", value: selectedDonor.district || "—", icon: MapPin },
                    { label: "PIN", value: selectedDonor.pin || "—", icon: MapPin },
                    { label: "Date of Birth", value: fmtDate(selectedDonor.dob), icon: Calendar },
                    { label: "Weight", value: selectedDonor.weight ? `${selectedDonor.weight} kg` : "—", icon: Activity },
                    { label: "Last Donation", value: fmtDate(selectedDonor.lastDonation), icon: Droplets },
                    { label: "Registered", value: fmtDate(selectedDonor.created_at), icon: Calendar },
                    { label: "Address", value: selectedDonor.address || "—", icon: MapPin },
                    { label: "Preferred Contact", value: selectedDonor.preferredContact || "—", icon: Phone },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        <item.icon className="h-3 w-3" />
                        {item.label}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 border-t border-border pt-4">
                  {selectedDonor.status === "pending" && (
                    <>
                      <Button
                        className="flex-1 gap-1.5 rounded-xl shadow-sm shadow-primary/20"
                        onClick={() => { handleUpdateStatus('donor', selectedDonor.id, 'verified'); }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Verify Donor
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-1.5 rounded-xl text-primary hover:bg-primary/5"
                        onClick={() => { handleUpdateStatus('donor', selectedDonor.id, 'blocked'); }}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedDonor.status === "verified" && (
                    <Button
                      variant="outline"
                      className="flex-1 gap-1.5 rounded-xl text-primary hover:bg-primary/5"
                      onClick={() => { handleUpdateStatus('donor', selectedDonor.id, 'blocked'); }}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Block Donor
                    </Button>
                  )}
                  {selectedDonor.status === "blocked" && (
                    <Button
                      className="flex-1 gap-1.5 rounded-xl"
                      onClick={() => { handleUpdateStatus('donor', selectedDonor.id, 'verified'); }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Unblock Donor
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Hospital Detail Modal ── */}
          {selectedHospital && (
            <>
              <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
              <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Hospital Details
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedHospital(null)} className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Header info */}
                  <div className="flex items-center gap-4 border-b border-border pb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedHospital.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedHospital.email}</p>
                      <div className="mt-2 flex gap-2">
                        {selectedHospital.status === "pending" && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-amber-500/20"><Clock className="mr-1 h-3 w-3" /> PENDING</Badge>}
                        {(selectedHospital.status === "approved" || selectedHospital.status === "verified") && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"><CheckCircle className="mr-1 h-3 w-3" /> APPROVED</Badge>}
                        {selectedHospital.status === "blocked" && <Badge variant="outline" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 border-rose-500/20"><XCircle className="mr-1 h-3 w-3" /> BLOCKED</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Building2 className="h-3 w-3" /> HOSPITAL TYPE</span>
                      <span className="font-semibold text-foreground capitalize">{selectedHospital.type || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><FileText className="h-3 w-3" /> REGISTRATION NUMBER</span>
                      <span className="font-semibold text-foreground">{selectedHospital.regNumber || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><UserCheck className="h-3 w-3" /> AUTHORIZED PERSON</span>
                      <span className="font-semibold text-foreground">{selectedHospital.contactPerson || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Shield className="h-3 w-3" /> DESIGNATION</span>
                      <span className="font-semibold text-foreground">{selectedHospital.designation || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" /> CONTACT NUMBER</span>
                      <span className="font-semibold text-foreground">{selectedHospital.contactNumber || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> CITY</span>
                      <span className="font-semibold text-foreground">{selectedHospital.city || "—"}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> DISTRICT</span>
                      <span className="font-semibold text-foreground">{selectedHospital.district || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" /> REGISTERED</span>
                      <span className="font-semibold text-foreground">{fmtDate(selectedHospital.created_at)}</span>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4 md:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> FULL ADDRESS</span>
                      <span className="font-semibold text-foreground">{selectedHospital.address || "—"}</span>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  {(selectedHospital.licenseFile || selectedHospital.idProofFile) ? (
                    <div className="mt-2">
                      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Uploaded Documents
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* License File */}
                        <div className="rounded-xl border border-border overflow-hidden">
                          <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hospital License</span>
                          </div>
                          {selectedHospital.licenseFile ? (
                            <div className="p-3">
                              {selectedHospital.licenseFile.match(/\.(jpg|jpeg|png)$/i) ? (
                                <img
                                  src={`http://localhost:5000/uploads/${selectedHospital.licenseFile}`}
                                  alt="License"
                                  className="w-full rounded-lg border border-border object-contain max-h-48 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setLightboxImage(`http://localhost:5000/uploads/${selectedHospital.licenseFile}`)}
                                />
                              ) : (
                                <a
                                  href={`http://localhost:5000/uploads/${selectedHospital.licenseFile}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">View PDF</p>
                                    <p className="text-xs text-muted-foreground">{selectedHospital.licenseFile}</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">Not uploaded</div>
                          )}
                        </div>

                        {/* ID Proof File */}
                        <div className="rounded-xl border border-border overflow-hidden">
                          <div className="bg-muted/30 px-4 py-2.5 border-b border-border">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ID Proof</span>
                          </div>
                          {selectedHospital.idProofFile ? (
                            <div className="p-3">
                              {selectedHospital.idProofFile.match(/\.(jpg|jpeg|png)$/i) ? (
                                <img
                                  src={`http://localhost:5000/uploads/${selectedHospital.idProofFile}`}
                                  alt="ID Proof"
                                  className="w-full rounded-lg border border-border object-contain max-h-48 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setLightboxImage(`http://localhost:5000/uploads/${selectedHospital.idProofFile}`)}
                                />
                              ) : (
                                <a
                                  href={`http://localhost:5000/uploads/${selectedHospital.idProofFile}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">View PDF</p>
                                    <p className="text-xs text-muted-foreground">{selectedHospital.idProofFile}</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">Not uploaded</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                      No documents uploaded by this hospital.
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between border-t border-border pt-6">
                    <div className="flex w-full items-center gap-3">
                      {selectedHospital.status === "pending" ? (
                        <>
                          <Button onClick={() => handleUpdateStatus('hospital', selectedHospital.id, 'approved')} className="flex-1 gap-1.5 rounded-xl">
                            <CheckCircle className="h-4 w-4" /> Approve Hospital
                          </Button>
                          <Button onClick={() => handleUpdateStatus('hospital', selectedHospital.id, 'blocked')} variant="outline" className="flex-1 gap-2 rounded-xl text-primary hover:bg-primary/5 hover:text-primary">
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </>
                      ) : selectedHospital.status === "blocked" ? (
                        <Button onClick={() => handleUpdateStatus('hospital', selectedHospital.id, 'approved')} className="w-full gap-1.5 rounded-xl">
                          <CheckCircle className="h-4 w-4" /> Unblock & Approve
                        </Button>
                      ) : (
                        <Button onClick={() => handleUpdateStatus('hospital', selectedHospital.id, 'blocked')} variant="outline" className="w-full gap-2 rounded-xl text-primary hover:bg-primary/5 hover:text-primary border-primary">
                          <XCircle className="h-4 w-4" /> Block Hospital
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Users, label: "Total Donors", value: stats.totalDonors || "0", change: "Registered", accent: "bg-primary/10 text-primary" },
                  { icon: Building2, label: "Hospitals", value: stats.totalHospitals || "0", change: "Registered", accent: "bg-sky-500/10 text-sky-600" },
                  { icon: Droplets, label: "Donations", value: stats.donations || "0", change: "Completed", accent: "bg-emerald-500/10 text-emerald-600" },
                  { icon: Activity, label: "Active Requests", value: stats.activeRequests || "0", change: "Urgent", accent: "bg-amber-500/10 text-amber-600" },
                ].map((stat) => (
                  <div key={stat.label} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.03]">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.accent} transition-transform group-hover:scale-105`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-xs font-medium text-primary">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Pending Donors Quick View */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                        <UserCheck className="h-4 w-4 text-amber-600" />
                      </div>
                      <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        Pending Donor Approvals
                      </h2>
                    </div>
                    {pendingDonors.length > 0 && (
                      <Button variant="ghost" size="sm" className="gap-1 text-xs rounded-lg" onClick={() => setActiveTab("pendingDonors")}>
                        View all <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5">
                    {pendingDonors.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">No pending donor approvals</p>
                    )}
                    {pendingDonors.slice(0, 4).map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">{donor.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button onClick={() => setSelectedDonor(donor)} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-sky-600 hover:bg-sky-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleUpdateStatus('donor', donor.id, 'verified')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleUpdateStatus('donor', donor.id, 'blocked')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Hospitals */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Building2 className="h-4 w-4 text-amber-600" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      Pending Hospital Approvals
                    </h2>
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5">
                    {hospitals.filter(h => h.status === "pending").length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6">No pending hospital approvals</p>
                    )}
                    {hospitals.filter(h => h.status === "pending").map((hospital) => (
                      <div key={hospital.id} className="flex items-center justify-between rounded-xl border border-border p-3.5 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{hospital.name}</p>
                            <p className="text-xs text-muted-foreground">{hospital.type} - {hospital.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button onClick={() => setSelectedHospital(hospital)} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-sky-600 hover:bg-sky-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleUpdateStatus('hospital', hospital.id, 'approved')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleUpdateStatus('hospital', hospital.id, 'blocked')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Pending Donors Tab ── */}
          {activeTab === "pendingDonors" && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Pending Donor Approvals
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Review and verify newly registered donors before they appear in search.</p>
              </div>

              {pendingDonors.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <CheckCircle className="h-7 w-7 text-emerald-500" />
                  </div>
                  <p className="mt-5 text-base font-semibold text-foreground">All caught up!</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">No pending donor approvals right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingDonors.map((donor) => (
                    <div key={donor.id} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-amber-500/30 hover:shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-sm shadow-primary/20">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{donor.name}</p>
                            <p className="text-sm text-muted-foreground">{donor.email}</p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{donor.city}{donor.district ? `, ${donor.district}` : ""}</span>
                              {donor.mobile && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{donor.mobile}</span>}
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Applied {fmtDate(donor.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl"
                            onClick={() => setSelectedDonor(donor)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5 rounded-xl shadow-sm shadow-primary/20"
                            onClick={() => handleUpdateStatus('donor', donor.id, 'verified')}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl text-primary hover:bg-primary/5 hover:text-primary"
                            onClick={() => handleUpdateStatus('donor', donor.id, 'blocked')}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Manage Donors ── */}
          {activeTab === "donors" && (
            <div>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Manage Donors
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{donors.length} total donors</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, blood group, city..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-80 rounded-xl pl-9"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood Group</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">City</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered</th>
                        <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map((donor) => (
                        <tr key={donor.id} className="border-b border-border last:border-0 transition-colors hover:bg-accent/50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                {donor.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground">{donor.name}</span>
                                <p className="text-xs text-muted-foreground">{donor.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="inline-flex h-8 min-w-[40px] items-center justify-center rounded-lg bg-primary px-2 text-xs font-bold text-primary-foreground">
                              {donor.bloodGroup}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{donor.city}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{donor.mobile || "—"}</td>
                          <td className="px-5 py-4"><StatusBadge status={donor.status} /></td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {fmtDate(donor.created_at)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-sky-600 hover:bg-sky-500/10" onClick={() => setSelectedDonor(donor)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {donor.status === "pending" && (
                                <Button onClick={() => handleUpdateStatus('donor', donor.id, 'verified')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {donor.status === "verified" && (
                                <Button onClick={() => handleUpdateStatus('donor', donor.id, 'blocked')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                                  <ShieldAlert className="h-4 w-4" />
                                </Button>
                              )}
                              {donor.status === "blocked" && (
                                <Button onClick={() => handleUpdateStatus('donor', donor.id, 'verified')} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-500/10">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredDonors.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">No donors found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Approve Hospitals ── */}
          {activeTab === "hospitals" && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Hospital Approvals
                </h2>
              </div>
              <Tabs defaultValue="pending">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="pending" className="rounded-lg">Pending</TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-lg">Approved</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-5">
                  <div className="flex flex-col gap-4">
                    {hospitals.filter(h => h.status === "pending").length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <CheckCircle className="h-8 w-8 text-emerald-500 mb-3" />
                        <p className="text-sm font-medium text-foreground">No pending hospital approvals</p>
                      </div>
                    )}
                    {hospitals.filter(h => h.status === "pending").map((hospital) => (
                      <div key={hospital.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">{hospital.type} - {hospital.city}</p>
                            <p className="text-xs text-muted-foreground">Applied: {fmtDate(hospital.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setSelectedHospital(hospital)} size="sm" variant="ghost" className="gap-1.5 rounded-xl text-sky-600 hover:bg-sky-500/10">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button onClick={() => handleUpdateStatus('hospital', hospital.id, 'approved')} size="sm" className="gap-1.5 rounded-xl shadow-sm shadow-primary/20">
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button onClick={() => handleUpdateStatus('hospital', hospital.id, 'blocked')} size="sm" variant="outline" className="gap-1.5 rounded-xl text-primary hover:bg-primary/5 hover:text-primary">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="approved" className="mt-5">
                  <div className="flex flex-col gap-4">
                    {hospitals.filter(h => h.status === "approved" || h.status === "verified").length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <Building2 className="h-8 w-8 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground">No approved hospitals yet</p>
                      </div>
                    )}
                    {hospitals.filter(h => h.status === "approved" || h.status === "verified").map((hospital) => (
                      <div key={hospital.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <Building2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">{hospital.type} - {hospital.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button onClick={() => setSelectedHospital(hospital)} size="sm" variant="ghost" className="gap-1.5 rounded-xl text-sky-600 hover:bg-sky-500/10">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 gap-1 rounded-lg">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}



          {/* Block Users */}
          {activeTab === "block" && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Blocked Accounts
                </h2>
              </div>
              <Tabs defaultValue="donors">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="donors" className="rounded-lg">Donors</TabsTrigger>
                  <TabsTrigger value="hospitals" className="rounded-lg">Hospitals</TabsTrigger>
                </TabsList>
                <TabsContent value="donors" className="mt-5">
                  <div className="flex flex-col gap-3">
                    {donors.filter(d => d.status === "blocked").map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 transition-all hover:bg-primary/[0.04]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                            {donor.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">{donor.bloodGroup} - {donor.city}</p>
                          </div>
                        </div>
                        <Button onClick={() => handleUpdateStatus('donor', donor.id, 'verified')} size="sm" variant="outline" className="rounded-xl text-primary hover:bg-primary/5 hover:text-primary">Unblock</Button>
                      </div>
                    ))}
                    {donors.filter(d => d.status === "blocked").length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                          <ShieldAlert className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-foreground">No blocked donors</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="hospitals" className="mt-5">
                  <div className="flex flex-col gap-3">
                    {hospitals.filter(h => h.status === "blocked").map((hospital) => (
                      <div key={hospital.id} className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 transition-all hover:bg-primary/[0.04]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{hospital.name}</p>
                            <p className="text-xs text-muted-foreground">{hospital.type} - {hospital.city}</p>
                          </div>
                        </div>
                        <Button onClick={() => handleUpdateStatus('hospital', hospital.id, 'approved')} size="sm" variant="outline" className="rounded-xl text-primary hover:bg-primary/5 hover:text-primary">Unblock</Button>
                      </div>
                    ))}
                    {hospitals.filter(h => h.status === "blocked").length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-foreground">No blocked hospitals</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "verified":
    case "approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <CheckCircle className="h-3 w-3" />
          {status === "verified" ? "Verified" : "Approved"}
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    case "blocked":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
          <XCircle className="h-3 w-3" />
          Blocked
        </Badge>
      )
    default:
      return null
  }
}
