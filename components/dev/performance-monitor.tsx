"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Clock,
  Database,
  Gauge,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  timing: {
    navigationStart: number;
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  resources: {
    total: number;
    scripts: number;
    stylesheets: number;
    images: number;
    other: number;
  };
  network: {
    responseTime: number;
    transferSize: number;
    requests: number;
  };
  vitals: {
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay
    lcp: number; // Largest Contentful Paint
  };
}

interface PerformanceTest {
  name: string;
  duration: number;
  status: "success" | "warning" | "error";
  description: string;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const collectMetrics = (): PerformanceMetrics => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType("paint");
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    // Memory info
    const memoryInfo = (performance as any).memory || {};
    const memory = {
      used: memoryInfo.usedJSHeapSize || 0,
      total: memoryInfo.totalJSHeapSize || 0,
      percentage: memoryInfo.totalJSHeapSize
        ? Math.round(
            (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
          )
        : 0,
    };

    // Timing info
    const timing = {
      navigationStart: navigation?.startTime || 0,
      domContentLoaded: navigation
        ? navigation.domContentLoadedEventEnd - navigation.startTime
        : 0,
      loadComplete: navigation
        ? navigation.loadEventEnd - navigation.startTime
        : 0,
      firstPaint:
        paintEntries.find((entry) => entry.name === "first-paint")?.startTime ||
        0,
      firstContentfulPaint:
        paintEntries.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0,
    };

    // Resource info
    const resourceCounts = {
      total: resources.length,
      scripts: resources.filter(
        (r) => r.initiatorType === "script" || r.name?.includes(".js")
      ).length,
      stylesheets: resources.filter(
        (r) => r.initiatorType === "css" || r.name?.includes(".css")
      ).length,
      images: resources.filter(
        (r) =>
          r.initiatorType === "img" ||
          /\.(jpg|jpeg|png|gif|svg|webp)/.test(r.name || "")
      ).length,
      other: 0,
    };
    resourceCounts.other =
      resourceCounts.total -
      resourceCounts.scripts -
      resourceCounts.stylesheets -
      resourceCounts.images;

    // Network info
    const networkMetrics = {
      responseTime: navigation
        ? navigation.responseEnd - navigation.requestStart
        : 0,
      transferSize: resources.reduce(
        (total, resource) => total + (resource.transferSize || 0),
        0
      ),
      requests: resources.length,
    };

    // Web Vitals (simplified approximations)
    const vitals = {
      cls: 0, // Would need layout shift observer
      fid: 0, // Would need first input observer
      lcp: timing.firstContentfulPaint, // Approximation
    };

    return {
      memory,
      timing,
      resources: resourceCounts,
      network: networkMetrics,
      vitals,
    };
  };

  const runPerformanceTests = (): PerformanceTest[] => {
    const currentMetrics = collectMetrics();
    const testResults: PerformanceTest[] = [];

    // DOM Load Time Test
    testResults.push({
      name: "Carga del DOM",
      duration: currentMetrics.timing.domContentLoaded,
      status:
        currentMetrics.timing.domContentLoaded < 1500
          ? "success"
          : currentMetrics.timing.domContentLoaded < 3000
          ? "warning"
          : "error",
      description: "Tiempo hasta que el DOM esté completamente cargado",
    });

    // Page Load Time Test
    testResults.push({
      name: "Carga completa",
      duration: currentMetrics.timing.loadComplete,
      status:
        currentMetrics.timing.loadComplete < 3000
          ? "success"
          : currentMetrics.timing.loadComplete < 5000
          ? "warning"
          : "error",
      description: "Tiempo hasta que todos los recursos estén cargados",
    });

    // First Contentful Paint Test
    testResults.push({
      name: "Primera renderización",
      duration: currentMetrics.timing.firstContentfulPaint,
      status:
        currentMetrics.timing.firstContentfulPaint < 1000
          ? "success"
          : currentMetrics.timing.firstContentfulPaint < 2000
          ? "warning"
          : "error",
      description: "Tiempo hasta el primer contenido visible",
    });

    // Memory Usage Test
    testResults.push({
      name: "Uso de memoria",
      duration: currentMetrics.memory.percentage,
      status:
        currentMetrics.memory.percentage < 50
          ? "success"
          : currentMetrics.memory.percentage < 80
          ? "warning"
          : "error",
      description: "Porcentaje de memoria JavaScript utilizada",
    });

    // Resource Count Test
    testResults.push({
      name: "Recursos cargados",
      duration: currentMetrics.resources.total,
      status:
        currentMetrics.resources.total < 50
          ? "success"
          : currentMetrics.resources.total < 100
          ? "warning"
          : "error",
      description: "Número total de recursos HTTP solicitados",
    });

    return testResults;
  };

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Simular un pequeño delay para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMetrics(collectMetrics());
    setTests(runPerformanceTests());
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Carga inicial
    refreshMetrics();

