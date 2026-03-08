import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import AppHeader from "../components/AppHeader";
import { useGetSubjects } from "../hooks/useQueries";

interface SubjectSelectPageProps {
  phone: string;
  selectedClass: bigint;
  onSubjectSelect: (subjectId: bigint, subjectName: string) => void;
  onBack: () => void;
  onLogout: () => void;
  onTalkToSir?: () => void;
  onProgress?: () => void;
}

const SUBJECT_ICONS = [
  BookOpen,
  BookMarked,
  BookOpen,
  BookMarked,
  BookOpen,
  BookMarked,
];

export default function SubjectSelectPage({
  selectedClass,
  onSubjectSelect,
  onBack,
  onLogout,
  onTalkToSir,
  onProgress,
}: SubjectSelectPageProps) {
  const { data: subjects, isLoading } = useGetSubjects(selectedClass);

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
            "linear-gradient(135deg, oklch(0.55 0.18 162) 0%, oklch(0.45 0.15 200) 100%)",
        }}
        className="relative overflow-hidden"
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-1">
              Class {selectedClass.toString()}
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Choose Subject
            </h2>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <main className="container mx-auto px-4 py-6 flex-1 max-w-lg">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="space-y-2.5">
            {subjects.map((subject, idx) => {
              const Icon = SUBJECT_ICONS[idx % SUBJECT_ICONS.length];
              return (
                <motion.button
                  key={subject.id.toString()}
                  data-ocid={`subject_select.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSubjectSelect(subject.id, subject.name)}
                  className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all text-left group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.19 45 / 15%), oklch(0.5 0.18 265 / 15%))",
                    }}
                  >
                    <Icon className="h-5 w-5 text-brand-saffron" />
                  </div>
                  <span className="flex-1 font-body font-semibold text-foreground text-sm">
                    {subject.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div data-ocid="subject_select.empty_state" className="space-y-2.5">
            {[
              { id: 0n, name: "Maths" },
              { id: 1n, name: "Science" },
            ].map((subject, idx) => {
              const Icon = SUBJECT_ICONS[idx % SUBJECT_ICONS.length];
              return (
                <motion.button
                  key={subject.id.toString()}
                  data-ocid={`subject_select.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSubjectSelect(subject.id, subject.name)}
                  className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all text-left group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.19 45 / 15%), oklch(0.5 0.18 265 / 15%))",
                    }}
                  >
                    <Icon className="h-5 w-5 text-brand-saffron" />
                  </div>
                  <span className="flex-1 font-body font-semibold text-foreground text-sm">
                    {subject.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.button>
              );
            })}
            <p className="text-center text-xs text-muted-foreground pt-2">
              Subjects added by admin will appear here
            </p>
          </div>
        )}
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
