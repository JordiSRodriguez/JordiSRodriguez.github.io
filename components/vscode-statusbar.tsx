"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  GitBranch,
  Bell,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Terminal,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface StatusItem {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
}

export function VSCodeStatusBar() {
  const [currentTime, setCurrentTime] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [syncing, setSyncing] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [errors, setErrors] = useState(0);
  const [warnings, setWarnings] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate random activity
  useEffect(() => {
    const activityInterval = setInterval(() => {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 2000);

      // Randomly update notifications
      if (Math.random() > 0.7) {
        setNotifications((n) => (n > 0 ? n - 1 : 0));
      }
    }, 15000);

    return () => clearInterval(activityInterval);
  }, []);

  const leftItems: StatusItem[] = [
    {
      icon: GitBranch,
      label: "branch",
      value: gitBranch,
      color: "text-git-clean",
    },
    {
      icon: RefreshCw,
      label: "sync",
      value: "",
      color: syncing ? "text-git-branch animate-spin" : "text-muted-foreground",
    },
    {
      icon: errors > 0 ? AlertCircle : CheckCircle,
      label: "problems",
      value: errors > 0 ? `${errors} ${warnings > 0 ? `+ ${warnings} warnings` : ""}` : "0",
      color: errors > 0 ? "text-git-conflict" : warnings > 0 ? "text-git-modified" : "text-git-clean",
    },
  ];

  const rightItems: StatusItem[] = [
    {
      icon: Bell,
      label: "notifications",
      value: notifications > 0 ? `${notifications}` : "",
      color: "text-muted-foreground",
    },
    {
      icon: Terminal,
      label: "terminal",
      value: "",
      color: "text-muted-foreground hover:text-foreground",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-muted/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-between px-2 sm:px-4 h-6 sm:h-7">
        {/* Left side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {leftItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 text-[10px] sm:text-xs font-mono-display hover:bg-muted-foreground/10 transition-colors rounded",
                item.color
              )}
            >
              <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {item.value && <span className="hidden sm:inline">{item.value}</span>}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {rightItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 text-[10px] sm:text-xs font-mono-display hover:bg-muted-foreground/10 transition-colors rounded relative",
                item.color
              )}
            >
              {item.value && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-git-conflict text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                  {item.value}
                </span>
              )}
              <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          ))}

          {/* Time */}
          <div className="px-2 py-1 text-[10px] sm:text-xs font-mono-display text-muted-foreground hover:bg-muted-foreground/10 rounded cursor-pointer">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}
