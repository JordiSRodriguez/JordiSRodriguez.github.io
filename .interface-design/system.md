# Portfolio Design System

## Direction: "Living Codebase"

**Concept:** The portfolio as a beautifully designed IDE/git client. Every interface element references code, git workflows, and developer tools in a premium, modern way.

**Inspired by:** Linear, GitHub, VS Code, One Dark Pro theme

---

## Design Philosophy

**Domain concepts:** Git branches, commit history, syntax highlighting, file systems, deployment status
**Color world:** Git status colors, syntax highlighting palettes, terminal greens, editor theme backgrounds
**Signature:** Navigation as git branching — each section is a `git checkout`, visual commit history, file/document aesthetic
**Rejecting:** Rainbow nav → Git status colors | Generic cards → File tabs | Random spacing → Monospace 8px grid

---

## Color System

### Light Theme (GitHub Light Dim inspired)
- Background: `oklch(0.98 0 0)` — Editor background
- Foreground: `oklch(0.25 0 0)` — Default text
- Primary: `oklch(0.45 0.12 250)` — Syntax keyword blue
- Border: `oklch(0.90 0 0)` — Editor border
- Muted: `oklch(0.96 0 0)` — Inactive text

### Dark Theme (One Dark Pro inspired)
- Background: `oklch(0.16 0.01 250)` — Editor background
- Foreground: `oklch(0.78 0.01 250)` — Default text
- Primary: `oklch(0.65 0.20 250)` — Syntax keyword blue
- Border: `oklch(0.28 0.02 250)` — Editor border
- Muted: `oklch(0.22 0.01 250)` — Inactive text

### Git Status Colors
- `--git-clean`: `oklch(0.65 0.15 150)` — Green (committed)
- `--git-modified`: `oklch(0.70 0.15 85)` — Yellow (changed)
- `--git-conflict`: `oklch(0.55 0.20 25)` — Red (conflict)
- `--git-branch`: `oklch(0.50 0.18 250)` — Blue (branch)

### Syntax Colors (Chart palette)
- JavaScript yellow: `oklch(0.70 0.18 60)`
- Keyword blue: `oklch(0.65 0.20 250)`
- String green: `oklch(0.70 0.18 150)`
- Regex purple: `oklch(0.75 0.20 290)`
- Error red: `oklch(0.65 0.20 25)`

---

## Typography

### Primary
- Font: Geist Sans (fallback: system-ui)
- Usage: Body text, UI elements

### Monospace Display
- Font: Geist Mono (fallback: 'SF Mono', 'Fira Code', monospace)
- Usage: File names, commit hashes, git branch names, code
- Feature settings: `"liga" 0, "calt" 0` (disable ligatures for clarity)

### Type Scale
- Body: `text-sm sm:text-base`
- Headers: `text-xl sm:text-2xl lg:text-3xl`
- Mono labels: `text-[10px] text-xs`
- File names: `text-xs font-mono-display`

---

## Spacing System

