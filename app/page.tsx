"use client";

import { useState } from "react";
import {
  NavigationProvider,
  useNavigation,
  useSidebarState,
} from "@/contexts/navigation-context";
import { FloatingComponentsProvider } from "@/contexts/floating-components-context";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { MobileBreadcrumbs } from "@/components/mobile-breadcrumbs";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { WorkExperienceSection } from "@/components/sections/work-experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { ProjectsSection } from "@/components/projects-section";
import { BlogSection } from "@/components/blog-section";
import { ContactSection } from "@/components/contact-section";
import { StatsSection } from "@/components/stats-section";
import { CommandPalette } from "@/components/command-palette";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import { VisitorFeedback } from "@/components/visitor-feedback";
import { VoiceNavigation } from "@/components/voice-navigation";
import { FloatingGitHub } from "@/components/floating-github";
import { FloatingWeather } from "@/components/floating-weather";
import { MobileFloatingDock } from "@/components/mobile-floating-dock";
import { MobileModals } from "@/components/mobile-modals";
import { PortfolioMusicPlayer } from "@/components/portfolio-music-player";
import { AnalyticsSection } from "@/components/sections/analytics-section";
import { DataManagementSection } from "@/components/sections/data-management-section";
import { LikeCard } from "@/components/like-card";
import { useIsMobile } from "@/hooks/use-mobile";

function HomePageContent() {
  const { currentSection, navigateToSection } = useNavigation();
  const { isSidebarCollapsed } = useSidebarState();
  const isMobile = useIsMobile();
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(false);
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
      case "data-management":
        return process.env.NODE_ENV === "development" ? (
          <DataManagementSection />
        ) : (
          <HeroSection />
        );
      default:
        return <HeroSection />;
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const handleMusicToggle = () => {
    setIsMusicActive(!isMusicActive);
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation
        currentSection={currentSection}
        onSectionChange={navigateToSection}
        onVoiceToggle={handleVoiceToggle}
        onMusicToggle={handleMusicToggle}
        isVoiceActive={isVoiceActive}
        isMusicActive={isMusicActive}
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
          {renderSection()}
        </div>
      </main>

      <CommandPalette
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      {/* AI Chat Assistant - Solo en desktop */}
      {!isMobile && <AIChatAssistant />}
      <VoiceNavigation
        isActive={isVoiceActive}
        onSectionChange={navigateToSection}
        onToggle={handleVoiceToggle}
      />
      <PortfolioMusicPlayer
        isActive={isMusicActive}
        onToggle={handleMusicToggle}
      />

      {/* Componentes flotantes - Solo en desktop */}
      {!isMobile && (
        <>
          <FloatingWeather />
          <FloatingGitHub />
        </>
      )}

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
