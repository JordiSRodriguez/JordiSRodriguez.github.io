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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Database,
  Users,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  MessageSquare,
  BarChart3,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableConfig {
  name: string;
  displayName: string;
  description: string;
  icon: any;
  columns: {
    name: string;
    label: string;
    type: "text" | "textarea" | "date" | "boolean" | "array" | "url";
    required?: boolean;
  }[];
}

const TABLES: TableConfig[] = [
  {
    name: "profiles",
    displayName: "Perfiles",
    description: "Información personal del portfolio",
    icon: <Users className="h-4 w-4 text-blue-400" />,
    columns: [
      { name: "full_name", label: "Nombre", type: "text", required: true },
      { name: "bio", label: "Biografía", type: "textarea" },
      { name: "avatar_url", label: "Avatar URL", type: "url" },
      { name: "github_username", label: "GitHub", type: "text" },
      { name: "linkedin_url", label: "LinkedIn", type: "url" },
      { name: "twitter_url", label: "Twitter", type: "url" },
      { name: "website_url", label: "Website", type: "url" },
      { name: "location", label: "Ubicación", type: "text" },
      { name: "roles", label: "Roles", type: "array" },
      { name: "initials", label: "Iniciales", type: "text" },
    ],
  },
  {
    name: "projects",
    displayName: "Proyectos",
    description: "Gestión de proyectos del portfolio",
    icon: <Code className="h-4 w-4 text-green-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      {
        name: "description",
        label: "Descripción",
        type: "textarea",
        required: true,
      },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "demo_url", label: "Demo URL", type: "url" },
      { name: "image_url", label: "Imagen URL", type: "url" },
      { name: "technologies", label: "Tecnologías", type: "array" },
      { name: "featured", label: "Destacado", type: "boolean" },
      { name: "status", label: "Estado", type: "text" },
      { name: "start_date", label: "Fecha inicio", type: "date" },
      { name: "end_date", label: "Fecha fin", type: "date" },
    ],
  },
  {
    name: "work_experiences",
    displayName: "Experiencia Laboral",
    description: "Experiencias laborales",
    icon: <Briefcase className="h-4 w-4 text-purple-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "company", label: "Empresa", type: "text", required: true },
      { name: "position", label: "Posición", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "location", label: "Ubicación", type: "text" },
      { name: "company_url", label: "URL Empresa", type: "url" },
      { name: "logo_url", label: "Logo URL", type: "url" },
      { name: "technologies", label: "Tecnologías", type: "array" },
      { name: "start_date", label: "Fecha inicio", type: "date" },
      { name: "end_date", label: "Fecha fin", type: "date" },
      { name: "current_job", label: "Trabajo actual", type: "boolean" },
    ],
  },
  {
    name: "experiences",
    displayName: "Experiencias",
    description: "Experiencias generales (educación, cursos, etc.)",
    icon: <GraduationCap className="h-4 w-4 text-yellow-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "company", label: "Institución", type: "text", required: true },
      { name: "location", label: "Ubicación", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "type", label: "Tipo", type: "text" },
      { name: "start_date", label: "Fecha inicio", type: "date" },
      { name: "end_date", label: "Fecha fin", type: "date" },
      { name: "is_current", label: "Actual", type: "boolean" },
    ],
  },
  {
    name: "skills",
    displayName: "Habilidades",
    description: "Habilidades técnicas y niveles",
    icon: <Code className="h-4 w-4 text-cyan-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "category", label: "Categoría", type: "text", required: true },
      { name: "level", label: "Nivel (1-5)", type: "text" },
      { name: "icon", label: "Icono", type: "text" },
      { name: "color", label: "Color", type: "text" },
      { name: "years_experience", label: "Años experiencia", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "featured", label: "Destacado", type: "boolean" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "interests",
    displayName: "Intereses",
    description: "Intereses personales",
    icon: <Heart className="h-4 w-4 text-pink-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "icon", label: "Icono", type: "text" },
      { name: "color", label: "Color", type: "text" },
      { name: "category", label: "Categoría", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "fun_facts",
    displayName: "Datos Curiosos",
    description: "Datos curiosos y estadísticas personales",
    icon: <BarChart3 className="h-4 w-4 text-orange-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "icon", label: "Icono", type: "text" },
      { name: "color", label: "Color", type: "text" },
      { name: "value", label: "Valor", type: "text" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "certifications",
    displayName: "Certificaciones",
    description: "Certificaciones profesionales",
    icon: <GraduationCap className="h-4 w-4 text-indigo-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "issuer", label: "Emisor", type: "text", required: true },
      { name: "date", label: "Fecha", type: "date" },
      { name: "credential_id", label: "ID Credencial", type: "text" },
      { name: "icon", label: "Icono", type: "text" },
      { name: "color", label: "Color", type: "text" },
      { name: "verification_url", label: "URL Verificación", type: "url" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "courses",
    displayName: "Cursos",
    description: "Cursos online y formación complementaria",
    icon: <GraduationCap className="h-4 w-4 text-teal-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "provider", label: "Proveedor", type: "text", required: true },
      { name: "duration", label: "Duración", type: "text" },
      { name: "status", label: "Estado", type: "text" },
      { name: "grade", label: "Calificación", type: "text" },
      { name: "completion_date", label: "Fecha finalización", type: "date" },
      { name: "start_date", label: "Fecha inicio", type: "date" },
      { name: "course_url", label: "URL Curso", type: "url" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "learning_goals",
    displayName: "Objetivos de Aprendizaje",
    description: "Objetivos de aprendizaje y metas profesionales",
    icon: <BarChart3 className="h-4 w-4 text-emerald-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "category", label: "Categoría", type: "text", required: true },
      { name: "color", label: "Color", type: "text" },
      { name: "priority", label: "Prioridad (1-5)", type: "text" },
      { name: "target_date", label: "Fecha objetivo", type: "date" },
      { name: "is_completed", label: "Completado", type: "boolean" },
      { name: "progress", label: "Progreso (0-100)", type: "text" },
      { name: "display_order", label: "Orden", type: "text" },
    ],
  },
  {
    name: "blog_posts",
    displayName: "Posts del Blog",
    description: "Posts del blog",
    icon: <MessageSquare className="h-4 w-4 text-blue-400" />,
    columns: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Extracto", type: "textarea" },
      { name: "content", label: "Contenido", type: "textarea" },
      { name: "tags", label: "Tags", type: "array" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "featured_image", label: "Imagen destacada", type: "url" },
      { name: "reading_time", label: "Tiempo lectura", type: "text" },
      { name: "views", label: "Visualizaciones", type: "text" },
      { name: "published_at", label: "Fecha publicación", type: "date" },
    ],
  },
  {
    name: "meetings",
    displayName: "Reuniones",
    description: "Sistema de agendamiento de reuniones",
    icon: <Phone className="h-4 w-4 text-red-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "company", label: "Empresa", type: "text" },
      { name: "meeting_type", label: "Tipo reunión", type: "text" },
      {
        name: "preferred_date",
        label: "Fecha preferida",
        type: "date",
        required: true,
      },
      {
        name: "preferred_time",
        label: "Hora preferida",
        type: "text",
        required: true,
      },
      { name: "duration", label: "Duración", type: "text" },
      { name: "message", label: "Mensaje", type: "textarea" },
      { name: "status", label: "Estado", type: "text" },
    ],
  },
  {
    name: "contacts",
    displayName: "Contactos",
    description: "Mensajes de contacto del formulario",
    icon: <MessageSquare className="h-4 w-4 text-green-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "subject", label: "Asunto", type: "text", required: true },
      { name: "message", label: "Mensaje", type: "textarea", required: true },
      { name: "status", label: "Estado", type: "text" },
    ],
  },
  {
    name: "visitor_feedback",
    displayName: "Feedback Visitantes",
    description: "Feedback y comentarios de visitantes",
    icon: <MessageSquare className="h-4 w-4 text-purple-400" />,
    columns: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "rating", label: "Calificación (1-5)", type: "text" },
      { name: "message", label: "Mensaje", type: "textarea", required: true },
      { name: "type", label: "Tipo", type: "text" },
      { name: "is_public", label: "Público", type: "boolean" },
    ],
  },
  {
    name: "portfolio_likes",
    displayName: "Likes del Portfolio",
    description: "Sistema de likes del portfolio (tiempo real)",
    icon: <Heart className="h-4 w-4 text-red-400" />,
    columns: [
      {
        name: "visitor_id",
        label: "ID Visitante",
        type: "text",
        required: true,
      },
    ],
  },
  {
    name: "visit_stats",
    displayName: "Estadísticas de Visitas",
    description: "Estadísticas de visitas",
    icon: <BarChart3 className="h-4 w-4 text-slate-400" />,
    columns: [
      {
        name: "visitor_id",
        label: "ID Visitante",
        type: "text",
        required: true,
      },
      { name: "page_url", label: "URL Página", type: "text" },
      { name: "referrer", label: "Referrer", type: "text" },
      { name: "country", label: "País", type: "text" },
      { name: "city", label: "Ciudad", type: "text" },
      { name: "device_type", label: "Tipo dispositivo", type: "text" },
      { name: "browser", label: "Navegador", type: "text" },
      { name: "os", label: "Sistema operativo", type: "text" },
    ],
  },
];

