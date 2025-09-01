"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MessageSquare, Heart, Send, Filter } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  type: "general" | "project" | "design" | "suggestion";
  created_at: string;
  is_public: boolean;
}

export function VisitorFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState<{
    name: string;
    email: string;
    rating: number;
    message: string;
    type: "general" | "project" | "design" | "suggestion";
    is_public: boolean;
  }>({
    name: "",
    email: "",
    rating: 5,
    message: "",
    type: "general",
    is_public: true,
  });
  const [filter, setFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from("visitor_feedback")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (data) {
      setFeedbacks(data);
    }
  };

  const submitFeedback = async () => {
    if (!newFeedback.name || !newFeedback.message) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("visitor_feedback")
      .insert([newFeedback]);

    if (!error) {
      setNewFeedback({
        name: "",
        email: "",
        rating: 5,
        message: "",
        type: "general",
        is_public: true,
      });
      fetchFeedbacks();
    }
    setIsSubmitting(false);
  };

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => filter === "all" || feedback.type === filter
  );

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Visitor Feedback</h1>
        <p className="text-muted-foreground">
          Share your thoughts and see what others are saying
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
                <div className="text-2xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{feedbacks.length}</div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <div className="text-2xl font-bold">
                  {feedbacks.filter((f) => f.rating >= 4).length}
                </div>
                <p className="text-sm text-muted-foreground">Happy Visitors</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leave Your Feedback</CardTitle>
              <CardDescription>
                Help improve this portfolio with your thoughts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newFeedback.name}
                    onChange={(e) =>
                      setNewFeedback((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newFeedback.email}
                    onChange={(e) =>
                      setNewFeedback((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setNewFeedback((prev) => ({ ...prev, rating: star }))
                      }
                      className={`w-8 h-8 ${
                        star <= newFeedback.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="type">Feedback Type</Label>
                <Select
                  value={newFeedback.type}
                  onValueChange={(value) =>
                    setNewFeedback((prev) => ({
                      ...prev,
                      type: value as
                        | "general"
                        | "project"
                        | "design"
                        | "suggestion",
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="project">About Projects</SelectItem>
                    <SelectItem value="design">Design & UX</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={newFeedback.message}
                  onChange={(e) =>
                    setNewFeedback((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Share your thoughts..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={newFeedback.is_public}
                  onChange={(e) =>
                    setNewFeedback((prev) => ({
                      ...prev,
                      is_public: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="public">Make this feedback public</Label>
              </div>

              <Button
                onClick={submitFeedback}
                disabled={isSubmitting}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Community Feedback */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Community Feedback</CardTitle>
                  <CardDescription className="text-sm">
                    What visitors are saying
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select
                    value={filter}
                    onValueChange={(value) => setFilter(value)}
                  >
                    <SelectTrigger className="w-fit text-xs">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="project">Projects</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="suggestion">Suggestions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                }}
              >
                {filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No feedback yet</p>
                    <p className="text-xs">Be the first to share!</p>
                  </div>
                ) : (
                  filteredFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {feedback.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= feedback.rating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {feedback.type}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feedback.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
