"use client";

import type React from "react";

import { useState, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { EmbeddedMeetingScheduler } from "@/components/embedded-meeting-scheduler";
import logger from "@/lib/logger";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  MessageCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  github_username?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  location?: string;
  roles?: string[];
  initials?: string;
}

export const ContactSection = memo(function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"contact" | "meeting">("contact");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const supabase = createClient();

  // Get profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .limit(1);

        if (error) throw error;
        setProfile(data && data.length > 0 ? data[0] : null);
      } catch (error) {
        logger.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: "new",
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      logger.error("Error sending message:", error);
      setError("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "jordisumba@gmail.com",
      href: "mailto:jordisumba@gmail.com",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: "+34 640 853 140",
      href: "tel:+34640853140",
      color: "text-green-500",
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: profile?.location || "Madrid, Spain",
      href: `https://maps.google.com/?q=${encodeURIComponent(
        profile?.location || "Madrid,Spain"
      )}`,
      color: "text-red-500",
    },
    {
      icon: Calendar,
      label: "Disponibilidad",
      value: "Lun - Vie, 9:00 - 18:00",
      color: "text-purple-500",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: profile?.github_username
        ? `https://github.com/${profile.github_username}`
        : "https://github.com/JordiSRodriguez",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile?.linkedin_url || "https://linkedin.com/in/jordi-sumba/",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: profile?.twitter_url || "https://x.com/iamnotjordi",
      color: "hover:text-blue-400",
    },
    {
      icon: MessageCircle,
      label: "Discord",
      href: "https://discord.com/users/jordix",
      color: "hover:text-indigo-500",
    },
  ];

  return (
    <div data-testid="contact-section" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white">
          <MessageSquare className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            Contacto
          </h1>
          <p className="text-muted-foreground mt-2">
            ¿Tienes un proyecto en mente? ¡Hablemos y hagámoslo realidad!
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === "contact" ? "default" : "ghost"}
            onClick={() => setActiveTab("contact")}
            className="rounded-md"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensaje Directo
          </Button>
          <Button
            variant={activeTab === "meeting" ? "default" : "ghost"}
            onClick={() => setActiveTab("meeting")}
            className="rounded-md"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Reunión
          </Button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "contact" ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Envíame un mensaje
              </h2>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Gracias por contactarme. Te responderé lo antes posible.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="outline">
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="¿De qué te gustaría hablar?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Cuéntame sobre tu proyecto o idea..."
                      rows={6}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar mensaje
                        <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-white">
                  Información de Contacto
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    return (
                      <a
                        key={info.label}
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <Icon
                          className={`h-5 w-5 ${info.color} group-hover:scale-110 transition-transform`}
                        />
                        <div>
                          <p className="font-medium">{info.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {info.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-white">
                  Sígueme en
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105 ${social.color}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  🟢 Disponible para proyectos
                </h3>
                <p className="opacity-90 mb-4">
                  Actualmente acepto nuevos proyectos freelance y
                  colaboraciones. ¡Hablemos sobre tu idea!
                </p>
                <div className="flex gap-2 text-sm opacity-75">
                  <span>• Respuesta en 24h</span>
                  <span>• Consulta gratuita</span>
                  <span>• Presupuesto sin compromiso</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <EmbeddedMeetingScheduler />
        </div>
      )}
    </div>
  );
});
