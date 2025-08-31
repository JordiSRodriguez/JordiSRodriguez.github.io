"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createBrowserClient } from "@supabase/ssr";
import { Table, Loader, RefreshCw, Database, AlertCircle } from "lucide-react";

const TABLES = [
  { name: "profiles", description: "Información del perfil" },
  { name: "projects", description: "Proyectos del portfolio" },
  { name: "work_experiences", description: "Experiencias laborales" },
  { name: "education", description: "Formación académica" },
  { name: "skills", description: "Habilidades técnicas" },
  { name: "portfolio_likes", description: "Likes del portfolio" },
  { name: "contacts", description: "Mensajes de contacto" },
  { name: "visit_stats", description: "Estadísticas de visitas" },
  { name: "visitor_feedback", description: "Feedback de visitantes" },
];

export function SupabaseTableViewer() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadTableData = async (tableName: string) => {
    if (!tableName) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Loading data from table: ${tableName}`);

      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(`❌ Error loading ${tableName}:`, error);
        setError(error.message);
        setTableData([]);
        setTotalCount(0);
      } else {
        console.log(`✅ Loaded ${data?.length || 0} records from ${tableName}`);
        setTableData(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error(`💥 Exception loading ${tableName}:`, err);
      setError(err instanceof Error ? err.message : String(err));
      setTableData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    loadTableData(tableName);
  };

  const refreshData = () => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table selector */}
      <div className="flex items-center gap-2">
        <Select value={selectedTable} onValueChange={handleTableSelect}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600">
            <SelectValue placeholder="Selecciona una tabla para explorar" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {TABLES.map((table) => (
              <SelectItem
                key={table.name}
                value={table.name}
                className="text-white hover:bg-slate-700"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{table.name}</span>
                  <span className="text-xs text-slate-400">
                    {table.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTable && (
          <Button
            onClick={refreshData}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>

      {/* Table info */}
      {selectedTable && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            <Database className="h-3 w-3 mr-1" />
            {selectedTable}
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Table className="h-3 w-3 mr-1" />
            {totalCount} registros total
          </Badge>
          {tableData.length > 0 && totalCount > tableData.length && (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-400"
            >
              Mostrando {tableData.length} de {totalCount}
            </Badge>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-purple-400" />
          <span className="ml-2 text-slate-400">Cargando datos...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Error al cargar la tabla</span>
            </div>
            <p className="text-sm text-red-300 mt-2">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Table data */}
      {!loading && !error && tableData.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Datos de la tabla: {selectedTable}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96">
              <pre className="text-xs text-green-400 bg-slate-900 p-3 rounded">
                {JSON.stringify(tableData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && !error && selectedTable && tableData.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center text-slate-400">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                La tabla <strong>{selectedTable}</strong> está vacía
              </p>
              <p className="text-sm mt-1">No hay registros para mostrar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
