"use client"

import { PortfolioAnalytics } from "@/components/portfolio-analytics"

export function AnalyticsSection() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Portfolio Analytics
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-time insights into portfolio performance, visitor engagement, and content popularity.
        </p>
      </div>

      <PortfolioAnalytics />
    </div>
  )
}
