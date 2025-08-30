"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  is_available: boolean;
  meeting_type: string;
}

interface Meeting {
  id: string;
  name: string;
  email: string;
  company?: string;
  meeting_type: string;
  preferred_date: string;
  preferred_time: string;
  duration: number;
  message: string;
  status: "pending" | "confirmed" | "completed";
  created_at: string;
}

export function EmbeddedMeetingScheduler() {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    name: "",
    email: "",
    company: "",
    meeting_type: "consultation",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    generateAvailableSlots();
  }, []);

  const generateAvailableSlots = () => {
    const slots: TimeSlot[] = [];
    const today = new Date();

    // Generate slots for next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Generate time slots (9 AM to 5 PM)
      const times = ["09:00", "11:00", "14:00", "16:00"];

      times.forEach((time) => {
        slots.push({
          id: `${date.toISOString().split("T")[0]}-${time}`,
          date: date.toISOString().split("T")[0],
          time,
          duration: 30,
          is_available: Math.random() > 0.3, // Simulate some booked slots
          meeting_type: "consultation",
        });
      });
    }

    setAvailableSlots(slots);
  };

  const scheduleMeeting = async () => {
    if (!selectedSlot || !meetingForm.name || !meetingForm.email) return;

    setIsSubmitting(true);

    const meetingData = {
      ...meetingForm,
      preferred_date: selectedSlot.date,
      preferred_time: selectedSlot.time,
      duration: selectedSlot.duration,
      status: "pending",
    };

    const { error } = await supabase.from("meetings").insert([meetingData]);

    if (!error) {
      setShowSuccess(true);
      setMeetingForm({
        name: "",
        email: "",
        company: "",
        meeting_type: "consultation",
        message: "",
      });
      setSelectedSlot(null);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  const meetingTypes = [
    {
      value: "consultation",
      label: "Consulta Gratuita",
      duration: 30,
      description: "Discutir necesidades del proyecto",
    },
    {
      value: "technical",
      label: "Revisión Técnica",
      duration: 45,
      description: "Revisión de código o arquitectura",
    },
    {
      value: "collaboration",
      label: "Llamada de Colaboración",
      duration: 60,
      description: "Explorar oportunidades de partnership",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  if (showSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">¡Reunión agendada!</h3>
          <p className="text-muted-foreground mb-4">
            Gracias por agendar una reunión. Recibirás un email de confirmación
            con los detalles.
          </p>
          <Button onClick={() => setShowSuccess(false)} variant="outline">
            Agendar otra reunión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Meeting Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tipo de Reunión
          </CardTitle>
          <CardDescription>
            Elige el tipo de reunión que mejor se adapte a tus necesidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetingTypes.map((type) => (
            <div
              key={type.value}
              onClick={() =>
                setMeetingForm((prev) => ({
                  ...prev,
                  meeting_type: type.value,
                }))
              }
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                meetingForm.meeting_type === type.value
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-950"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{type.label}</h4>
                <Badge variant="outline" className="text-xs">
                  {type.duration} min
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {type.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horarios Disponibles
          </CardTitle>
          <CardDescription>
            Selecciona tu fecha y hora preferida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(
              availableSlots
                .filter((slot) => slot.is_available)
                .reduce((acc, slot) => {
                  const date = slot.date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(slot);
                  return acc;
                }, {} as Record<string, TimeSlot[]>)
            ).map(([date, slots]) => (
              <div key={date} className="space-y-2">
                <h4 className="font-medium text-sm capitalize">
                  {formatDate(date)}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedSlot?.id === slot.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedSlot(slot)}
                      className="text-xs h-8"
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

      {/* Meeting Details Form - Full width when slot is selected */}
      {selectedSlot && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Detalles de la Reunión
            </CardTitle>
            <CardDescription>
              {formatDate(selectedSlot.date)} a las {selectedSlot.time} (
              {selectedSlot.duration} minutos)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meeting-name">Nombre Completo *</Label>
                <Input
                  id="meeting-name"
                  value={meetingForm.name}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="meeting-email">Email *</Label>
                <Input
                  id="meeting-email"
                  type="email"
                  value={meetingForm.email}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="meeting-company">Empresa (opcional)</Label>
              <Input
                id="meeting-company"
                value={meetingForm.company}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div>
              <Label htmlFor="meeting-message">Mensaje</Label>
              <Textarea
                id="meeting-message"
                value={meetingForm.message}
                onChange={(e) =>
                  setMeetingForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Cuéntame sobre tu proyecto o de qué te gustaría hablar..."
                rows={3}
              />
            </div>

            <Button
              onClick={scheduleMeeting}
              disabled={isSubmitting || !meetingForm.name || !meetingForm.email}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isSubmitting ? "Agendando..." : "Agendar Reunión"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
