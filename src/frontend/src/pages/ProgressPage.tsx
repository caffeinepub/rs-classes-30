import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  HelpCircle,
  MessageSquare,
  Phone,
  PlayCircle,
  Star,
  User,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import AppHeader from "../components/AppHeader";

interface ProgressPageProps {
  phone: string | null;
  studentName: string | null;
  selectedClass: bigint | null;
  onBack: () => void;
  onTalkToSir?: () => void;
  onProgress?: () => void;
}

const MODES = [
  {
    key: "liveClass",
    label: "Live Class",
    icon: Video,
    color: "from-red-500 to-pink-600",
    bg: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  {
    key: "recordedClass",
    label: "Recorded Class",
    icon: PlayCircle,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    key: "quiz",
    label: "Quiz",
    icon: HelpCircle,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    key: "pdfNotes",
    label: "PDF Notes",
    icon: FileText,
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  {
    key: "doubt",
    label: "Doubt",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
  },
];

export default function ProgressPage({
  phone,
  studentName,
  selectedClass,
  onBack,
  onTalkToSir,
  onProgress,
}: ProgressPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        onBack={onBack}
        showBack
        title="My Progress"
        subtitle="by Siwachan Sir"
        onTalkToSir={onTalkToSir}
        onProgress={onProgress}
      />

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.45 0.18 162) 0%, oklch(0.38 0.15 200) 100%)",
        }}
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              My Progress
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Aapki padhai ki journey — RS Classes 30
            </p>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <main
        data-ocid="progress.section"
        className="container mx-auto px-4 py-6 flex-1 max-w-lg space-y-5"
      >
        {/* Student info card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-brand-saffron" />
            Student Profile
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-black text-lg shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
                }}
              >
                {studentName ? studentName.charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-base">
                  {studentName ?? "Student"}
                </p>
                {phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Phone className="h-3 w-3" />
                    +91 {phone}
                  </div>
                )}
              </div>
            </div>

            {selectedClass && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground">
                  Currently studying:
                </span>
                <Badge
                  className="text-xs font-bold"
                  style={{
                    background: "oklch(0.65 0.19 45 / 15%)",
                    color: "oklch(0.45 0.18 45)",
                    borderColor: "oklch(0.65 0.19 45 / 30%)",
                  }}
                >
                  Class {selectedClass.toString()}
                </Badge>
              </div>
            )}
          </div>
        </motion.div>

        {/* Learning modes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <h3 className="font-display font-bold text-base text-foreground mb-1">
            Learning Modes Available
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            All 5 learning modes are available for you
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {MODES.map((mode, idx) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.06 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${mode.bg} ${mode.borderColor}`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${mode.color}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span
                    className={`font-body font-semibold text-sm flex-1 ${mode.textColor}`}
                  >
                    {mode.label}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${mode.textColor} ${mode.borderColor} bg-white/60`}
                  >
                    Available ✓
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Motivational card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl p-5 text-center shadow-card"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.08 268) 0%, oklch(0.35 0.12 268) 100%)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
            }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-white font-display font-bold text-xl mb-1">
            Keep up the great work!
          </h3>
          <p className="text-white/70 text-sm mb-4">
            Siwachan Sir is proud of you!
          </p>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 transition-colors ${
                  star <= 4
                    ? "fill-brand-saffron text-brand-saffron"
                    : "text-white/30"
                }`}
              />
            ))}
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.82 0.18 75)" }}
          >
            4 out of 5 — Excellent progress!
          </p>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs italic">
              "Mehnat ka koi shortcut nahi hota. Roz thoda padhna, sabse bada
              fark laata hai." — Siwachan Sir
            </p>
          </div>
        </motion.div>

        <Button
          data-ocid="progress.back_button"
          variant="outline"
          className="w-full h-11"
          onClick={onBack}
        >
          Class Select par Wapas Jaao
        </Button>
      </main>

      <footer className="text-center py-4 text-muted-foreground text-xs border-t border-border/40">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Built with ♥ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
