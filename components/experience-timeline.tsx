"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Calendar, MapPin, Building, GraduationCap, Code, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Experience {
  id: string
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  description: string
  type: "work" | "education" | "project"
  skills: string[]
  url?: string
}

export function ExperienceTimeline() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error } = await supabase.from("experiences").select("*").order("start_date", { ascending: false })

      if (error) {
        console.error("Error fetching experiences:", error)
      } else {
        setExperiences(data || [])
      }
      setLoading(false)
    }

    fetchExperiences()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "work":
        return <Building className="w-5 h-5" />
      case "education":
        return <GraduationCap className="w-5 h-5" />
      case "project":
        return <Code className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-blue-500"
      case "education":
        return "bg-green-500"
      case "project":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Experience & Education</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${getTypeColor(experience.type)} text-white shadow-lg`}
                >
                  {getTypeIcon(experience.type)}
                </div>

                {/* Content */}
                <Card className="flex-1 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{experience.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building className="w-4 h-4" />
                          <span>{experience.company}</span>
                          {experience.url && (
                            <a
                              href={experience.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(experience.start_date)} -{" "}
                              {experience.end_date ? formatDate(experience.end_date) : "Present"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {experience.type}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{experience.description}</p>

                    {experience.skills && experience.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
