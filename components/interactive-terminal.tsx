"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalCommand {
  command: string;
  output: string;
  type: "success" | "error" | "info";
}

export function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalCommand[]>([
    {
      command: "help",
      output: `Available commands:
  about     - Learn about Jordi
  projects  - View completed projects
  skills    - List technical skills
  contact   - Get contact information
  clear     - Clear terminal
  social    - Social media links`,
      type: "info",
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const commands: Record<string, { output: string; type: "success" | "error" | "info" }> = {
    about: {
      output: `Jordi Sumba
Full Stack Developer crafting exceptional digital experiences.

Location: Spain
Status: Available for projects
Email: contact@jordisumba.dev`,
      type: "success",
    },
    projects: {
      output: `Completed Projects: 5+
In Progress: 2

Categories:
  • Web Applications
  • APIs & Backend
  • Mobile Apps
  • Open Source`,
      type: "success",
    },
    skills: {
      output: `Technical Skills:
  Frontend: React, Next.js, TypeScript, Tailwind
  Backend: Node.js, Python, Supabase, PostgreSQL
  Tools: Git, Docker, CI/CD, VS Code`,
      type: "success",
    },
    contact: {
      output: `Get in touch:
  Email: contact@jordisumba.dev
  GitHub: github.com/jordisumba
  LinkedIn: linkedin.com/in/jordisumba`,
      type: "info",
    },
    social: {
      output: `Social Links:
  GitHub:  github.com/jordisumba
  LinkedIn: linkedin.com/in/jordisumba
  Twitter:  twitter.com/jordisumba`,
      type: "info",
    },
    clear: {
      output: "Terminal cleared",
      type: "info",
    },
    help: {
      output: `Available commands:
  about     - Learn about Jordi
  projects  - View completed projects
  skills    - List technical skills
  contact   - Get contact information
  clear     - Clear terminal
  social    - Social media links`,
      type: "info",
    },
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    const result = commands[trimmedCmd];

    if (result) {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: result.output, type: result.type },
      ]);
    } else if (trimmedCmd) {
      setHistory((prev) => [
        ...prev,
        {
          command: cmd,
          output: `Command not found: ${cmd}. Type 'help' for available commands.`,
          type: "error",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        handleCommand(input);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex <= commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - newIndex] || "");
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-4 z-40 p-3 bg-git-branch hover:bg-git-branch/90 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-git-branch/30 transition-all duration-300 group"
        title="Open Terminal (Ctrl+`)"
      >
        <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed inset-4 sm:inset-10 lg:inset-20 z-50 flex flex-col bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors" />
            <button className="w-3 h-3 rounded-full bg-git-modified/80 hover:bg-git-modified transition-colors" />
            <button className="w-3 h-3 rounded-full bg-git-clean/80 hover:bg-git-clean transition-colors" />
          </div>
          <span className="text-xs font-mono-display text-muted-foreground ml-2">
            terminal — bash
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Press Ctrl+L to close
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono-display text-sm bg-background"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome message */}
        {history.length === 0 && (
          <div className="mb-4 text-muted-foreground">
            <div className="text-git-clean mb-2">Welcome to Jordi Sumba's Portfolio Terminal</div>
            <div className="text-xs">Type 'help' to see available commands</div>
          </div>
        )}

        {/* Command history */}
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-git-clean">➜</span>
              <span className="text-foreground">{item.command}</span>
            </div>
            <pre
              className={cn(
                "mt-1 ml-4 whitespace-pre-wrap text-xs sm:text-sm",
                item.type === "error" && "text-git-conflict",
                item.type === "success" && "text-git-clean",
                item.type === "info" && "text-muted-foreground"
              )}
            >
              {item.output}
            </pre>
          </div>
        ))}

        {/* Input */}
        <div className="flex items-center gap-2">
          <span className="text-git-clean animate-pulse">➜</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground caret-git-branch"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </div>

      {/* Terminal footer */}
      <div className="px-4 py-1 bg-muted border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span>bash</span>
        <span>Press Ctrl+L to close</span>
      </div>
    </div>
  );
}
