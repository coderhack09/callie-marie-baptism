"use client"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import { siteConfig } from "@/content/site"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

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
  const [isSearching, setIsSearching] = useState(false)
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
      setIsSearching(false)
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
    setIsSearching(sorted.length > 0)
  }, [searchQuery, guests])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
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
    setIsSearching(false)
    
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
    <Section id="guest-list" className="relative z-30 py-6 sm:py-10 md:py-12 lg:py-16">
      {/* Header */}
      <div className="relative z-10 text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-2 sm:px-3 md:px-4">

        {/* Eyebrow */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: "rgba(255,247,240,0.82)",
            marginBottom: "0.4rem",
            paddingRight: "0.48em",
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}
        >
          Confirm Your Attendance
        </p>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.5), transparent)" }} />
          <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.8 }}>✦</span>
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.5), transparent)" }} />
        </div>

        {/* Title */}
        <h2
          className="gistesy"
          style={{
            fontSize: "clamp(2.8rem, 12vw, 5.5rem)",
            color: "var(--color-motif-cream)",
            lineHeight: 1.1,
            overflow: "visible",
            paddingTop: "0.1em",
            marginBottom: "0.5rem",
            textShadow: "0 4px 20px rgba(0,0,0,0.55)",
          }}
        >
          RSVP
        </h2>

        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
            color: "rgba(255,247,240,0.85)",
            fontStyle: "italic",
            lineHeight: 1.8,
            maxWidth: "460px",
            margin: "0 auto 0.4rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          Please search for your name below to confirm your presence at this blessed celebration.
        </p>

        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.78rem, 2.8vw, 0.9rem)",
            color: "rgba(255,247,240,0.92)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            marginBottom: "0.5rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          RSVP Deadline: {siteConfig.details.rsvp.deadline}
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.45), transparent)" }} />
          <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.45), transparent)" }} />
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 max-w-2xl mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
        {/* Card with elegant border */}
        <div className="relative bg-white/10 backdrop-blur-md border border-motif-deep/60 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-visible">
          {/* Card content */}
          <div className="relative p-2.5 sm:p-4 md:p-5 lg:p-6 overflow-visible">
            <div className="relative z-10 space-y-3 sm:space-y-4 overflow-visible">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-motif-deep p-1.5 sm:p-2 rounded-lg shadow-md">
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <label className="garamond block mb-0.5 sm:mb-1" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)", color: "var(--color-motif-cream)", fontWeight: 600 }}>
                    Find Your Name
                  </label>
                  <p className="garamond" style={{ fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: "rgba(255,247,240,0.75)", fontStyle: "italic" }}>
                    Type as you search to see instant results
                  </p>
                </div>
              </div>
              <div ref={searchRef} className="relative z-[100]">
                <div className="relative">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-motif-deep/70 pointer-events-none transition-colors duration-200" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your name..."
                    className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 md:py-3 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 hover:border-motif-deep/70 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream shadow-sm focus:shadow-md"
                  />
                </div>
                {/* Autocomplete dropdown */}
                {isSearching && filteredGuests.length > 0 && (
                  <div 
                    className="absolute z-[9999] w-full mt-1 sm:mt-1.5 md:mt-2 bg-motif-cream/95 backdrop-blur-lg border border-motif-deep/70 rounded-lg sm:rounded-xl shadow-xl overflow-hidden" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%',
                      left: 0,
                      right: 0
                    }}
                  >
                    {filteredGuests.map((guest, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(guest)}
                        className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-left hover:bg-motif-cream/40 active:bg-motif-deep/40 transition-all duration-200 flex items-center gap-2 sm:gap-3 border-b border-motif-deep/40 last:border-b-0 group"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="bg-motif-deep p-1 sm:p-1.5 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-motif-deep group-hover:text-motif-deep transition-colors duration-200 truncate">
                            {guest.Name}
                          </div>
                          {guest.Email && guest.Email !== "Pending" && (
                            <div className="text-[10px] sm:text-xs text-motif-medium/80 truncate mt-0.5">
                              {guest.Email}
                            </div>
                          )}
                        </div>
                        <div className="text-motif-medium/70 group-hover:text-motif-deep group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && filteredGuests.length === 0 && (
                  <div 
                    className="absolute z-[9999] w-full mt-1.5 sm:mt-2 bg-motif-cream/95 backdrop-blur-lg border-2 border-motif-deep/80 rounded-lg shadow-xl overflow-hidden" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%',
                      left: 0,
                      right: 0
                    }}
                  >
                    <div className="p-2.5 sm:p-3 md:p-4">
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="bg-motif-deep p-1.5 sm:p-2 rounded-lg flex-shrink-0 shadow-sm">
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="garamond mb-1" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>Not finding your name?</h4>
                          <p className="garamond" style={{ fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: MEDIUM, lineHeight: 1.6 }}>
                            We'd love to have you with us! Send a request to join the celebration.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setRequestFormData({ ...requestFormData, Name: searchQuery })
                          setShowRequestModal(true)
                        }}
                        className="w-full !bg-motif-deep hover:!bg-motif-deep/90 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                      >
                        <UserPlus className="h-3 w-3 mr-1.5 sm:mr-2 inline" />
                        Request to Join
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={handleCloseModal}
        >
            <div 
              className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 bg-motif-cream rounded-xl sm:rounded-2xl shadow-2xl border-2 border-motif-deep/80 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative bg-motif-deep p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-motif-cream/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-motif-cream" />
                      </div>
                      <h3 className="gistesy text-motif-cream" style={{ fontSize: "clamp(1.2rem, 5vw, 2rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}>
                        You Are Warmly Invited
                      </h3>
                    </div>
                    <p className="garamond text-motif-cream/95" style={{ fontSize: "clamp(0.72rem, 2.5vw, 0.9rem)", lineHeight: 1.6 }}>
                      Dear <span className="font-bold text-motif-cream">{selectedGuest?.Name}</span>, witness and celebrate the Christening!
                    </p>
                    <p className="garamond text-motif-cream/85 mt-1" style={{ fontSize: "clamp(0.65rem, 2vw, 0.8rem)" }}>
                      We've reserved <span className="font-bold text-motif-cream">{selectedGuest?.AllowedGuests || 1}</span> {selectedGuest?.AllowedGuests === 1 ? 'seat' : 'seats'} for you.
                    </p>
                  </div>
                  {!hasResponded && (
                    <button
                      onClick={handleCloseModal}
                      className="text-motif-deep/80 hover:text-motif-deep transition-colors p-0.5 sm:p-1 md:p-2 hover:bg-white/20 rounded-full flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-motif-deep" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0">
                {hasResponded ? (
                  // Thank you message for guests who already responded
                  <div className="text-center py-3 sm:py-4 md:py-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-motif-deep rounded-full mb-2 sm:mb-3 md:mb-4">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h4 className="gistesy text-motif-deep mb-1.5 sm:mb-2 md:mb-3" style={{ fontSize: "clamp(1.3rem, 5vw, 1.9rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}>
                      Thank You for Responding!
                    </h4>
                    <p className="garamond text-motif-medium text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 px-2">
                      We've received your RSVP and look forward to celebrating with you!
                    </p>
                    <div className="bg-motif-cream/40 rounded-lg p-2.5 sm:p-3 md:p-4 border border-motif-deep/70 space-y-2 sm:space-y-2.5 md:space-y-3">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
                        {selectedGuest?.RSVP === "Yes" && (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-green-600">
                              You're Attending!
                            </span>
                          </>
                        )}
                        {selectedGuest?.RSVP === "No" && (
                          <>
                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600" />
                            <span className="text-xs sm:text-sm md:text-base font-semibold text-red-600">
                              Unable to Attend
                            </span>
                          </>
                        )}
                      </div>
                      {selectedGuest?.RSVP === "Yes" && (
                        <div className="bg-motif-cream/60 rounded-lg p-2 sm:p-2.5 md:p-3 border border-motif-deep/80">
                          <div className="text-center">
                            <p className="text-[10px] sm:text-xs text-motif-medium mb-1 font-medium">Number of Guests</p>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-motif-deep">
                              {selectedGuest.AllowedGuests || 1}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedGuest && selectedGuest.Message && selectedGuest.Message.trim() !== "" && (
                        <div className="pt-1.5 sm:pt-2 border-t border-motif-deep/70">
                          <p className="text-[10px] sm:text-xs text-motif-medium italic px-1">
                            "{selectedGuest.Message}"
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="mt-3 sm:mt-4 md:mt-6 !bg-motif-deep hover:!bg-motif-deep/90 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300"
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
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                        <span>Can you attend? *</span>
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, RSVP: "Yes", Guest: "1" }))
                          }
                          className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.RSVP === "Yes"
                              ? "border-motif-deep bg-motif-deep/10 shadow-md scale-105"
                              : "border-motif-deep/60 bg-motif-cream/60 hover:border-motif-deep/70 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <CheckCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                formData.RSVP === "Yes" ? "text-motif-deep" : "text-motif-medium/60"
                              }`}
                            />
                            <span
                              className={`text-xs sm:text-sm font-bold ${
                                formData.RSVP === "Yes" ? "text-motif-deep" : "text-motif-deep"
                              }`}
                            >
                              Yes!
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, RSVP: "No" }))}
                          className={`relative p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.RSVP === "No"
                              ? "border-red-500 bg-red-50 shadow-md scale-105"
                              : "border-motif-deep/60 bg-motif-cream/60 hover:border-motif-deep/70 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <XCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                                formData.RSVP === "No" ? "text-red-600" : "text-motif-medium/60"
                              }`}
                            />
                            <span
                              className={`text-xs sm:text-sm font-bold ${
                                formData.RSVP === "No" ? "text-red-600" : "text-motif-deep"
                              }`}
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
                        <label className="garamond flex items-center gap-1.5 sm:gap-2" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                          <span>Who's Coming With You?</span>
                        </label>
                        <p className="garamond -mt-1 sm:-mt-1.5" style={{ fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: MEDIUM }}>
                          Please provide names and relationships for your <span className="font-semibold">{companions.length}</span> additional {companions.length === 1 ? 'guest' : 'guests'}
                        </p>
                        {companions.map((companion, index) => (
                          <div key={index} className="bg-motif-cream/40 rounded-lg p-2 sm:p-2.5 md:p-3 border border-motif-deep/40 space-y-2 sm:space-y-2.5">
                            <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                              <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-motif-deep" />
                              <span className="text-[10px] sm:text-xs font-semibold text-motif-deep">
                                Guest {index + 2}
                              </span>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium text-motif-deep mb-1">
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
                                  className="w-full px-2 sm:px-2.5 py-1.5 sm:py-2 border border-motif-deep/50 focus:border-motif-deep rounded text-[10px] sm:text-xs font-sans text-motif-deep placeholder:text-motif-medium/60 transition-all duration-300 focus:ring-1 focus:ring-motif-deep/20 bg-motif-cream"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] sm:text-xs font-medium text-motif-deep mb-1">
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
                                  className="w-full px-2 sm:px-2.5 py-1.5 sm:py-2 border border-motif-deep/50 focus:border-motif-deep rounded text-[10px] sm:text-xs font-sans text-motif-deep placeholder:text-motif-medium/60 transition-all duration-300 focus:ring-1 focus:ring-motif-deep/20 bg-motif-cream"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message to the couple */}
                    <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                        <span>Message for Niahna</span>
                      <span className="garamond font-normal" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}90` }}>(Optional)</span>
                      </label>
                      <textarea
                        name="Message"
                        value={formData.Message}
                        onChange={handleFormChange}
                        placeholder="Leave a heartfelt message for Niahna to read and treasure in the future..."
                        rows={3}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 resize-none bg-motif-cream"
                      />
                    </div>

                    {/* Email */}
                    <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                        <span>Your Email Address</span>
                        <span className="garamond font-normal" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}90` }}>(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormChange}
                        placeholder="your.email@example.com"
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 sm:pt-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full !bg-motif-deep hover:!bg-motif-deep/90 text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2"
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

              {/* Enhanced Success Overlay */}
              {success && (
                <div className="absolute inset-0 bg-motif-deep/98 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4">
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Enhanced Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      {/* Animated rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-motif-cream/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full border-2 border-motif-cream/30" />
                      {/* Icon container */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-motif-cream rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-motif-medium" strokeWidth={2.5} />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h4 className="gistesy text-motif-cream mb-2 sm:mb-3" style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}>
                      RSVP Confirmed!
                    </h4>
                    
                    {/* Message based on RSVP response */}
                    {formData.RSVP === "Yes" && (
                      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                        <p className="text-motif-medium/95 text-xs sm:text-sm font-medium">
                          We're thrilled you'll be joining us!
                        </p>
                        <p className="text-motif-medium/80 text-[10px] sm:text-xs">
                          Your response has been recorded
                        </p>
                      </div>
                    )}
                    {formData.RSVP === "No" && (
                      <p className="text-motif-medium/90 text-xs sm:text-sm mb-2 sm:mb-3">
                        We'll miss you, but thank you for letting us know.
                      </p>
                    )}
                    {!formData.RSVP && (
                      <p className="text-motif-medium/90 text-xs sm:text-sm mb-2 sm:mb-3">
                        Thank you for your response!
                      </p>
                    )}
                    
                    {/* Subtle closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-motif-medium/60 rounded-full animate-pulse" />
                      <p className="text-motif-medium/70 text-[10px] sm:text-xs">
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-motif-medium/60 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !success && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-600 font-semibold text-[10px] sm:text-xs md:text-sm">{error}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={handleCloseRequestModal}
          >
            <div 
              className="relative w-full max-w-md sm:max-w-lg mx-1 sm:mx-2 md:mx-4 bg-motif-cream rounded-xl sm:rounded-2xl shadow-2xl border-2 border-motif-deep/80 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div className="relative bg-motif-deep p-3 sm:p-4 md:p-5 lg:p-6 flex-shrink-0">
                <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-motif-cream/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                        <UserPlus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-motif-cream" />
                      </div>
                      <h3 className="gistesy text-motif-cream" style={{ fontSize: "clamp(1.2rem, 5vw, 2rem)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}>
                        Request to Join
                      </h3>
                    </div>
                    <p className="text-motif-cream/95 text-[10px] sm:text-xs md:text-sm lg:text-base font-sans leading-tight sm:leading-normal">
                      {requestFormData.Name ? (
                        <>Hi <span className="font-extrabold text-motif-cream">{requestFormData.Name}</span> — want to celebrate with us? Send a request!</>
                      ) : (
                        <>Want to celebrate with us? Send a request!</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseRequestModal}
                    className="text-motif-cream/80 hover:text-motif-cream transition-colors p-0.5 sm:p-1 md:p-1.5 lg:p-2 hover:bg-motif-deep/20 rounded-full flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-motif-cream" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-y-auto flex-1 min-h-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitRequest()
                  }}
                  className="space-y-2.5 sm:space-y-3 md:space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={requestFormData.Name}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Name: e.target.value })}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                      <span>Email Address</span>
                      <span className="garamond font-normal" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}90` }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={requestFormData.Email}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                      <span>Phone Number</span>
                      <span className="garamond font-normal" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}90` }}>(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      value={requestFormData.Phone}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream"
                    />
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
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
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 bg-motif-cream"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="garamond flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP, fontWeight: 600 }}>
                      <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: ACCENT }} />
                      <span>Message</span>
                      <span className="garamond font-normal" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}90` }}>(Optional)</span>
                    </label>
                    <textarea
                      name="Message"
                      value={requestFormData.Message}
                      onChange={(e) => setRequestFormData({ ...requestFormData, Message: e.target.value })}
                      placeholder="Share why you'd like to join..."
                      rows={3}
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-motif-deep/60 focus:border-motif-deep rounded-lg text-xs sm:text-sm font-sans text-motif-deep placeholder:text-motif-medium/70 transition-all duration-300 focus:ring-2 focus:ring-motif-deep/20 resize-none bg-motif-cream"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full !bg-motif-deep hover:!bg-motif-deep/90 text-white py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2"
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

              {/* Enhanced Success Overlay */}
              {requestSuccess && (
                <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300 p-2 sm:p-3 md:p-4" style={{ background: `${DEEP}f5` }}>
                  <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 max-w-sm mx-auto">
                    {/* Icon Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                      <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: `${ACCENT}40` }} />
                      <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${ACCENT}55` }} />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-xl" style={{ background: "var(--color-motif-cream)" }}>
                        <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" style={{ color: ACCENT }} strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="gistesy mb-2 sm:mb-3" style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "var(--color-motif-cream)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}>
                      Request Sent!
                    </h4>

                    {/* Message */}
                    <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                      <p className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: "rgba(255,247,240,0.92)", fontWeight: 500 }}>
                        We've received your request
                      </p>
                      <p className="garamond" style={{ fontSize: "clamp(0.65rem, 2vw, 0.76rem)", color: "rgba(255,247,240,0.75)", fontStyle: "italic" }}>
                        We'll review it and get back to you soon
                      </p>
                    </div>

                    {/* Closing indicator */}
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: "rgba(207,160,107,0.6)" }} />
                      <p className="garamond" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: "rgba(255,247,240,0.6)" }}>
                        This will close automatically
                      </p>
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full animate-pulse" style={{ background: "rgba(207,160,107,0.6)" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !requestSuccess && (
                <div className="px-2 sm:px-2.5 md:px-4 lg:px-6 xl:px-8 pb-2 sm:pb-2.5 md:pb-4 lg:pb-6">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-600 font-semibold text-[10px] sm:text-xs md:text-sm">{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Floating Status Messages (outside modals) */}
      {success && !showModal && !showRequestModal && !requestSuccess && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2 sm:mx-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-lg animate-in slide-in-from-top">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
              <span className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">{success}</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}