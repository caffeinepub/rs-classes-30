import { Button } from "@/components/ui/button";
import {
  BarChart2,
  BookOpen,
  Bot,
  ChevronLeft,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface AppHeaderProps {
  onLogout?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  isAdmin?: boolean;
  onTalkToSir?: () => void;
  onProgress?: () => void;
}

export default function AppHeader({
  onLogout,
  onBack,
  showBack = false,
  title = "RS Classes 30",
  subtitle = "by Siwachan Sir",
  isAdmin = false,
  onTalkToSir,
  onProgress,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-brand-indigo shadow-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: back + logo */}
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 shrink-0 -ml-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-brand-saffron/80 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-white font-display font-bold text-sm sm:text-base leading-none block truncate">
                {isAdmin ? "Admin Panel — " : ""}
                {title}
              </span>
              {!isAdmin && (
                <span className="text-white/60 text-[10px] leading-none block">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: nav buttons + logout */}
        {!isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            {onTalkToSir && (
              <Button
                data-ocid="nav.talk_to_sir_button"
                variant="ghost"
                size="sm"
                onClick={onTalkToSir}
                className="text-white hover:bg-white/20 gap-1.5 shrink-0 text-xs px-2"
                title="Talk to Siwachan Sir"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Talk to Sir</span>
              </Button>
            )}

            {onProgress && (
              <Button
                data-ocid="nav.progress_button"
                variant="ghost"
                size="sm"
                onClick={onProgress}
                className="text-white hover:bg-white/20 gap-1.5 shrink-0 text-xs px-2"
                title="My Progress"
              >
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
              </Button>
            )}

            <Button
              data-ocid="nav.admin_button"
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="text-white hover:bg-white/20 gap-1.5 shrink-0 text-xs px-2"
              title="Admin Panel"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>

            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white hover:bg-white/20 gap-1.5 shrink-0 text-xs px-2"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        )}

        {/* Admin logout */}
        {isAdmin && onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/20 gap-1.5 shrink-0 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
