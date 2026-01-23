"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function ContributionGraph() {
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Generate contribution data for the last 52 weeks
    const generateData = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 364 - dayOfWeek);

      const data: ContributionDay[][] = [];
      let currentWeek: ContributionDay[] = [];

      for (let i = 0; i < 364 + dayOfWeek + 1; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Generate realistic-looking contribution pattern
        const baseChance = Math.random();
        let count = 0;

        // Weekend bias (fewer commits)
        if (date.getDay() === 0 || date.getDay() === 6) {
          count = baseChance > 0.7 ? Math.floor(Math.random() * 3) : 0;
        } else {
          // Weekday pattern with bursts of activity
          if (baseChance > 0.4) {
            count = Math.floor(Math.random() * 8);
          } else if (baseChance > 0.2) {
            count = Math.floor(Math.random() * 15);
          }
        }

        // Calculate level based on count
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count > 0) level = 1;
        if (count > 3) level = 2;
        if (count > 6) level = 3;
        if (count > 10) level = 4;

        currentWeek.push({ date, count, level });

        // Start new week on Sunday (except for first week)
        if (date.getDay() === 6 && currentWeek.length === 7) {
          data.push(currentWeek);
          currentWeek = [];
        }
      }

      // Add remaining days
      if (currentWeek.length > 0) {
        data.push(currentWeek);
      }

      return data;
    };

    setWeeks(generateData());
    setIsLoaded(true);
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["", "Mon", "", "Wed", "", "Fri", ""];

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted/20 border border-border/30";
      case 1:
        return "bg-git-clean/20 border border-git-clean/30";
      case 2:
        return "bg-git-clean/40 border border-git-clean/50";
      case 3:
        return "bg-git-clean/60 border border-git-clean/70";
      case 4:
        return "bg-git-clean/80 border border-git-clean";
      default:
        return "bg-muted/20 border border-border/30";
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-32 rounded-lg bg-muted/10 animate-pulse" />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Month labels */}
      <div className="flex justify-between mb-2 px-8 text-[10px] text-muted-foreground font-mono-display">
        {months.map((month, i) => (
          <span key={month} className={i % 2 === 0 ? "" : "opacity-0"}>
            {month}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2 text-[10px] text-muted-foreground font-mono-display">
          {days.map((day) => (
            <div key={day} className="h-3 flex items-center">
              {day}
            </div>
          ))}
        </div>

        {/* Contribution squares */}
        <div className="flex gap-[3px]">
          {weeks.slice(-52).map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = week[dayIndex];
                if (!day) {
                  return <div key={dayIndex} className="w-3 h-3" />;
                }

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer",
                      getLevelColor(day.level),
                      "hover:scale-125 hover:shadow-lg hover:shadow-git-clean/20 hover:z-10"
                    )}
                    title={`${day.date.toLocaleDateString()}: ${day.count} contributions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-muted-foreground font-mono-display">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn("w-3 h-3 rounded-sm", getLevelColor(level as 0 | 1 | 2 | 3 | 4))}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
