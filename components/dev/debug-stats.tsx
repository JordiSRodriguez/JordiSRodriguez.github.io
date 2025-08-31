"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bug,
  Database,
  Users,
  Heart,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface DatabaseStats {
  profiles: number;
  projects: number;
  work_experiences: number;
  education: number;
  skills: number;
  portfolio_likes: number;
  visit_stats: number;
  contacts: number;
  visitor_feedback: number;
  lastUpdated: string;
}

interface DatabaseTest {
  table: string;
  status: "success" | "error" | "loading";
  count: number;
  error?: string;
  responseTime: number;
}

export function DebugStats() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [tests, setTests] = useState<DatabaseTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const runDatabaseTests = async () => {
    setIsLoading(true);
    const testTables = [
      "profiles",
      "projects",
      "work_experiences",
      "education",
      "skills",
      "portfolio_likes",
      "visit_stats",
      "contacts",
      "visitor_feedback",
    ];

    const testResults: DatabaseTest[] = [];
    const statsData: Record<string, number> = {};

    for (const table of testTables) {
      const startTime = performance.now();
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (error) {
          testResults.push({
            table,
            status: "error",
            count: 0,
            error: error.message,
            responseTime,
          });
          statsData[table] = 0;
        } else {
          const count = data?.length || 0;
          testResults.push({
            table,
            status: "success",
            count,
            responseTime,
          });
          statsData[table] = count;
        }
      } catch (err) {
        const endTime = performance.now();
        testResults.push({
          table,
          status: "error",
          count: 0,
          error: err instanceof Error ? err.message : "Error desconocido",
          responseTime: endTime - startTime,
        });
        statsData[table] = 0;
      }
    }

    setTests(testResults);
    setStats({
      profiles: statsData.profiles || 0,
      projects: statsData.projects || 0,
      work_experiences: statsData.work_experiences || 0,
      education: statsData.education || 0,
      skills: statsData.skills || 0,
      portfolio_likes: statsData.portfolio_likes || 0,
      visit_stats: statsData.visit_stats || 0,
      contacts: statsData.contacts || 0,
      visitor_feedback: statsData.visitor_feedback || 0,
      lastUpdated: new Date().toLocaleTimeString(),
    });
    setIsLoading(false);
  };

  useEffect(() => {
    runDatabaseTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "loading":
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Bug className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-500 text-green-400";
      case "error":
        return "border-red-500 text-red-400";
      case "loading":
        return "border-blue-500 text-blue-400";
      default:
        return "border-slate-500 text-slate-400";
    }
  };

  const getTotalRecords = () => {
    if (!stats) return 0;
    return Object.values(stats).reduce((total, value) => {
      return typeof value === "number" ? total + value : total;
    }, 0);
  };

  const getTableDisplayName = (table: string) => {
    const names: Record<string, string> = {
      profiles: "Perfiles",
      projects: "Proyectos",
      work_experiences: "Experiencias",
      education: "Educación",
      skills: "Habilidades",
      portfolio_likes: "Likes",
      visit_stats: "Visitas",
      contacts: "Contactos",
      visitor_feedback: "Feedback",
    };
    return names[table] || table;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Debug de Base de Datos
        </h3>
        <Button
          onClick={runDatabaseTests}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Probar conexión
        </Button>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Total registros</p>
                  <p className="text-lg font-semibold text-white">
                    {getTotalRecords()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Proyectos</p>
                  <p className="text-lg font-semibold text-white">
                    {stats.projects || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-400" />
                <div>
                  <p className="text-xs text-slate-400">Likes</p>
                  <p className="text-lg font-semibold text-white">
                    {stats.portfolio_likes || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="text-xs text-slate-400">Actualizado</p>
                  <p className="text-xs font-semibold text-white">
                    {stats.lastUpdated}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Database Tests */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Bug className="h-4 w-4 text-orange-400" />
            Tests de Conectividad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="text-white text-sm font-medium">
                      {getTableDisplayName(test.table)}
                    </div>
                    {test.error && (
                      <div className="text-red-400 text-xs">{test.error}</div>
                    )}
                    <div className="text-slate-400 text-xs">
                      Respuesta: {test.responseTime.toFixed(1)}ms
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(test.status)}
                  >
                    {test.count} registros
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Structure Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Database className="h-4 w-4 text-purple-400" />
            Estructura de la Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300 space-y-2">
            <p>
              <strong>Esquema principal:</strong> Portfolio con autenticación
            </p>
            <p>
              <strong>Motor:</strong> PostgreSQL + Supabase
            </p>
            <p>
              <strong>Seguridad:</strong> Row Level Security (RLS) habilitado
            </p>
            <p>
              <strong>Tiempo real:</strong> Subscripciones activas en
              portfolio_likes
            </p>
            <p>
              <strong>Políticas:</strong> Lectura pública, escritura restringida
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
