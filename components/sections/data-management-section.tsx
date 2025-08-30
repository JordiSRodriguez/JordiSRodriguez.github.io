"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Database,
  Users,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  MessageSquare,
  ThumbsUp,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  columns: {
    name: string;
    type: string;
    required?: boolean;
    options?: string[];
  }[];
}

const tableConfigs: TableConfig[] = [
  {
    name: "profiles",
    icon: <Users className="w-4 h-4" />,
    description: "Información del propietario del portfolio",
    columns: [
      { name: "full_name", type: "text" },
      { name: "bio", type: "textarea" },
      { name: "avatar_url", type: "text" },
      { name: "github_username", type: "text" },
      { name: "linkedin_url", type: "text" },
      { name: "website_url", type: "text" },
      { name: "location", type: "text" },
    ],
  },
  {
    name: "projects",
    icon: <FolderOpen className="w-4 h-4" />,
    description: "Proyectos del portfolio",
    columns: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea", required: true },
      { name: "long_description", type: "textarea" },
      { name: "image_url", type: "text" },
      { name: "demo_url", type: "text" },
      { name: "github_url", type: "text" },
      { name: "technologies", type: "array" },
      { name: "featured", type: "boolean" },
      {
        name: "status",
        type: "select",
        options: ["completed", "in-progress", "planned"],
      },
    ],
  },
  {
    name: "work_experiences",
    icon: <Briefcase className="w-4 h-4" />,
    description: "Experiencias laborales",
    columns: [
      { name: "company", type: "text", required: true },
      { name: "position", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "technologies", type: "array" },
      { name: "start_date", type: "date", required: true },
      { name: "end_date", type: "date" },
      { name: "is_current", type: "boolean" },
      { name: "company_url", type: "text" },
      { name: "location", type: "text" },
    ],
  },
  {
    name: "skills",
    icon: <Code className="w-4 h-4" />,
    description: "Habilidades y tecnologías",
    columns: [
      { name: "name", type: "text", required: true },
      { name: "category", type: "text", required: true },
      { name: "proficiency_level", type: "number" },
      { name: "icon_url", type: "text" },
    ],
  },
  {
    name: "education",
    icon: <GraduationCap className="w-4 h-4" />,
    description: "Educación y formación",
    columns: [
      { name: "institution", type: "text", required: true },
      { name: "degree", type: "text", required: true },
      { name: "field_of_study", type: "text" },
      { name: "start_date", type: "date", required: true },
      { name: "end_date", type: "date" },
      { name: "is_current", type: "boolean" },
      { name: "description", type: "textarea" },
      { name: "gpa", type: "text" },
      { name: "location", type: "text" },
    ],
  },
  {
    name: "contacts",
    icon: <MessageSquare className="w-4 h-4" />,
    description: "Mensajes de contacto",
    columns: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "subject", type: "text" },
      { name: "message", type: "textarea", required: true },
    ],
  },
  {
    name: "visitor_feedback",
    icon: <ThumbsUp className="w-4 h-4" />,
    description: "Feedback de visitantes",
    columns: [
      { name: "name", type: "text" },
      { name: "email", type: "email" },
      { name: "feedback", type: "textarea", required: true },
      { name: "rating", type: "number" },
    ],
  },
  {
    name: "visit_stats",
    icon: <BarChart3 className="w-4 h-4" />,
    description: "Estadísticas de visitas",
    columns: [
      { name: "visitor_id", type: "text" },
      { name: "page_url", type: "text" },
      { name: "user_agent", type: "text" },
    ],
  },
];

