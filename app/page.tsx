"use client";

import { useState, Suspense, lazy } from "react";
import {
  NavigationProvider,
  useNavigation,
  useSidebarState,
} from "@/contexts/navigation-context";
import { FloatingComponentsProvider } from "@/contexts/floating-components-context";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { MobileBreadcrumbs } from "@/components/mobile-breadcrumbs";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { CommandPalette } from "@/components/command-palette";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import { VisitorFeedback } from "@/components/visitor-feedback";
import { ToolsDock } from "@/components/tools-dock";
import { MobileFloatingDock } from "@/components/mobile-floating-dock";
import { MobileModals } from "@/components/mobile-modals";
import { LikeCard } from "@/components/like-card";
import { InteractiveTerminal } from "@/components/interactive-terminal";
import { VSCodeStatusBar } from "@/components/vscode-statusbar";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load section components for better performance
const AboutSection = lazy(
  () => import("@/components/sections/about-section").then((m) => ({
    default: m.AboutSection,
  }))
);
const WorkExperienceSection = lazy(
  () => import("@/components/sections/work-experience-section").then((m) => ({
    default: m.WorkExperienceSection,
  }))
);
const EducationSection = lazy(
  () => import("@/components/sections/education-section").then((m) => ({
    default: m.EducationSection,
  }))
);
const ProjectsSection = lazy(
  () => import("@/components/projects-section").then((m) => ({
    default: m.ProjectsSection,
  }))
);
const BlogSection = lazy(
  () => import("@/components/blog-section").then((m) => ({
    default: m.BlogSection,
  }))
);
const ContactSection = lazy(
  () => import("@/components/contact-section").then((m) => ({
    default: m.ContactSection,
  }))
);
const AnalyticsSection = lazy(
  () => import("@/components/sections/analytics-section").then((m) => ({
    default: m.AnalyticsSection,
  }))
);
const DevSection = lazy(
  () => import("@/components/sections/dev-section").then((m) => ({
    default: m.DevSection,
  }))
);

function HomePageContent() {
  const { currentSection, navigateToSection } = useNavigation();
  const { isSidebarCollapsed } = useSidebarState();
  const isMobile = useIsMobile();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [indicatorsVisible, setIndicatorsVisible] = useState(true);

  // Estados para los modales flotantes desde el dock móvil
  const [showMobileGithub, setShowMobileGithub] = useState(false);
  const [showMobileWeather, setShowMobileWeather] = useState(false);
  const [showMobileAiChat, setShowMobileAiChat] = useState(false);

  // Handlers para el mobile dock
  const handleAiChatToggle = () => {
    if (isMobile) {
      // En móvil, abrir modal
      setShowMobileAiChat(!showMobileAiChat);
    } else {
      // En desktop, usar el evento de teclado original
      const event = new KeyboardEvent("keydown", {
        key: "i",
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    }
  };

  const handleGithubToggle = () => {
    setShowMobileGithub(!showMobileGithub);
  };

  const handleWeatherToggle = () => {
    setShowMobileWeather(!showMobileWeather);
  };

  const renderSection = () => {
    const content = (() => {
      switch (currentSection) {
        case "home":
          return (
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              <HeroSection />
              <StatsSection />
              <div className="flex justify-center px-4">
                <VisitorFeedback />
              </div>
              <div className="flex justify-center">
                <LikeCard />
              </div>
            </div>
          );
        case "about":
          return <AboutSection />;
        case "experience":
          return <WorkExperienceSection />;
        case "education":
          return <EducationSection />;
        case "projects":
          return <ProjectsSection />;
        case "blog":
          return <BlogSection />;
        case "contact":
          return <ContactSection />;
        case "analytics":
          return process.env.NODE_ENV === "development" ? (
            <AnalyticsSection />
          ) : (
            <HeroSection />
          );
        case "dev":
          return process.env.NODE_ENV === "development" ? (
            <DevSection />
          ) : (
            <HeroSection />
          );
        default:
          return <HeroSection />;
      }
    })();

    // Wrap lazy-loaded components in Suspense with a loading fallback
    if (
      currentSection === "about" ||
      currentSection === "experience" ||
      currentSection === "education" ||
      currentSection === "projects" ||
      currentSection === "blog" ||
      currentSection === "contact" ||
      currentSection === "analytics" ||
      currentSection === "dev"
    ) {
      return (
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
          }
        >
          {content}
        </Suspense>
      );
    }

    return content;
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation
        currentSection={currentSection}
        onSectionChange={navigateToSection}
        onIndicatorsVisibilityChange={setIndicatorsVisible}
      />

      {/* Breadcrumbs para móviles */}
      <MobileBreadcrumbs
        currentSection={currentSection}
        isVisible={indicatorsVisible}
      />

      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "pl-0" : "pl-0 sm:pl-16 lg:pl-64"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 md:py-8 lg:py-12 pb-20 sm:pb-6 max-w-none xl:max-w-[1400px] 2xl:max-w-[1600px]">
          <div className="contain-layout">
            {renderSection()}
          </div>
        </div>
      </main>

      <CommandPalette
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      {/* AI Chat Assistant */}
      <AIChatAssistant />

      {/* Tools Dock - Solo en desktop */}
      {!isMobile && <ToolsDock />}

      {/* Mobile Dock - Solo en móvil */}
      {isMobile && (
        <MobileFloatingDock
          onAiChatToggle={handleAiChatToggle}
          onGithubToggle={handleGithubToggle}
          onWeatherToggle={handleWeatherToggle}
        />
      )}

      {/* Modales para móvil - Solo en móvil */}
      {isMobile && (
        <MobileModals
          showGithub={showMobileGithub}
          onGithubClose={() => setShowMobileGithub(false)}
          showWeather={showMobileWeather}
          onWeatherClose={() => setShowMobileWeather(false)}
          showAiChat={showMobileAiChat}
          onAiChatClose={() => setShowMobileAiChat(false)}
        />
      )}

      {/* Interactive Terminal - Always available */}
      <InteractiveTerminal />

      {/* VSCode-style Status Bar - Desktop only */}
      {!isMobile && <VSCodeStatusBar />}
    </div>
  );
}

export default function HomePage() {
  return (
    <NavigationProvider initialSection="home">
      <FloatingComponentsProvider>
        <HomePageContent />
      </FloatingComponentsProvider>
    </NavigationProvider>
  );
}