**Base unit: 8px** (1 rem = 16px by default, using Tailwind's spacing scale)

- Gap between sections: `space-y-6 sm:space-y-8`
- Card padding: `p-4 sm:p-6`
- Element gap: `gap-2 sm:gap-3`
- Tight spacing: `gap-1.5`

---

## Depth Strategy

**Borders-only** — Clean, technical feel inspired by code editors

- Border width: `1px` or `border`
- Border color: `border-border` (editor border)
- No drop shadows on cards (use border differences instead)
- Subtle backdrop blur on floating panels: `backdrop-blur-md`

**Exception:** Floating widgets use minimal shadow for lift
- Compact: `shadow-lg`
- Expanded: `shadow-2xl`

---

## Component Patterns

### 1. Sidebar Navigation (File Explorer)

**Structure:**
```
~/portfolio/src
jordi-sumba.ts
● Full Stack Developer

[Navigation items as git branches]
```

**Pattern:**
- Header with file path aesthetic
- Each nav item shows: branch indicator, icon, label, git branch name
- Active state: `bg-secondary` with pulsing branch dot
- Branch names as badges: `feat/readme`, `main`, `fix/contact`
- Monospace font for branch names

**Code reference:**
```tsx
<div className="flex items-center gap-2 text-[10px] font-mono-display text-muted-foreground">
  <span className="opacity-50">~</span>
  <span className="opacity-50">/</span>
  <span className="opacity-70">portfolio</span>
  <span className="opacity-50">/</span>
  <span className="text-git-branch font-semibold">src</span>
</div>
```

### 2. File Tab Cards

**Structure:**
```
┌─────────────────────────────────┐
│ README.md  markdown  ●  23s ago │
├─────────────────────────────────┤
│ Content...                      │
└─────────────────────────────────┘
```

**Pattern:**
- Tab bar with filename, language badge, git status, time ago
- Monospace font for filename
- Git status indicator: `●` for modified
- Content area without extra padding (tab provides structure)

**Component:** `<FileCard filename="README.md" language="markdown" icon={FileText}>`

### 3. Tools Dock (IDE Panel)

**Compact mode:**
- Git status style badges
- Active tab: colored border + background tint
- Inactive tab: muted, lower opacity

**Expanded mode:**
- File tab styling (`.ts` extensions)
- Tab indicator: `M` for modified files
- Rounded corners: `rounded-lg` (sharper for technical feel)

### 4. Git Branch Indicators

**Navigation items:**
- Colored dot representing branch state
- Branch name badge in monospace
- Active state: pulsing animation

**Status colors:**
- `main` branch: `text-git-branch`
- Feature branches: `text-git-clean`
- Modified sections: `text-git-modified`
- Dev tools: `text-git-conflict`

---

## Micro-interactions

### 1. Terminal Cursor Blink
```css
.typing-cursor::after {
  content: '|';
  animation: blink-cursor 1s step-end infinite;
}
```

### 2. Git Status Ping
```css
.git-status-dot::before {
  /* Subtle ping animation for active status */
  animation: status-ping 1.5s ease-out infinite;
}
```

### 3. Hover Diff Highlights
- Add hover: `.hover-diff-add:hover` → green tint
- Remove hover: `.hover-diff-remove:hover` → red tint

### 4. Branch Line Gradient
```css
.branch-line::before {
  background: linear-gradient(to bottom, var(--git-branch), var(--git-clean));
}
```

---

## Utilities Reference

### Font Utilities
- `.font-mono-display` — Monospace with ligatures disabled

### Git Utilities
- `.git-branch-indicator` — Branch line + dot
- `.commit-hash` — Styled commit reference
- `.diff-add` / `.diff-remove` — Background gradients
- `.git-status-dot` — Animated status indicator

### Code Utilities
- `.line-number` — Styled line numbers
- `.code-block-wrapper` — Wrapper with guide line
- `.syntax-highlight` — Gradient accent bar
- `.syntax-selection` — Text selection background

### File Utilities
- `.file-tab` — Tab styling
- `.file-tab-active` — Active tab state

---

## Animation Timing

- Transitions: `duration-300` (300ms) — standard
- Hover effects: `duration-200` (200ms) — responsive
- Pulse: `animate-pulse` — git status
- Blink cursor: `1s step-end infinite` — terminal style

---

## Responsive Behavior

**Mobile breakpoint:** `768px` (Tailwind `md:`)

- Sidebar: Collapsible drawer on mobile
- Tools dock: Modal overlay on mobile
- Text: `text-sm` → `text-base` → `text-lg`
- Spacing: `p-4` → `sm:p-6`
- Grid: 1 col → 2 cols → 3-4 cols

---

## States

### Interactive elements
- Default: Base styles
- Hover: Border color change, subtle scale (if icon-based)
- Active/focus: `bg-secondary` or `ring`
- Disabled: `opacity-50 pointer-events-none`

### Git states
- Clean: `text-git-clean`
- Modified: `text-git-modified`
- Conflict: `text-git-conflict`
- Branch: `text-git-branch`

---

## Border Radius

- Cards: `rounded-lg` (0.5rem) — Slightly sharp for technical feel
- Buttons: `rounded-md` (0.375rem) — More refined
- Pills/badges: `rounded-full` — Status indicators

---

## Key Principles

1. **Every color tells a story** — Git status, syntax highlighting, editor themes
2. **Monospace is signature** — Use for filenames, branches, commits, code
3. **Borders over shadows** — Clean, technical, editor-inspired
4. **Consistent spacing** — 8px base unit, multiples only
5. **Performance first** — No layout shifts, stable animations
6. **Accessibility** — WCAG contrast, keyboard navigation, screen reader support

---

## Files Modified in This Transformation

1. `app/globals.css` — Color tokens, utilities, animations
2. `components/sidebar-navigation.tsx` — Git-branch navigation
3. `components/tools-dock.tsx` — IDE panel styling
4. `components/sections/about-section.tsx` — File tab cards
5. `components/ui/file-card.tsx` — New reusable component

---

## Future Extensions

**Apply to other sections:**
- Work experience: `experience.ts` with timeline as git log
- Projects: `projects/` directory with README per project
- Education: `education.md` as markdown document
- Contact: `contact.ts` with form as code input

**Additional ideas:**
- Line numbers on content sections
- Syntax highlighting on headings
- Commit graph visualization
- File tree navigation for deep hierarchies
