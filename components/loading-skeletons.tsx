/**
 * Reusable loading skeleton components for section loading states
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading skeleton for About section
 */
export function AboutSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Profile card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Skills skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Loading skeleton for Projects section
 */
export function ProjectsSectionSkeleton() {
  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center space-y-4 mb-16">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Filter buttons skeleton */}
        <div className="flex justify-center gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>

        {/* Projects grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Loading skeleton for Work Experience section
 */
export function WorkExperienceSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Experience cards skeleton */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative flex items-start gap-6">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <Card className="flex-1">
                <CardHeader>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Education section
 */
export function EducationSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Cards skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Loading skeleton for Blog section
 */
export function BlogSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Search skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2 mt-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog grid skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-video w-full rounded-t-lg" />
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Skills section
 */
export function SkillsSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Skills grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
