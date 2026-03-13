import {
  FileText,
  HelpCircle,
  MessageSquare,
  PlayCircle,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import AppHeader from "../components/AppHeader";
import { ContentType } from "../hooks/useQueries";

interface ModeSelectPageProps {
  phone: string;
  selectedClass: bigint;
  selectedSubjectName: string;
  onModeSelect: (mode: ContentType | "doubt") => void;
  onBack: () => void;
  onLogout: () => void;
  onTalkToSir?: () => void;
  onProgress?: () => void;
}

const MODES = [
  {
    id: ContentType.liveClass,
    label: "Live Class",
    description: "Join live sessions by teacher",
    icon: Video,
    gradient: "from-red-500 to-pink-600",
    bg: "from-red-50 to-pink-50",
    ocid: "mode_select.live_class_button",
  },
  {
    id: ContentType.recordedClass,
    label: "Recorded Class",
    description: "Watch recorded video lessons",
    icon: PlayCircle,
    gradient: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    ocid: "mode_select.recorded_class_button",
  },
  {
    id: ContentType.quiz,
    label: "Quiz",
    description: "Test your knowledge",
    icon: HelpCircle,
    gradient: "from-amber-500 to-orange-600",
    bg: "from-amber-50 to-orange-50",
    ocid: "mode_select.quiz_button",
  },
  {
    id: ContentType.pdfNotes,
    label: "PDF Notes",
    description: "Download study material",
    icon: FileText,
    gradient: "from-green-500 to-emerald-600",
    bg: "from-green-50 to-emerald-50",
    ocid: "mode_select.pdf_notes_button",
  },
  {
    id: "doubt" as const,
    label: "Doubt",
    description: "Ask your teacher a question",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-600",
    bg: "from-violet-50 to-purple-50",
    ocid: "mode_select.doubt_button",
  },
];

export default function ModeSelectPage({
  selectedClass,
  selectedSubjectName,
  onModeSelect,
  onBack,
  onLogout,
  onTalkToSir,
  onProgress,
}: ModeSelectPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        onLogout={onLogout}
        onBack={onBack}
        showBack
        onTalkToSir={onTalkToSir}
        onProgress={onProgress}
      />

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.2 290) 0%, oklch(0.45 0.18 320) 100%)",
        }}
        className="relative overflow-hidden"
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-1">
              Class {selectedClass.toString()} · {selectedSubjectName}
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              What do you want to do?
            </h2>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <main className="container mx-auto px-4 py-6 flex-1 max-w-md">
        <div className="grid grid-cols-1 gap-3">
          {MODES.map((mode, idx) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={String(mode.id)}
                data-ocid={mode.ocid}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onModeSelect(mode.id)}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${mode.gradient} shadow-xs`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-foreground text-base">
                    {mode.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {mode.description}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <svg
                    role="img"
                    aria-label="Go"
                    className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Go</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      <footer className="text-center py-4 text-muted-foreground text-xs border-t border-border/40">
        © {new Date().getFullYear()} RS Classes 30
      </footer>
    </div>
  );
}
