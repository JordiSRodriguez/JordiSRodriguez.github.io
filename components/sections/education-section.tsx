"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@supabase/ssr";
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  ExternalLink,
  Star,
  Trophy,
  Briefcase as Certificate,
} from "lucide-react";

interface Education {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  type: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential_id: string | null;
  icon: string;
  color: string;
  verification_url: string | null;
  display_order: number;
}

interface Course {
  id: string;
  name: string;
  provider: string;
  duration: string;
  status: string;
  grade: string | null;
  completion_date: string | null;
  start_date: string | null;
  course_url: string | null;
  display_order: number;
}

interface LearningGoal {
  id: string;
  title: string;
  category: string;
  color: string;
  priority: number;
  target_date: string | null;
  is_completed: boolean;
  progress: number;
  display_order: number;
}

// Icon mapping for certifications
const iconMap = {
  Award,
  Certificate,
  Star,
  Trophy,
};

export function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        educationData,
        certificationsData,
        coursesData,
        learningGoalsData,
      ] = await Promise.all([
        fetchEducation(),
        fetchCertifications(),
        fetchCourses(),
        fetchLearningGoals(),
      ]);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("type", "education")
      .order("start_date", { ascending: false });

    if (error) throw error;
    setEducation(data || []);
    return data;
  };

  const fetchCertifications = async () => {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    setCertifications(data || []);
    return data;
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    setCourses(data || []);
    return data;
  };

  const fetchLearningGoals = async () => {
    const { data, error } = await supabase
      .from("learning_goals")
      .select("*")
      .order("category", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) throw error;
    setLearningGoals(data || []);
    return data;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white">
          <GraduationCap className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Educación y Formación
          </h1>
          <p className="text-muted-foreground mt-2">
            Mi trayectoria académica y desarrollo profesional continuo
          </p>
        </div>
      </div>

      {/* Formal Education */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-orange-500" />
            Educación Formal
          </h2>

          {education.length > 0 ? (
            <div className="space-y-6">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="relative pl-8 pb-6 border-l-2 border-orange-200 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-500 rounded-full border-4 border-background" />

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{edu.title}</h3>
                      <p className="text-lg text-orange-600 font-medium">
                        {edu.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(edu.start_date)} -{" "}
                          {edu.is_current
                            ? "Presente"
                            : edu.end_date
                            ? formatDate(edu.end_date)
                            : "Presente"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{edu.location}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Información educativa próximamente...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-orange-500" />
            Certificaciones Profesionales
          </h2>

          {certifications.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert) => {
                const Icon =
                  iconMap[cert.icon as keyof typeof iconMap] || Award;
                return (
                  <div
                    key={cert.credential_id || cert.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`h-6 w-6 ${cert.color} group-hover:scale-110 transition-transform`}
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{cert.date}</Badge>
                          {cert.verification_url && (
                            <a
                              href={cert.verification_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group-hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            </a>
                          )}
                        </div>
                        {cert.credential_id && (
                          <p className="text-xs text-muted-foreground">
                            ID: {cert.credential_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay certificaciones disponibles en este momento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Online Courses */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Cursos y Formación Continua
          </h2>

          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{course.name}</h3>
                    <Badge
                      variant={
                        course.status === "Completado" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                    <span>{course.provider}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                    {course.grade && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">
                          Calificación: {course.grade}
                        </span>
                      </>
                    )}
                  </div>

                  {course.course_url && (
                    <div className="mt-2">
                      <a
                        href={course.course_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        Ver curso <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay cursos disponibles en este momento.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Objetivos de Aprendizaje {new Date().getFullYear()}
          </h2>

          {learningGoals.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Group learning goals by category */}
              {["Tecnologías", "Certificaciones"].map((category) => {
                const categoryGoals = learningGoals.filter(
                  (goal) => goal.category === category
                );

                if (categoryGoals.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <ul className="space-y-2">
                      {categoryGoals.map((goal) => (
                        <li key={goal.id} className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${goal.color.replace(
                              "bg-",
                              "bg-"
                            )}`}
                          />
                          <span
                            className={
                              goal.is_completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {goal.title}
                          </span>
                          {goal.progress > 0 && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {goal.progress}%
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No hay objetivos de aprendizaje configurados en este momento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
