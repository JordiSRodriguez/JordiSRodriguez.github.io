"use client";

import { useState, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Eye,
  Search,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useBlogPosts } from "@/hooks/use-supabase-data";

export const BlogSection = memo(function BlogSection() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blog y Artículos
          </h1>
          <p className="text-muted-foreground mt-2">
            Comparto conocimientos, experiencias e ideas sobre desarrollo web
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl line-clamp-2 group-hover:text-yellow-300 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.reading_time} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      Leer artículo
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedTag
                ? "Prueba con otros términos de búsqueda o filtros"
                : "Los artículos del blog aparecerán aquí pronto"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">¿Te gusta mi contenido?</h3>
          <p className="mb-4 opacity-90">
            Suscríbete para recibir notificaciones de nuevos artículos y
            recursos exclusivos
          </p>
          <Button variant="secondary" size="lg">
            Suscribirse al Newsletter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