export function DataManagement() {
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

  const currentTableConfig = TABLES.find(
    (table) => table.name === selectedTable
  );

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tableData, error } = await supabase
        .from(selectedTable)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(tableData || []);
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
      const dataToSubmit = { ...formData };

      // Convert arrays
      currentTableConfig?.columns.forEach((col) => {
        if (
          col.type === "array" &&
          typeof dataToSubmit[col.name] === "string"
        ) {
          dataToSubmit[col.name] = dataToSubmit[col.name]
            .split(",")
            .map((item: string) => item.trim())
            .filter((item: string) => item);
        }
      });

      let result;
      if (editingItem) {
        result = await supabase
          .from(selectedTable)
          .update(dataToSubmit)
          .eq("id", editingItem.id);
      } else {
        result = await supabase.from(selectedTable).insert([dataToSubmit]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Éxito",
        description: editingItem ? "Elemento actualizado" : "Elemento creado",
      });

      setIsDialogOpen(false);
      setFormData({});
      setEditingItem(null);
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

    // Convert arrays to strings
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

  const renderCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "array":
        return Array.isArray(value) ? value.join(", ") : value.toString();
      case "boolean":
        return value ? "Sí" : "No";
      case "date":
        return value ? new Date(value).toLocaleDateString() : "-";
      case "url":
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Ver enlace
          </a>
        ) : (
          "-"
        );
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Selector */}
      <div className="flex items-center justify-between">
        <Select value={selectedTable} onValueChange={setSelectedTable}>
          <SelectTrigger className="w-64 bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Seleccionar tabla" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {TABLES.map((table) => (
              <SelectItem
                key={table.name}
                value={table.name}
                className="text-white hover:bg-slate-700"
              >
                <div className="flex items-center gap-2">
                  {table.icon}
                  <span>{table.displayName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={openCreateDialog}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      {/* Current Table Info */}
      {currentTableConfig && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentTableConfig.icon}
                <CardTitle className="text-white text-lg">
                  {currentTableConfig.displayName}
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                {data.length} registros
              </Badge>
            </div>
            <CardDescription className="text-slate-400">
              {currentTableConfig.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">Cargando datos...</div>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay datos</p>
                <p className="text-sm">Esta tabla está vacía</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table */}
                <div className="rounded-lg border border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        {currentTableConfig.columns.map((column) => (
                          <TableHead
                            key={column.name}
                            className="text-slate-300 bg-slate-800/50"
                          >
                            {column.label}
                          </TableHead>
                        ))}
                        <TableHead className="text-slate-300 bg-slate-800/50">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item, index) => (
                        <TableRow
                          key={item.id || index}
                          className="border-slate-700 hover:bg-slate-800/30"
                        >
                          {currentTableConfig.columns.map((column) => (
                            <TableCell
                              key={column.name}
                              className="text-slate-300"
                            >
                              {renderCellValue(item[column.name], column.type)}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(item)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar" : "Crear"}{" "}
              {currentTableConfig?.displayName}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingItem ? "Modifica" : "Completa"} los campos para{" "}
              {editingItem ? "actualizar" : "crear"} el elemento.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentTableConfig?.columns.map((column) => (
              <div key={column.name} className="space-y-2">
                <Label htmlFor={column.name} className="text-slate-300">
                  {column.label}{" "}
                  {column.required && <span className="text-red-400">*</span>}
                </Label>
                {column.type === "textarea" ? (
                  <Textarea
                    id={column.name}
                    value={formData[column.name] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [column.name]: e.target.value,
                      })
                    }
                    required={column.required}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                ) : (
                  <Input
                    id={column.name}
                    type={
                      column.type === "date"
                        ? "date"
                        : column.type === "url"
                        ? "url"
                        : "text"
                    }
                    value={formData[column.name] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [column.name]: e.target.value,
                      })
                    }
                    required={column.required}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder={
                      column.type === "array" ? "Separa con comas" : ""
                    }
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
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