export function DataManagementSection() {
  const [selectedTable, setSelectedTable] = useState("profiles");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const currentTableConfig = tableConfigs.find(
    (config) => config.name === selectedTable
  );

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from(selectedTable)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al cargar datos: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Procesar datos antes de enviar
      const processedData = { ...formData };

      // Convertir arrays de string separados por comas
      currentTableConfig?.columns.forEach((col) => {
        if (
          col.type === "array" &&
          typeof processedData[col.name] === "string"
        ) {
          processedData[col.name] = processedData[col.name]
            .split(",")
            .map((item: string) => item.trim())
            .filter((item: string) => item);
        }
      });

      if (editingItem) {
        // Actualizar
        const { error } = await supabase
          .from(selectedTable)
          .update(processedData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Elemento actualizado correctamente",
        });
      } else {
        // Crear
        const { error } = await supabase
          .from(selectedTable)
          .insert([processedData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Elemento creado correctamente",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al guardar: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?"))
      return;

    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Éxito",
        description: "Elemento eliminado correctamente",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al eliminar: ${error}`,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    const formDataCopy = { ...item };

    // Convertir arrays a strings para el formulario
    currentTableConfig?.columns.forEach((col) => {
      if (col.type === "array" && Array.isArray(formDataCopy[col.name])) {
        formDataCopy[col.name] = formDataCopy[col.name].join(", ");
      }
    });

    setFormData(formDataCopy);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const renderFormField = (column: any) => {
    const value = formData[column.name] || "";

    switch (column.type) {
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.name]: e.target.value })
            }
            placeholder={`Ingresa ${column.name}`}
          />
        );
      case "boolean":
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, [column.name]: checked })
            }
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [column.name]: parseInt(e.target.value) || 0,
              })
            }
            placeholder={`Ingresa ${column.name}`}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.name]: e.target.value })
            }
          />
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(selectedValue) =>
              setFormData({ ...formData, [column.name]: selectedValue })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecciona ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "array":
        return (
          <Input
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.name]: e.target.value })
            }
            placeholder={`Ingresa ${column.name} separados por comas`}
          />
        );
      default:
        return (
          <Input
            type={column.type === "email" ? "email" : "text"}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.name]: e.target.value })
            }
            placeholder={`Ingresa ${column.name}`}
          />
        );
    }
  };

  const renderCellValue = (value: any, column: any) => {
    if (value === null || value === undefined) return "-";

    switch (column.type) {
      case "boolean":
        return value ? "Sí" : "No";
      case "array":
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          "-"
        );
      case "textarea":
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      default:
        return value.toString();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <CardTitle>Gestión de Datos</CardTitle>
          </div>
          <CardDescription>
            Panel de administración para gestionar todos los datos de la base de
            datos (Solo visible en desarrollo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTable} onValueChange={setSelectedTable}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8">
              {tableConfigs.map((config) => (
                <TabsTrigger
                  key={config.name}
                  value={config.name}
                  className="flex items-center gap-1"
                >
                  {config.icon}
                  <span className="hidden sm:inline">
                    {config.name.replace("_", " ")}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tableConfigs.map((config) => (
              <TabsContent
                key={config.name}
                value={config.name}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {config.name.replace("_", " ")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                  <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {config.columns.slice(0, 4).map((column) => (
                          <TableHead key={column.name} className="capitalize">
                            {column.name.replace("_", " ")}
                          </TableHead>
                        ))}
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell
                            colSpan={config.columns.slice(0, 4).length + 1}
                            className="text-center py-8"
                          >
                            Cargando...
                          </TableCell>
                        </TableRow>
                      ) : data.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={config.columns.slice(0, 4).length + 1}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No hay datos disponibles
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((item) => (
                          <TableRow key={item.id}>
                            {config.columns.slice(0, 4).map((column) => (
                              <TableCell key={column.name}>
                                {renderCellValue(item[column.name], column)}
                              </TableCell>
                            ))}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar" : "Crear"}{" "}
              {selectedTable.replace("_", " ")}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Modifica los campos que desees actualizar"
                : "Completa los campos para crear un nuevo elemento"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentTableConfig?.columns.map((column) => (
              <div key={column.name} className="space-y-2">
                <Label htmlFor={column.name} className="capitalize">
                  {column.name.replace("_", " ")}
                  {column.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {renderFormField(column)}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : editingItem
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
