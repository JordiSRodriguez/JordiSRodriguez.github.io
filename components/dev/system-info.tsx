"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive,
  Clock,
  Eye,
  Copy,
  Check,
} from "lucide-react";

interface SystemInfoData {
  browser: {
    name: string;
    version: string;
    userAgent: string;
  };
  device: {
    type: string;
    platform: string;
    screen: string;
    viewport: string;
  };
  network: {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
  };
  performance: {
    memory?: number;
    timing: {
      domContentLoaded: number;
      loadComplete: number;
    };
  };
  environment: {
    nodeEnv: string;
    supabaseUrl: string;
    hasSupabaseKey: boolean;
  };
}

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfoData | null>(null);
  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    const collectSystemInfo = (): SystemInfoData => {
      // Browser info
      const browserInfo = {
        name: navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : navigator.userAgent.includes("Firefox")
          ? "Firefox"
          : navigator.userAgent.includes("Safari")
          ? "Safari"
          : "Unknown",
        version:
          navigator.userAgent.match(/(?:Chrome|Firefox|Safari)\/(\d+)/)?.[1] ||
          "Unknown",
        userAgent: navigator.userAgent,
      };

      // Device info
      const deviceInfo = {
        type: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      };

      // Network info
      const networkInfo = {
        online: navigator.onLine,
        effectiveType: (navigator as any).connection?.effectiveType,
        downlink: (navigator as any).connection?.downlink,
      };

      // Performance info
      const performanceInfo = {
        memory: (performance as any).memory?.usedJSHeapSize,
        timing: {
          domContentLoaded:
            performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart,
          loadComplete:
            performance.timing.loadEventEnd -
            performance.timing.navigationStart,
        },
      };

      // Environment info
      const environmentInfo = {
        nodeEnv: process.env.NODE_ENV || "unknown",
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "not set",
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };

      return {
        browser: browserInfo,
        device: deviceInfo,
        network: networkInfo,
        performance: performanceInfo,
        environment: environmentInfo,
      };
    };

    setSystemInfo(collectSystemInfo());
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!systemInfo) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-400">
          Recopilando información del sistema...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Browser Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Globe className="h-4 w-4 text-blue-400" />
            Navegador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Nombre:</span>
              <div className="text-white">{systemInfo.browser.name}</div>
            </div>
            <div>
              <span className="text-slate-400">Versión:</span>
              <div className="text-white">{systemInfo.browser.version}</div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">User Agent:</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(systemInfo.browser.userAgent, "userAgent")
                }
                className="h-6 w-6 p-0"
              >
                {copied === "userAgent" ? (
                  <Check className="h-3 w-3 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="text-xs text-white bg-slate-900 p-2 rounded mt-1 break-all">
              {systemInfo.browser.userAgent}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            {systemInfo.device.type === "Mobile" ? (
              <Smartphone className="h-4 w-4 text-green-400" />
            ) : (
              <Monitor className="h-4 w-4 text-purple-400" />
            )}
            Dispositivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Tipo:</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`border-${
                    systemInfo.device.type === "Mobile" ? "green" : "purple"
                  }-500 text-${
                    systemInfo.device.type === "Mobile" ? "green" : "purple"
                  }-400`}
                >
                  {systemInfo.device.type}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-slate-400">Plataforma:</span>
              <div className="text-white">{systemInfo.device.platform}</div>
            </div>
            <div>
              <span className="text-slate-400">Pantalla:</span>
              <div className="text-white">{systemInfo.device.screen}</div>
            </div>
            <div>
              <span className="text-slate-400">Viewport:</span>
              <div className="text-white">{systemInfo.device.viewport}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Wifi
              className={`h-4 w-4 ${
                systemInfo.network.online ? "text-green-400" : "text-red-400"
              }`}
            />
            Red
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Estado:</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`border-${
                    systemInfo.network.online ? "green" : "red"
                  }-500 text-${
                    systemInfo.network.online ? "green" : "red"
                  }-400`}
                >
                  {systemInfo.network.online ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
            </div>
            {systemInfo.network.effectiveType && (
              <div>
                <span className="text-slate-400">Tipo de conexión:</span>
                <div className="text-white">
                  {systemInfo.network.effectiveType}
                </div>
              </div>
            )}
            {systemInfo.network.downlink && (
              <div>
                <span className="text-slate-400">Velocidad:</span>
                <div className="text-white">
                  {systemInfo.network.downlink} Mbps
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <HardDrive className="h-4 w-4 text-yellow-400" />
            Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {systemInfo.performance.memory && (
              <div>
                <span className="text-slate-400">Memoria JS usada:</span>
                <div className="text-white">
                  {formatBytes(systemInfo.performance.memory)}
                </div>
              </div>
            )}
            <div>
              <span className="text-slate-400">DOM Ready:</span>
              <div className="text-white">
                {systemInfo.performance.timing.domContentLoaded}ms
              </div>
            </div>
            <div>
              <span className="text-slate-400">Load Complete:</span>
              <div className="text-white">
                {systemInfo.performance.timing.loadComplete}ms
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Eye className="h-4 w-4 text-indigo-400" />
            Entorno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">NODE_ENV:</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`border-${
                      systemInfo.environment.nodeEnv === "development"
                        ? "green"
                        : "blue"
                    }-500 text-${
                      systemInfo.environment.nodeEnv === "development"
                        ? "green"
                        : "blue"
                    }-400`}
                  >
                    {systemInfo.environment.nodeEnv}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-slate-400">Supabase Key:</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`border-${
                      systemInfo.environment.hasSupabaseKey ? "green" : "red"
                    }-500 text-${
                      systemInfo.environment.hasSupabaseKey ? "green" : "red"
                    }-400`}
                  >
                    {systemInfo.environment.hasSupabaseKey
                      ? "Configurada"
                      : "Faltante"}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Supabase URL:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(
                      systemInfo.environment.supabaseUrl,
                      "supabaseUrl"
                    )
                  }
                  className="h-6 w-6 p-0"
                >
                  {copied === "supabaseUrl" ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <div className="text-xs text-white bg-slate-900 p-2 rounded mt-1 break-all">
                {systemInfo.environment.supabaseUrl}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
