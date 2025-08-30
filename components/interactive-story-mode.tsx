"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, BookOpen, Award, Target, Code, Briefcase } from "lucide-react"

interface StoryChapter {
  id: string
  title: string
  content: string
  choices: StoryChoice[]
  icon: React.ReactNode
  background: string
}

interface StoryChoice {
  id: string
  text: string
  nextChapter: string
  points: number
}

interface UserProgress {
  currentChapter: string
  completedChapters: string[]
  totalPoints: number
  achievements: string[]
}

export function InteractiveStoryMode() {
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null)
  const [progress, setProgress] = useState<UserProgress>({
    currentChapter: "intro",
    completedChapters: [],
    totalPoints: 0,
    achievements: [],
  })
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [storyStarted, setStoryStarted] = useState(false)

  const storyChapters: Record<string, StoryChapter> = {
    intro: {
      id: "intro",
      title: "The Beginning",
      content:
        "Welcome to my professional journey! This interactive story will take you through my career path, key decisions, and the experiences that shaped me as a developer. Each choice you make will reveal different aspects of my background and expertise.",
      choices: [
        { id: "education", text: "Start with education and early learning", nextChapter: "education", points: 10 },
        { id: "first-job", text: "Jump to first professional experience", nextChapter: "first-job", points: 10 },
        { id: "projects", text: "Explore personal projects and side hustles", nextChapter: "projects", points: 10 },
      ],
      icon: <BookOpen className="w-6 h-6" />,
      background: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    education: {
      id: "education",
      title: "Learning Foundation",
      content:
        "My journey began with a strong foundation in computer science and mathematics. During university, I discovered my passion for web development and started building my first applications. The theoretical knowledge combined with hands-on projects gave me a solid understanding of software engineering principles.",
      choices: [
        { id: "first-project", text: "Learn about my first major project", nextChapter: "first-project", points: 15 },
        { id: "internship", text: "Discover my internship experience", nextChapter: "internship", points: 15 },
        { id: "skills", text: "Explore the skills I developed", nextChapter: "skills", points: 10 },
      ],
      icon: <Target className="w-6 h-6" />,
      background: "bg-gradient-to-br from-green-500 to-teal-600",
    },
    "first-job": {
      id: "first-job",
      title: "Professional Debut",
      content:
        "My first professional role was both exciting and challenging. I joined a startup where I wore multiple hats - from frontend development to database design. This experience taught me the importance of adaptability and continuous learning in the tech industry.",
      choices: [
        { id: "challenges", text: "What challenges did you face?", nextChapter: "challenges", points: 20 },
        { id: "growth", text: "How did you grow professionally?", nextChapter: "growth", points: 15 },
        { id: "team", text: "Tell me about your team experience", nextChapter: "team", points: 15 },
      ],
      icon: <Briefcase className="w-6 h-6" />,
      background: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    projects: {
      id: "projects",
      title: "Creative Ventures",
      content:
        "Beyond formal education and work, I've always been passionate about building things. My personal projects range from simple web applications to complex full-stack solutions. Each project taught me something new and helped me explore different technologies and approaches.",
      choices: [
        { id: "tech-stack", text: "What technologies do you prefer?", nextChapter: "tech-stack", points: 15 },
        { id: "inspiration", text: "Where do you find inspiration?", nextChapter: "inspiration", points: 10 },
        { id: "future", text: "What's next in your journey?", nextChapter: "future", points: 20 },
      ],
      icon: <Code className="w-6 h-6" />,
      background: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
    "first-project": {
      id: "first-project",
      title: "The First Creation",
      content:
        "My first major project was a task management application built with React and Node.js. It was simple but functional, and seeing users actually use something I built was incredibly motivating. This project taught me the importance of user feedback and iterative development.",
      choices: [
        { id: "lessons", text: "What lessons did you learn?", nextChapter: "lessons", points: 25 },
        { id: "next-project", text: "What came next?", nextChapter: "next-project", points: 15 },
      ],
      icon: <Award className="w-6 h-6" />,
      background: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
    lessons: {
      id: "lessons",
      title: "Key Learnings",
      content:
        "Through my journey, I've learned that great software is not just about clean code - it's about solving real problems for real people. User empathy, continuous learning, and collaboration are just as important as technical skills. Every project, whether successful or not, has contributed to my growth as a developer.",
      choices: [
        { id: "restart", text: "Start the story again", nextChapter: "intro", points: 5 },
        { id: "contact", text: "Get in touch to learn more", nextChapter: "contact", points: 30 },
      ],
      icon: <Target className="w-6 h-6" />,
      background: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    contact: {
      id: "contact",
      title: "Let's Connect",
      content:
        "Thank you for following my story! If you'd like to learn more about my experience, discuss potential collaborations, or just have a chat about technology, I'd love to hear from you. Feel free to reach out through the contact form or connect with me on social media.",
      choices: [{ id: "restart", text: "Experience the story again", nextChapter: "intro", points: 5 }],
      icon: <Award className="w-6 h-6" />,
      background: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
  }

  useEffect(() => {
    if (storyStarted && currentChapter) {
      const timer = setTimeout(() => {
        if (isAutoPlay && currentChapter.choices.length > 0) {
          const randomChoice = currentChapter.choices[Math.floor(Math.random() * currentChapter.choices.length)]
          handleChoice(randomChoice)
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentChapter, isAutoPlay, storyStarted])

  const startStory = () => {
    setStoryStarted(true)
    setCurrentChapter(storyChapters.intro)
  }

  const handleChoice = (choice: StoryChoice) => {
    const nextChapter = storyChapters[choice.nextChapter]
    if (nextChapter) {
      setCurrentChapter(nextChapter)
      setProgress((prev) => ({
        ...prev,
        currentChapter: choice.nextChapter,
        completedChapters: [...prev.completedChapters, prev.currentChapter],
        totalPoints: prev.totalPoints + choice.points,
        achievements: checkAchievements(prev.totalPoints + choice.points, prev.achievements),
      }))
    }
  }

  const checkAchievements = (points: number, currentAchievements: string[]): string[] => {
    const achievements = [...currentAchievements]

    if (points >= 50 && !achievements.includes("explorer")) {
      achievements.push("explorer")
    }
    if (points >= 100 && !achievements.includes("storyteller")) {
      achievements.push("storyteller")
    }
    if (points >= 150 && !achievements.includes("master")) {
      achievements.push("master")
    }

    return achievements
  }

  const resetStory = () => {
    setCurrentChapter(storyChapters.intro)
    setProgress({
      currentChapter: "intro",
      completedChapters: [],
      totalPoints: 0,
      achievements: [],
    })
    setStoryStarted(true)
  }

  const achievementLabels = {
    explorer: "Story Explorer",
    storyteller: "Dedicated Reader",
    master: "Story Master",
  }

  if (!storyStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Interactive Story Mode</h1>
          <p className="text-muted-foreground">Experience my professional journey through an interactive narrative</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Welcome to My Story</h3>
            <p className="text-muted-foreground mb-6">
              Embark on an interactive journey through my career, education, and projects. Make choices that reveal
              different aspects of my professional background and expertise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Multiple Paths</h4>
                <p className="text-sm text-muted-foreground">Choose your own adventure</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium">Achievements</h4>
                <p className="text-sm text-muted-foreground">Unlock story milestones</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Code className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium">Interactive</h4>
                <p className="text-sm text-muted-foreground">Engaging experience</p>
              </div>
            </div>
            <Button onClick={startStory} size="lg" className="w-full">
              <Play className="w-5 h-5 mr-2" />
              Begin My Story
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentChapter) return null

  const progressPercentage = (progress.completedChapters.length / Object.keys(storyChapters).length) * 100

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Interactive Story Mode</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Progress: {Math.round(progressPercentage)}%</span>
          <span>Points: {progress.totalPoints}</span>
          <span>Achievements: {progress.achievements.length}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => setIsAutoPlay(!isAutoPlay)}>
          {isAutoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAutoPlay ? "Pause Auto" : "Auto Play"}
        </Button>
        <Button variant="outline" size="sm" onClick={resetStory}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      <Progress value={progressPercentage} className="w-full max-w-md mx-auto" />

      <Card className="max-w-3xl mx-auto">
        <CardHeader className={`text-white ${currentChapter.background}`}>
          <div className="flex items-center gap-3">
            {currentChapter.icon}
            <div>
              <CardTitle>{currentChapter.title}</CardTitle>
              <CardDescription className="text-white/80">
                Chapter {Object.keys(storyChapters).indexOf(currentChapter.id) + 1} of{" "}
                {Object.keys(storyChapters).length}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed mb-6">{currentChapter.content}</p>

          {currentChapter.choices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                What would you like to explore next?
              </h4>
              {currentChapter.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-transparent"
                  onClick={() => handleChoice(choice)}
                >
                  <div>
                    <div className="font-medium">{choice.text}</div>
                    <div className="text-xs text-muted-foreground">+{choice.points} points</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {progress.achievements.length > 0 && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.achievements.map((achievement) => (
                <Badge key={achievement} variant="secondary">
                  {achievementLabels[achievement as keyof typeof achievementLabels]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
