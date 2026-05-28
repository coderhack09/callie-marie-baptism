"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Section } from "@/components/section"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  RefreshCw,
  X,
  Heart,
  Sparkles,
  Phone,
  UserPlus,
  Users,
  ChevronRight,
} from "lucide-react"
import { siteConfig } from "@/content/site"

// ── Palette — aligned with entourage.tsx ───────────────────────────────────────
const DARK_NAVY   = "#1C3050"
const GOLD        = "#C4965A"
const NAVY_MUTE   = "rgba(65,90,115,0.78)"
const STEEL       = "rgba(72,112,148,0.80)"
const GOLD_BORDER = "rgba(196,152,88,0.28)"

const FROSTED_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

const SUGGESTION_PANEL = {
  background: "rgba(255,255,255,0.94)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: `1.5px solid ${GOLD_BORDER}`,
  boxShadow: "0 8px 32px rgba(43,74,107,0.14), 0 1px 0 rgba(255,255,255,0.65) inset",
} as const

const MODAL_SHELL = {
  background: "#FFFFFF",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 16px 48px rgba(28,48,80,0.18), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

const MODAL_BODY_BG = "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(248,250,252,0.97) 100%)"

const ICON_WRAP = {
  background: "rgba(196,152,88,0.10)",
  border: `1.5px solid ${GOLD_BORDER}`,
} as const

const LAYER_TOP = 9999

function highlightName(name: string, query: string) {
  const q = query.trim()
  if (!q) return name
  const idx = name.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return name
  return (
    <>
      {name.slice(0, idx)}
      <span style={{ color: GOLD, fontWeight: 600 }}>{name.slice(idx, idx + q.length)}</span>
      {name.slice(idx + q.length)}
    </>
  )
}

// ── Fonts — aligned with entourage.tsx ───────────────────────────────────────
const FONT_LABEL   = '"Cinzel", serif'
const FONT_DISPLAY = '"LeJourScript", cursive'
const FONT_BODY    = '"Fahkwang", sans-serif'

const INPUT_CLASS =
  "w-full rounded-lg transition-all duration-300 shadow-sm focus:shadow-md"
const INPUT_STYLE = {
  fontFamily: FONT_LABEL,
  color: DARK_NAVY,
  background: "rgba(255,255,255,0.55)",
  border: `1.5px solid ${GOLD_BORDER}`,
} as const

interface ApiGuest {
  id: string | number
  name: string
  role: string
  email: string
  contact: string
  message: string
  allowedGuests: number
  companions: Array<{ name: string; relationship: string }>
  tableNumber: string
  isVip: boolean
  status: string
  addedBy: string
  createdAt: string
  updatedAt: string
}

interface Guest {
  id: string | number
  Name: string
  Email: string
  RSVP: string
  Guest: string
  Message: string
  Status: string
  AllowedGuests: number
  Companions?: Array<{ name: string; relationship: string }>
}

// Colors sourced from globals.css @theme inline — edit there to update everywhere

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    RSVP: "",
    Guest: "1",
    Message: "",
    Status: "pending",
  })

  // Companion state
  const [companions, setCompanions] = useState<Array<{ name: string; relationship: string }>>([])

  // Request form state
  const [requestFormData, setRequestFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Guest: "1",
    Message: "",
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const inputAnchorRef = useRef<HTMLDivElement>(null)
  const dropdownPortalRef = useRef<HTMLDivElement>(null)
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  const showMatchDropdown = isDropdownOpen && filteredGuests.length > 0
  const showEmptyDropdown = isDropdownOpen && Boolean(searchQuery.trim() && filteredGuests.length === 0)
  const showDropdownPortal = showMatchDropdown || showEmptyDropdown

  const updateDropdownPosition = useCallback(() => {
    const el = inputAnchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setDropdownRect({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    })
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!showDropdownPortal) {
      setDropdownRect(null)
      return
    }
    updateDropdownPosition()
    window.addEventListener("scroll", updateDropdownPosition, true)
    window.addEventListener("resize", updateDropdownPosition)
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true)
      window.removeEventListener("resize", updateDropdownPosition)
    }
  }, [showDropdownPortal, searchQuery, filteredGuests.length, updateDropdownPosition])

  // Update companions array based on allowedGuests when a guest is selected
  useEffect(() => {
    if (selectedGuest && formData.RSVP === "Yes") {
      const allowedGuests = selectedGuest.AllowedGuests || 1
      const companionCount = Math.max(0, allowedGuests - 1) // Main guest + companions
      
      setCompanions((prev) => {
        // If we have existing companions from the selected guest, use them as base
        const existingCompanions = selectedGuest.Companions && selectedGuest.Companions.length > 0 
          ? [...selectedGuest.Companions] 
          : [...prev]
        
        const newCompanions = [...existingCompanions]
        if (newCompanions.length < companionCount) {
          // Add empty slots
          for (let i = newCompanions.length; i < companionCount; i++) {
            newCompanions.push({ name: '', relationship: '' })
          }
        } else if (newCompanions.length > companionCount) {
          // Remove excess slots
          newCompanions.splice(companionCount)
        }
        return newCompanions
      })
    } else {
      // Clear companions if not attending or no guest selected
      setCompanions([])
    }
  }, [selectedGuest, formData.RSVP])

  // Fetch all guests on component mount
  useEffect(() => {
    fetchGuests()
  }, [])

  // Filter guests based on search query with real-time auto-suggestion
  // Shows suggestions for ANY letter typed (even just 1 character)
  // Matches names that START with OR CONTAIN the typed letters (case-insensitive)
  // Results automatically narrow down as more letters are typed
  useEffect(() => {
    // Don't show suggestions if search is empty
    if (!searchQuery.trim()) {
      setFilteredGuests([])
      setIsDropdownOpen(false)
      return
    }

    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase().trim()
    
    // Filter guests where name contains the search query anywhere in the name
    // This includes both:
    // - Names that START with the query (e.g., "Ro" matches "Rolando")
    // - Names that CONTAIN the query (e.g., "ro" matches "Aaron")
    const filtered = guests.filter((guest) => {
      // Safety check: ensure guest.Name exists and is not empty
      if (!guest.Name || guest.Name.trim() === "") {
        return false
      }
      
      const guestName = guest.Name.toLowerCase()
      return guestName.includes(query)
    })

    // Sort results to prioritize names that START with the query
    // This provides a better user experience
    const sorted = filtered.sort((a, b) => {
      const aName = a.Name.toLowerCase()
      const bName = b.Name.toLowerCase()
      const aStarts = aName.startsWith(query)
      const bStarts = bName.startsWith(query)
      
      // If one starts with query and other doesn't, prioritize the one that starts
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      
      // Otherwise maintain alphabetical order
      return aName.localeCompare(bName)
    })

    setFilteredGuests(sorted)
  }, [searchQuery, guests])

  // Close search dropdown when clicking outside (includes portaled panel)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (searchRef.current?.contains(target)) return
      if (dropdownPortalRef.current?.contains(target)) return
      setIsDropdownOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchGuests = async () => {
    setIsLoading(true)
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests")
      
      if (!response.ok) {
        throw new Error("Failed to fetch guests")
      }
      const data: ApiGuest[] = await response.json()
      
      // Map API response to expected Guest format
      const mappedGuests: Guest[] = data
        .filter((guest) => guest.name && guest.name.trim() !== "") // Filter out guests without names
        .map((guest) => ({
          id: guest.id,
          Name: guest.name,
          Email: guest.email || "",
          RSVP: guest.status === "confirmed" ? "Yes" : guest.status === "declined" ? "No" : "",
          Guest: guest.allowedGuests?.toString() || "1",
          Message: guest.message || "",
          Status: guest.status || "pending",
          AllowedGuests: guest.allowedGuests || 1,
          Companions: Array.isArray(guest.companions) ? guest.companions : [],
        }))
      
      setGuests(mappedGuests)
    } catch (error) {
      console.error("Error fetching guests:", error)
      setError("Failed to load guest list")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSelect = (guest: Guest) => {
    setSelectedGuest(guest)
    setSearchQuery(guest.Name)
    setIsDropdownOpen(false)
    setDropdownRect(null)
    
    // Set form data with existing guest info
    setFormData({
      Name: guest.Name,
      Email: guest.Email && guest.Email !== "Pending" && guest.Email !== "" ? guest.Email : "",
      RSVP: guest.RSVP || "",
      Guest: guest.Guest && guest.Guest !== "" ? guest.Guest : "1",
      Message: guest.Message || "",
      Status: guest.Status || "pending",
    })
    
    // Load existing companions if available
    if (guest.Companions && guest.Companions.length > 0) {
      setCompanions(guest.Companions)
    } else {
      setCompanions([])
    }
    
    // Check if guest has already responded (status is confirmed or declined)
    setHasResponded(!!(guest.Status && (guest.Status === "confirmed" || guest.Status === "declined")))
    
    // Show modal
    setShowModal(true)
  }

  const handleOpenRequestModal = () => {
    setRequestFormData((prev) => ({ ...prev, Name: searchQuery }))
    setIsDropdownOpen(false)
    setDropdownRect(null)
    setShowRequestModal(true)
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitRSVP = async () => {
    if (!selectedGuest) return

    if (!formData.RSVP) {
      setError("Please select if you can attend")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Use the allowedGuests from selectedGuest
      const guestCount = formData.RSVP === "Yes" ? selectedGuest.AllowedGuests.toString() : "0"
      
      // Determine the status based on RSVP
      const status = formData.RSVP === "Yes" ? "confirmed" : formData.RSVP === "No" ? "declined" : "pending"
      
      const response = await fetch("/api/guests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(selectedGuest.id),
          name: formData.Name,
          email: formData.Email || "Pending",
          status: status,
          allowedGuests: parseInt(guestCount),
          message: formData.Message,
          companions: companions, // Include companion names
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit RSVP")
      }

      // Show success and close modal after delay
      setSuccess("Thank you for your response!")
      setHasResponded(true)
      
      // Trigger event to refresh Book of Guests
      window.dispatchEvent(new Event("rsvpUpdated"))
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowModal(false)
        setSearchQuery("")
        setSelectedGuest(null)
        setSuccess(null)
        fetchGuests()
      }, 3000)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setError("Failed to submit RSVP. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedGuest(null)
    setSearchQuery("")
    setFormData({ Name: "", Email: "", RSVP: "", Guest: "1", Message: "", Status: "pending" })
    setCompanions([])
    setHasResponded(false)
    setError(null)
  }

  const handleSubmitRequest = async () => {
    if (!requestFormData.Name) {
      setError("Name is required")
      setTimeout(() => setError(null), 5000)
      return
    }

    setIsLoading(true)
    setError(null)
    setRequestSuccess(null)

    try {
      // Submit to guest-requests API
      const response = await fetch("/api/guest-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: requestFormData.Name,
          Email: requestFormData.Email || "",
          Phone: requestFormData.Phone || "",
          RSVP: "",
          Guest: requestFormData.Guest || "1",
          Message: requestFormData.Message || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setRequestSuccess("Request submitted! We'll review and get back to you.")
      
      // Close modal and reset after showing success
      setTimeout(() => {
        setShowRequestModal(false)
        setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
        setSearchQuery("")
        setRequestSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting request:", error)
      setError("Failed to submit request. Please try again.")
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseRequestModal = () => {
    setShowRequestModal(false)
    setRequestFormData({ Name: "", Email: "", Phone: "", Guest: "1", Message: "" })
    setError(null)
    setRequestSuccess(null)
  }

  return (
    <Section id="guest-list" className="relative z-30 py-6 sm:py-10 md:py-12 lg:py-16 overflow-visible" bgColor="none">
      {/* Section background — aligned with entourage.tsx */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
      }} />

      {/* Header */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-2 sm:px-3 md:px-4">
        {/* Frosted glass header card */}
        <div
          className="inline-block rounded-3xl px-8 py-7 sm:px-14 sm:py-9"
          style={FROSTED_CARD}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: FONT_LABEL,
              fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: STEEL,
              marginBottom: "0.5rem",
              paddingRight: "0.40em",
            }}
          >
            Confirm Your Attendance
          </p>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
            <span style={{ color: GOLD, fontSize: "8px", opacity: 0.9 }}>✦</span>
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "cinzel",
              fontSize: "clamp(2.8rem, 12vw, 5.5rem)",
              color: GOLD,
              lineHeight: 1.1,
              overflow: "visible",
              paddingTop: "0.1em",
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
            }}
          >
            RSVP
          </h2>

          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-6 sm:w-10" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
            <span style={{ color: GOLD, fontSize: "5px", letterSpacing: "0.2em" }}>◆◆◆</span>
            <div className="h-px w-6 sm:w-10" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
          </div>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
              color: NAVY_MUTE,
              fontStyle: "italic",
              lineHeight: 1.75,
              maxWidth: "420px",
              margin: "0 auto 0.5rem",
            }}
          >
            Please search for your name below to confirm your presence at this blessed celebration.
          </p>

          <p
            style={{
              fontFamily: FONT_LABEL,
              fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
              color: DARK_NAVY,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            RSVP Deadline: <span style={{ color: GOLD }}>{siteConfig.details.rsvp.deadline}</span>
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 max-w-2xl mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
        {/* Card with frosted ivory background */}
        <div
          className="relative rounded-3xl overflow-visible"
          style={FROSTED_CARD}
        >
          <div className="relative p-3 sm:p-5 md:p-6 overflow-visible">
            <div className="relative z-10 space-y-3 sm:space-y-4 overflow-visible">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="p-1.5 sm:p-2 rounded-lg"
                  style={{ background: "rgba(196,152,88,0.10)", border: `1.5px solid ${GOLD_BORDER}` }}
                >
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <label className="block mb-0.5 sm:mb-1" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)", color: DARK_NAVY, fontWeight: 500 }}>
                    Find Your Name
                  </label>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                    Type as you search to see instant results
                  </p>
                </div>
              </div>
              <div ref={searchRef} className="relative">
                <div ref={inputAnchorRef} className="relative">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 pointer-events-none" style={{ color: NAVY_MUTE }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value
                      setSearchQuery(value)
                      setIsDropdownOpen(value.trim().length > 0)
                    }}
                    onFocus={() => {
                      updateDropdownPosition()
                      if (searchQuery.trim()) setIsDropdownOpen(true)
                    }}
                    placeholder="Type your name..."
                    className={`${INPUT_CLASS} pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm`}
                    style={INPUT_STYLE}
                    aria-autocomplete="list"
                    aria-expanded={showDropdownPortal}
                    aria-controls="guest-name-suggestions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Name suggestion dropdown — portaled above all sections */}
      {mounted && showDropdownPortal && dropdownRect && createPortal(
        <div
          ref={dropdownPortalRef}
          id="guest-name-suggestions"
          role="listbox"
          className="rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
          style={{
            position: "fixed",
            top: dropdownRect.top,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: LAYER_TOP,
            ...SUGGESTION_PANEL,
          }}
        >
          <div className="h-[3px] w-full" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.55), transparent)" }} />

          {showMatchDropdown && (
            <>
              <div
                className="px-3 py-2 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${GOLD_BORDER}`, background: "rgba(196,152,88,0.06)" }}
              >
                <span style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.58rem, 1.7vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: STEEL }}>
                  Select your name
                </span>
                <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                  {filteredGuests.length} {filteredGuests.length === 1 ? "match" : "matches"}
                </span>
              </div>
              <div className="max-h-[min(280px,50vh)] overflow-y-auto overscroll-contain">
                {filteredGuests.map((guest, index) => (
                  <button
                    key={guest.id ?? index}
                    role="option"
                    onClick={() => handleSearchSelect(guest)}
                    className="w-full px-2.5 sm:px-3 py-2.5 sm:py-3 text-left transition-all duration-200 flex items-center gap-2 sm:gap-3 group"
                    style={{ borderBottom: index < filteredGuests.length - 1 ? `1px solid ${GOLD_BORDER}` : "none" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,152,88,0.10)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="p-1.5 sm:p-2 rounded-full" style={ICON_WRAP}>
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: GOLD }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="truncate transition-colors duration-200 group-hover:text-[#C4965A]"
                        style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: DARK_NAVY, fontWeight: 500 }}
                      >
                        {highlightName(guest.Name, searchQuery)}
                      </div>
                      {guest.Email && guest.Email !== "Pending" && (
                        <div className="truncate mt-0.5" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", fontStyle: "italic", color: NAVY_MUTE }}>
                          {guest.Email}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#C4965A]" style={{ color: STEEL }} />
                  </button>
                ))}
              </div>
            </>
          )}

          {showEmptyDropdown && (
            <div className="p-2.5 sm:p-3 md:p-4">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={ICON_WRAP}>
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: GOLD }} />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1" style={{ fontFamily: "cinzel", fontSize: "clamp(1rem, 3.5vw, 1.25rem)", color: GOLD, lineHeight: 1.1, filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                    Not finding your name?
                  </h4>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE, lineHeight: 1.6, fontStyle: "italic" }}>
                    We'd love to have you with us! Send a request to join the celebration.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenRequestModal}
                className="w-full text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                style={{ background: DARK_NAVY, fontFamily: "cinzel, serif" }}
              >
                <UserPlus className="h-3 w-3 mr-1.5 sm:mr-2 inline" />
                Request to Join
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* RSVP Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          style={{ zIndex: LAYER_TOP }}
          onClick={handleCloseModal}
        >
            <div 
              className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
              style={{ ...MODAL_SHELL, borderRadius: "1rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="relative p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0"
                style={{ background: DARK_NAVY }}
              >
                <div className="h-[3px] w-full absolute top-0 left-0" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.55), transparent)" }} />
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <h3 className="text-white" style={{ fontFamily: "cinzel, serif", fontSize: "clamp(1.2rem, 5vw, 2rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em", filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                        You Are Warmly Invited
                      </h3>
                    </div>
                    <p className="text-white/95" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.72rem, 2.5vw, 0.9rem)", lineHeight: 1.6 }}>
                      Dear <span className="font-bold text-white" style={{ fontFamily: FONT_LABEL }}>{selectedGuest?.Name}</span>, witness and celebrate the Christening!
                    </p>
                    <p className="text-white/85 mt-1" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.8rem)" }}>
                      We've reserved <span className="font-bold text-white" style={{ fontFamily: FONT_LABEL }}>{selectedGuest?.AllowedGuests || 1}</span> {selectedGuest?.AllowedGuests === 1 ? 'seat' : 'seats'} for you.
                    </p>
                  </div>
                  {!hasResponded && (
                    <button
                      onClick={handleCloseModal}
                      className="transition-colors p-0.5 sm:p-1 md:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0" style={{ background: MODAL_BODY_BG }}>
                {hasResponded ? (
                  // Thank you message for guests who already responded
                  <div className="text-center py-3 sm:py-4 md:py-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full mb-2 sm:mb-3 md:mb-4" style={{ background: DARK_NAVY }}>
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h4 className="mb-1.5 sm:mb-2 md:mb-3" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.3rem, 5vw, 1.9rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em", color: GOLD, filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                      Thank You for Responding!
                    </h4>
                    <p className="mb-2 sm:mb-3 md:mb-4 px-2" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.72rem, 2.5vw, 0.88rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                      We've received your RSVP and look forward to celebrating with you!
                    </p>
                    <div className="rounded-lg p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-2.5 md:space-y-3" style={{ background: "rgba(196,152,88,0.08)", border: `1.5px solid ${GOLD_BORDER}` }}>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                        {selectedGuest?.RSVP === "Yes" && (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" style={{ color: GOLD }} />
                            <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY }}>
                              You're Attending!
                            </span>
                          </>
                        )}
                        {selectedGuest?.RSVP === "No" && (
                          <>
                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" style={{ color: STEEL }} />
                            <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: STEEL }}>
                              Unable to Attend
                            </span>
                          </>
                        )}
                      </div>
                      {selectedGuest?.RSVP === "Yes" && (
                        <div className="rounded-lg p-2 sm:p-2.5 md:p-3" style={{ background: "rgba(255,255,255,0.55)", border: `1.5px solid ${GOLD_BORDER}` }}>
                          <div className="text-center">
                            <p className="mb-1 font-medium" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>Number of Guests</p>
                            <p className="font-bold" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: GOLD, lineHeight: 1.1 }}>
                              {selectedGuest.AllowedGuests || 1}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedGuest && selectedGuest.Message && selectedGuest.Message.trim() !== "" && (
                        <div className="pt-1.5 sm:pt-2" style={{ borderTop: `1px solid ${GOLD_BORDER}` }}>
                          <p className="italic px-1" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE }}>
                            "{selectedGuest.Message}"
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="mt-3 sm:mt-4 md:mt-6 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold transition-all duration-300 hover:opacity-90"
                      style={{ background: DARK_NAVY, fontFamily: FONT_LABEL }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  // RSVP Form for guests who haven't responded
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmitRSVP()
                    }}
                    className="space-y-2.5 sm:space-y-3 md:space-y-4"
                  >
                    {/* Can you attend? */}
                    <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                        <span>Can you attend? *</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, RSVP: "Yes", Guest: "1" }))
                          }
                          className="relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300"
                          style={formData.RSVP === "Yes"
                            ? { borderColor: GOLD, background: "rgba(196,152,88,0.10)", boxShadow: "0 4px 14px rgba(196,152,88,0.18)", transform: "scale(1.05)" }
                            : { borderColor: GOLD_BORDER, background: "rgba(255,255,255,0.55)" }
                          }
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <CheckCircle
                              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                              style={{ color: formData.RSVP === "Yes" ? GOLD : `${NAVY_MUTE}99` }}
                            />
                            <span className="font-bold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: formData.RSVP === "Yes" ? GOLD : DARK_NAVY }}>
                              Yes!
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, RSVP: "No" }))}
                          className="relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300"
                          style={formData.RSVP === "No"
                            ? { borderColor: "#ef4444", background: "#fef2f2", transform: "scale(1.05)" }
                            : { borderColor: GOLD_BORDER, background: "rgba(255,255,255,0.55)" }
                          }
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <XCircle
                              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                              style={{ color: formData.RSVP === "No" ? "#ef4444" : NAVY_MUTE }}
                            />
                            <span
                              className="font-bold"
                              style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: formData.RSVP === "No" ? "#ef4444" : DARK_NAVY }}
                            >
                              Sorry, No
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Who's Coming With You - Companion Names */}
                    {formData.RSVP === "Yes" && companions.length > 0 && (
                      <div className="space-y-2.5 sm:space-y-3">
                        <label className="flex items-center gap-1.5 sm:gap-2" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                          <span>Who's Coming With You?</span>
                        </label>
                        <p className="-mt-1 sm:-mt-1.5" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                          Please provide names and relationships for your <span className="font-semibold">{companions.length}</span> additional {companions.length === 1 ? 'guest' : 'guests'}
                        </p>
                        {companions.map((companion, index) => (
                          <div key={index} className="rounded-lg p-2 sm:p-2.5 md:p-3 space-y-2 sm:space-y-2.5" style={{ background: "rgba(196,152,88,0.08)", border: `1.5px solid ${GOLD_BORDER}` }}>
                            <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: GOLD }} />
                              <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: DARK_NAVY }}>
                                Guest {index + 2}
                              </span>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div>
                                <label className="block font-medium mb-1" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: DARK_NAVY }}>
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={companion.name}
                                  onChange={(e) => {
                                    const newCompanions = [...companions]
                                    newCompanions[index] = { ...newCompanions[index], name: e.target.value }
                                    setCompanions(newCompanions)
                                  }}
                                  placeholder={`Name of guest ${index + 2}`}
                                  className={`${INPUT_CLASS} px-2 sm:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs`}
                                  style={{ ...INPUT_STYLE, fontSize: "clamp(0.65rem, 2vw, 0.76rem)" }}
                                />
                              </div>
                              <div>
                                <label className="block font-medium mb-1" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: DARK_NAVY }}>
                                  Relationship with {selectedGuest?.Name || 'Primary Guest'}
                                </label>
                                <input
                                  type="text"
                                  value={companion.relationship}
                                  onChange={(e) => {
                                    const newCompanions = [...companions]
                                    newCompanions[index] = { ...newCompanions[index], relationship: e.target.value }
                                    setCompanions(newCompanions)
                                  }}
                                  placeholder="e.g., Spouse, Friend, Child, Parent"
                                  className={`${INPUT_CLASS} px-2 sm:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs`}
                                  style={{ ...INPUT_STYLE, fontSize: "clamp(0.65rem, 2vw, 0.76rem)" }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message to the couple */}
                    {/* <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                        <span>Message for Kaezar</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>(Optional)</span>
                      </label>
                      <textarea
                        name="Message"
                        value={formData.Message}
                        onChange={handleFormChange}
                        placeholder="Leave a heartfelt message for Kaezar to read and treasure in the future..."
                        rows={3}
                      className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm resize-none`}
                      style={INPUT_STYLE}
                      />
                    </div> */}

                    {/* Email */}
                    <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                        <span>Your Email Address</span>
                        <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormChange}
                        placeholder="your.email@example.com"
                        className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm`}
                        style={INPUT_STYLE}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 sm:pt-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2"
                        style={{ background: DARK_NAVY, fontFamily: FONT_LABEL }}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                            <span className="text-xs sm:text-sm">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Submit RSVP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Success Overlay — light ivory */}
              {success && (
                <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4" style={{ background: "rgba(255,255,255,0.92)" }}>
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: `${GOLD}44` }} />
                      <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${GOLD}66` }} />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-xl" style={{ background: DARK_NAVY }}>
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="mb-2 sm:mb-3" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: GOLD, lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em", filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                      RSVP Confirmed!
                    </h4>

                    {/* Message based on RSVP response */}
                    {formData.RSVP === "Yes" && (
                      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                        <p className="font-medium" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY }}>
                          We're thrilled you'll be joining us!
                        </p>
                        <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                          Your response has been recorded
                        </p>
                      </div>
                    )}
                    {formData.RSVP === "No" && (
                      <p className="mb-2 sm:mb-3" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                        We'll miss you, but thank you for letting us know.
                      </p>
                    )}
                    {!formData.RSVP && (
                      <p className="mb-2 sm:mb-3" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                        Thank you for your response!
                      </p>
                    )}

                    {/* Closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: `${GOLD}99` }} />
                      <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: `${NAVY_MUTE}aa` }}>
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: `${GOLD}99` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !success && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4" style={{ background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.22)" }}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" style={{ color: "#b91c1c" }} />
                      <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.65rem, 2vw, 0.82rem)", color: "#b91c1c" }}>{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request to Join Modal */}
        {showRequestModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          style={{ zIndex: LAYER_TOP }}
            onClick={handleCloseRequestModal}
          >
            <div 
              className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
              style={{ ...MODAL_SHELL, borderRadius: "1rem" }}              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="relative p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0"
                style={{ background: DARK_NAVY }}
              >
                <div className="h-[3px] w-full absolute top-0 left-0" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.55), transparent)" }} />
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserPlus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                      <h3 className="text-white" style={{ fontFamily: "cinzel, serif", fontSize: "clamp(1.2rem, 5vw, 2rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em", filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                        Request to Join
                      </h3>
                    </div>
                    <p className="text-white/95 leading-tight sm:leading-normal" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.72rem, 2.5vw, 0.9rem)" }}>
                      {requestFormData.Name ? (
                        <>Hi <span className="font-extrabold text-white" style={{ fontFamily: FONT_LABEL }}>{requestFormData.Name}</span> — want to celebrate with us? Send a request!</>
                      ) : (
                        <>Want to celebrate with us? Send a request!</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseRequestModal}
                    className="transition-colors p-0.5 sm:p-1 md:p-1.5 lg:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0" style={{ background: MODAL_BODY_BG }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitRequest()
                  }}
                  className="space-y-2.5 sm:space-y-3 md:space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={requestFormData.Name}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm`}
                      style={INPUT_STYLE}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>Email Address</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={requestFormData.Email}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Email: e.target.value })}
                      placeholder="your.email@example.com"
                      className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm`}
                      style={INPUT_STYLE}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>Phone Number</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={requestFormData.Phone}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm`}
                      style={INPUT_STYLE}
                    />
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>Number of Guests *</span>
                    </label>
                    <input
                      type="number"
                      name="Guest"
                      value={requestFormData.Guest}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Guest: e.target.value })}
                      min="1"
                      required
                      placeholder="How many guests?"
                      className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm`}
                      style={INPUT_STYLE}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>Message</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: NAVY_MUTE }}>(Optional)</span>
                    </label>
                    <textarea
                      name="Message"
                      value={requestFormData.Message}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Message: e.target.value })}
                      placeholder="Share why you'd like to join..."
                      rows={3}
                        className={`${INPUT_CLASS} px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm resize-none`}
                        style={INPUT_STYLE}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2"
                      style={{ background: DARK_NAVY, fontFamily: FONT_LABEL }}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span className="text-xs sm:text-sm">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Success Overlay — light ivory */}
              {requestSuccess && (
                <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4" style={{ background: "rgba(255,255,255,0.92)" }}>
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: `${GOLD}44` }} />
                      <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${GOLD}66` }} />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-xl" style={{ background: DARK_NAVY }}>
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="mb-2 sm:mb-3" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: GOLD, lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em", filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" }}>
                      Request Sent!
                    </h4>

                    {/* Message */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <p className="font-medium" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: GOLD }}>
                        We've received your request
                      </p>
                      <p className="italic" style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: NAVY_MUTE }}>
                        We'll review it and get back to you soon
                      </p>
                    </div>

                    {/* Closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: `${GOLD}99` }} />
                      <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: `${NAVY_MUTE}aa` }}>
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: `${GOLD}99` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !requestSuccess && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4" style={{ background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.22)" }}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" style={{ color: "#b91c1c" }} />
                      <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.65rem, 2vw, 0.82rem)", color: "#b91c1c" }}>{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Floating Status Messages (outside modals) */}
      {success && !showModal && !showRequestModal && !requestSuccess && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-2 sm:mx-4" style={{ zIndex: LAYER_TOP }}>
          <div className="rounded-xl p-2 sm:p-3 md:p-4 shadow-lg animate-in slide-in-from-top" style={{ ...FROSTED_CARD, border: `1.5px solid ${GOLD_BORDER}` }}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" style={{ color: GOLD }} />
              <span className="font-semibold" style={{ fontFamily: FONT_LABEL, fontSize: "clamp(0.72rem, 2.2vw, 0.9rem)", color: DARK_NAVY }}>{success}</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}