"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface TimeSlot {
  id: string
  date: string
  time: string
  duration: number
  is_available: boolean
  meeting_type: string
}

interface Meeting {
  id: string
  name: string
  email: string
  company?: string
  meeting_type: string
  preferred_date: string
  preferred_time: string
  duration: number
  message: string
  status: "pending" | "confirmed" | "completed"
  created_at: string
}

export function MeetingScheduler() {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [meetingForm, setMeetingForm] = useState({
    name: "",
    email: "",
    company: "",
    meeting_type: "consultation",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    generateAvailableSlots()
    fetchMeetings()
  }, [])

  const generateAvailableSlots = () => {
    const slots: TimeSlot[] = []
    const today = new Date()

    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      // Generate time slots (9 AM to 5 PM)
      const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

      times.forEach((time) => {
        slots.push({
          id: `${date.toISOString().split("T")[0]}-${time}`,
          date: date.toISOString().split("T")[0],
          time,
          duration: 30,
          is_available: Math.random() > 0.3, // Simulate some booked slots
          meeting_type: "consultation",
        })
      })
    }

    setAvailableSlots(slots)
  }

  const fetchMeetings = async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (data) {
      setMeetings(data)
    }
  }

  const scheduleMeeting = async () => {
    if (!selectedSlot || !meetingForm.name || !meetingForm.email) return

    setIsSubmitting(true)

    const meetingData = {
      ...meetingForm,
      preferred_date: selectedSlot.date,
      preferred_time: selectedSlot.time,
      duration: selectedSlot.duration,
      status: "pending",
    }

    const { error } = await supabase.from("meetings").insert([meetingData])

    if (!error) {
      setShowSuccess(true)
      setMeetingForm({
        name: "",
        email: "",
        company: "",
        meeting_type: "consultation",
        message: "",
      })
      setSelectedSlot(null)
      fetchMeetings()

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }

    setIsSubmitting(false)
  }

  const meetingTypes = [
    { value: "consultation", label: "Free Consultation", duration: 30, description: "Discuss your project needs" },
    {
      value: "technical",
      label: "Technical Review",
      duration: 45,
      description: "Code review or architecture discussion",
    },
    {
      value: "collaboration",
      label: "Collaboration Call",
      duration: 60,
      description: "Explore partnership opportunities",
    },
    { value: "mentoring", label: "Mentoring Session", duration: 60, description: "Career guidance and advice" },
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Meeting Scheduler</h1>
          <p className="text-muted-foreground">Book a time to connect and discuss opportunities</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Meeting Request Sent!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for scheduling a meeting. You'll receive a confirmation email shortly with the meeting details.
            </p>
            <Button onClick={() => setShowSuccess(false)} variant="outline">
              Schedule Another Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Meeting Scheduler</h1>
        <p className="text-muted-foreground">Book a time to connect and discuss opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Select Meeting Type
            </CardTitle>
            <CardDescription>Choose the type of meeting that best fits your needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {meetingTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => setMeetingForm((prev) => ({ ...prev, meeting_type: type.value }))}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  meetingForm.meeting_type === type.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{type.label}</h4>
                  <Badge variant="outline">{type.duration} min</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Time Slots
            </CardTitle>
            <CardDescription>Select your preferred date and time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(
                availableSlots
                  .filter((slot) => slot.is_available)
                  .reduce(
                    (acc, slot) => {
                      const date = slot.date
                      if (!acc[date]) acc[date] = []
                      acc[date].push(slot)
                      return acc
                    },
                    {} as Record<string, TimeSlot[]>,
                  ),
              ).map(([date, slots]) => (
                <div key={date} className="space-y-2">
                  <h4 className="font-medium text-sm">{formatDate(date)}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        className="text-xs"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Meeting Details
            </CardTitle>
            <CardDescription>
              {formatDate(selectedSlot.date)} at {selectedSlot.time} ({selectedSlot.duration} minutes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={meetingForm.name}
                  onChange={(e) => setMeetingForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={meetingForm.email}
                  onChange={(e) => setMeetingForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company (optional)</Label>
              <Input
                id="company"
                value={meetingForm.company}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Your company name"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={meetingForm.message}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Tell me about your project or what you'd like to discuss..."
                rows={4}
              />
            </div>

            <Button
              onClick={scheduleMeeting}
              disabled={isSubmitting || !meetingForm.name || !meetingForm.email}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </CardContent>
        </Card>
      )}

      {meetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Meeting Requests</CardTitle>
            <CardDescription>Latest scheduling activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meetings.slice(0, 3).map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{meeting.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.meeting_type} • {formatDate(meeting.preferred_date)} at {meeting.preferred_time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      meeting.status === "confirmed"
                        ? "default"
                        : meeting.status === "completed"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {meeting.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