    // Auto-refresh cada 10 segundos
    intervalRef.current = setInterval(() => {
      setMetrics(collectMetrics());
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-500 text-green-400";
      case "warning":
        return "border-yellow-500 text-yellow-400";
      case "error":
        return "border-red-500 text-red-400";
      default:
        return "border-slate-500 text-slate-400";
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">
          Recopilando métricas de rendimiento...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Monitor de Rendimiento
        </h3>
        <Button
          onClick={refreshMetrics}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Performance Tests */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Gauge className="h-4 w-4 text-blue-400" />
            Tests de Rendimiento
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
                      {test.name}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {test.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(test.status)}
                  >
                    {test.name === "Uso de memoria"
                      ? `${test.duration}%`
                      : `${test.duration.toFixed(0)}ms`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Activity className="h-4 w-4 text-purple-400" />
            Uso de Memoria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Memoria JS utilizada</span>
              <span className="text-white">
                {formatBytes(metrics.memory.used)} /{" "}
                {formatBytes(metrics.memory.total)}
              </span>
            </div>
            <Progress
              value={metrics.memory.percentage}
              className="h-2 bg-slate-700"
            />
            <div className="text-xs text-slate-400 text-center">
              {metrics.memory.percentage}% utilizada
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Clock className="h-4 w-4 text-yellow-400" />
            Métricas de Tiempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">DOM Ready:</span>
              <div className="text-white">
                {metrics.timing.domContentLoaded.toFixed(0)}ms
              </div>
            </div>
            <div>
              <span className="text-slate-400">Load Complete:</span>
              <div className="text-white">
                {metrics.timing.loadComplete.toFixed(0)}ms
              </div>
            </div>
            <div>
              <span className="text-slate-400">First Paint:</span>
              <div className="text-white">
                {metrics.timing.firstPaint.toFixed(0)}ms
              </div>
            </div>
            <div>
              <span className="text-slate-400">First Contentful Paint:</span>
              <div className="text-white">
                {metrics.timing.firstContentfulPaint.toFixed(0)}ms
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Database className="h-4 w-4 text-green-400" />
            Recursos Cargados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total:</span>
              <div className="text-white">{metrics.resources.total}</div>
            </div>
            <div>
              <span className="text-slate-400">Scripts:</span>
              <div className="text-white">{metrics.resources.scripts}</div>
            </div>
            <div>
              <span className="text-slate-400">Estilos:</span>
              <div className="text-white">{metrics.resources.stylesheets}</div>
            </div>
            <div>
              <span className="text-slate-400">Imágenes:</span>
              <div className="text-white">{metrics.resources.images}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            Estadísticas de Red
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Tiempo de respuesta:</span>
              <div className="text-white">
                {metrics.network.responseTime.toFixed(0)}ms
              </div>
            </div>
            <div>
              <span className="text-slate-400">Datos transferidos:</span>
              <div className="text-white">
                {formatBytes(metrics.network.transferSize)}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Solicitudes HTTP:</span>
              <div className="text-white">{metrics.network.requests}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
