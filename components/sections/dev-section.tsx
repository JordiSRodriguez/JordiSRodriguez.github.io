"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bug,
  Database,
  Settings,
  Activity,
  Code,
  Server,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { DebugStats } from "@/components/dev/debug-stats";
import { SupabaseTableViewer } from "@/components/dev/supabase-table-viewer";
import { SystemInfo } from "@/components/dev/system-info";
import { PerformanceMonitor } from "@/components/dev/performance-monitor";
import { DataManagement } from "@/components/dev/data-management";

interface DevSectionProps {
  isVisible?: boolean;
}

export function DevSection({ isVisible = true }: DevSectionProps) {
  const [activeTab, setActiveTab] = useState("database");

  if (!isVisible || process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Code className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Panel de Desarrollo
              </h1>
              <p className="text-slate-400">
                Herramientas de debug y monitoreo para el portfolio
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex gap-4 flex-wrap">
            <Badge
              variant="outline"
              className="border-green-500 text-green-400"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Desarrollo Activo
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Server className="h-3 w-3 mr-1" />
              Next.js {process.env.NODE_ENV}
            </Badge>
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-400"
            >
              <Clock className="h-3 w-3 mr-1" />
              {new Date().toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger
              value="database"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Base de Datos
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Rendimiento
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger
              value="management"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Server className="h-4 w-4 mr-2" />
              Gestión
            </TabsTrigger>
            <TabsTrigger
              value="debug"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="h-5 w-5 text-blue-400" />
                    Estadísticas de Supabase
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Diagnóstico y pruebas de conexión con la base de datos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DebugStats />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Eye className="h-5 w-5 text-green-400" />
                    Visualizador de Tablas
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Explorar datos directamente desde las tablas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupabaseTableViewer />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Monitor de Rendimiento
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Métricas de rendimiento y tiempos de carga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-purple-400" />
                  Información del Sistema
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Variables de entorno y configuración del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemInfo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Server className="h-5 w-5 text-blue-400" />
                  Gestión de Datos
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Panel de administración para gestionar todos los datos de la
                  base de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debug" className="mt-6">
            <div className="grid gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bug className="h-5 w-5 text-red-400" />
                    Herramientas de Debug
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Utilidades para debugging y resolución de problemas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.clear()}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        Limpiar Consola
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        Recargar Página
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => localStorage.clear()}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        Limpiar LocalStorage
                      </Button>
                    </div>

                    <Separator className="bg-slate-700" />

                    <div className="text-sm text-slate-400">
                      <p className="mb-2">
                        📋 <strong>Consejos de Debug:</strong>
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • Abre la consola del navegador (F12) para ver logs
                          detallados
                        </li>
                        <li>
                          • Usa la pestaña "Base de Datos" para probar consultas
                          específicas
                        </li>
                        <li>
                          • Revisa la pestaña "Rendimiento" para detectar
                          cuellos de botella
                        </li>
                        <li>
                          • La pestaña "Sistema" muestra la configuración actual
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Esta sección solo es visible en modo desarrollo</span>
            </div>
            <div>Portfolio Debug Panel v1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
