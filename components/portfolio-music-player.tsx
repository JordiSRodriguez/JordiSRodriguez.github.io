"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, X } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  genre: string
  duration: number
}

interface PortfolioMusicPlayerProps {
  isActive: boolean
  onToggle: () => void
}

const codingPlaylist: Track[] = [
  { id: "1", title: "Focus Flow", artist: "Lo-Fi Beats", genre: "Lo-Fi", duration: 180 },
  { id: "2", title: "Code Symphony", artist: "Ambient Tech", genre: "Ambient", duration: 240 },
  { id: "3", title: "Debug Dreams", artist: "Synthwave Dev", genre: "Synthwave", duration: 200 },
  { id: "4", title: "Algorithm Anthem", artist: "Electronic Mind", genre: "Electronic", duration: 220 },
  { id: "5", title: "Binary Beats", artist: "Digital Zen", genre: "Chillstep", duration: 190 },
]

export function PortfolioMusicPlayer({ isActive, onToggle }: PortfolioMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([70])
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= codingPlaylist[currentTrack].duration) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentTrack])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % codingPlaylist.length)
    setCurrentTime(0)
  }

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + codingPlaylist.length) % codingPlaylist.length)
    setCurrentTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const track = codingPlaylist[currentTrack]

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Music className="w-4 h-4" />
              Música Lo-Fi para Programar
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium text-sm">{track.title}</h4>
            <p className="text-xs text-muted-foreground">{track.artist}</p>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">{track.genre}</span>
          </div>

          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={track.duration}
              step={1}
              className="w-full"
              onValueChange={(value) => setCurrentTime(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <Slider value={volume} max={100} step={1} className="flex-1" onValueChange={setVolume} />
            <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Pista {currentTrack + 1} de {codingPlaylist.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
