"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Eye, Clock, Globe, Zap, Target } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface AnalyticsData {
  totalVisits: number
  uniqueVisitors: number
  averageSessionTime: number
  topSections: { section: string; visits: number }[]
  deviceTypes: { type: string; count: number }[]
  countries: { country: string; count: number }[]
  engagementScore: number
}

export function PortfolioAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [realTimeVisitors, setRealTimeVisitors] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchAnalytics()

    // Simulate real-time visitor updates
    const interval = setInterval(() => {
      setRealTimeVisitors((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch visit statistics
      const { data: visits } = await supabase.from("visit_stats").select("*").order("created_at", { ascending: false })

      // Mock analytics data (in real app, this would be calculated from actual data)
      const mockAnalytics: AnalyticsData = {
        totalVisits: 1247,
        uniqueVisitors: 892,
        averageSessionTime: 4.2,
        topSections: [
          { section: "Projects", visits: 456 },
          { section: "About", visits: 321 },
          { section: "Experience", visits: 298 },
          { section: "Blog", visits: 172 },
        ],
        deviceTypes: [
          { type: "Desktop", count: 65 },
          { type: "Mobile", count: 28 },
          { type: "Tablet", count: 7 },
        ],
        countries: [
          { country: "United States", count: 342 },
          { country: "United Kingdom", count: 156 },
          { country: "Germany", count: 98 },
          { country: "Canada", count: 87 },
        ],
        engagementScore: 87,
      }

      setAnalytics(mockAnalytics)
      setRealTimeVisitors(Math.floor(Math.random() * 12) + 3)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-muted-foreground">{realTimeVisitors} visitors online now</span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold">{analytics.totalVisits.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold">{analytics.averageSessionTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">{analytics.engagementScore}%</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress value={analytics.engagementScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Popular Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSections.map((section, index) => (
                <div key={section.section} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{section.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(section.visits / analytics.topSections[0].visits) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">{section.visits}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.deviceTypes.map((device) => (
                <div key={device.type} className="flex items-center justify-between">
                  <span className="font-medium">{device.type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${device.count}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">{device.count}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {analytics.countries.map((country) => (
                <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{country.country}</span>
                  <Badge variant="secondary">{country.count} visits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
