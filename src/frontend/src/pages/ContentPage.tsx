import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Loader2,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  Send,
  Video,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AppHeader from "../components/AppHeader";
import {
  ContentType,
  useGetContent,
  useGetMyDoubts,
  useGetQuiz,
  useSubmitDoubt,
} from "../hooks/useQueries";

interface ContentPageProps {
  phone: string;
  selectedClass: bigint;
  selectedSubjectId: bigint;
  selectedSubjectName: string;
  mode: ContentType | "doubt";
  onBack: () => void;
  onLogout: () => void;
}

const MODE_META: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  [ContentType.liveClass]: {
    label: "Live Class",
    icon: Video,
    color: "from-red-500 to-pink-600",
  },
  [ContentType.recordedClass]: {
    label: "Recorded Class",
    icon: PlayCircle,
    color: "from-blue-500 to-indigo-600",
  },
  [ContentType.quiz]: {
    label: "Quiz",
    icon: HelpCircle,
    color: "from-amber-500 to-orange-600",
  },
  [ContentType.pdfNotes]: {
    label: "PDF Notes",
    icon: FileText,
    color: "from-green-500 to-emerald-600",
  },
  doubt: {
    label: "Doubt",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-600",
  },
};

export default function ContentPage({
  phone,
  selectedClass,
  selectedSubjectId,
  selectedSubjectName,
  mode,
  onBack,
  onLogout,
}: ContentPageProps) {
  const meta = MODE_META[mode] || MODE_META[ContentType.liveClass];
  const Icon = meta.icon;

  const contentType = mode === "doubt" ? null : (mode as ContentType);
  const { data: contentList, isLoading: contentLoading } = useGetContent(
    contentType !== null ? selectedClass : null,
    contentType !== null ? selectedSubjectId : null,
    contentType,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader onLogout={onLogout} onBack={onBack} showBack />

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${
            mode === ContentType.liveClass
              ? "oklch(0.55 0.2 15) 0%, oklch(0.5 0.22 340)"
              : mode === ContentType.recordedClass
                ? "oklch(0.5 0.18 250) 0%, oklch(0.4 0.2 270)"
                : mode === ContentType.quiz
                  ? "oklch(0.6 0.18 70) 0%, oklch(0.55 0.2 45)"
                  : mode === ContentType.pdfNotes
                    ? "oklch(0.5 0.18 162) 0%, oklch(0.45 0.2 185)"
                    : "oklch(0.5 0.2 285) 0%, oklch(0.42 0.2 310)"
          } 100%)`,
        }}
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-xs font-mono uppercase tracking-widest mb-1">
              Class {selectedClass.toString()} · {selectedSubjectName}
            </p>
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {meta.label}
              </h2>
            </div>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <main className="container mx-auto px-4 py-6 flex-1 max-w-lg">
        {mode === "doubt" ? (
          <DoubtSection
            phone={phone}
            selectedClass={selectedClass}
            selectedSubjectId={selectedSubjectId}
            selectedSubjectName={selectedSubjectName}
          />
        ) : mode === ContentType.quiz ? (
          <QuizSection
            contentList={contentList ?? []}
            isLoading={contentLoading}
            selectedClass={selectedClass}
            selectedSubjectId={selectedSubjectId}
          />
        ) : (
          <GenericContentList
            contentList={contentList ?? []}
            isLoading={contentLoading}
            mode={mode}
          />
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

// ─── Generic Content List ──────────────────────────────────────────────────────

interface ContentItem {
  id: bigint;
  title: string;
  link: string;
  description: string;
}

function GenericContentList({
  contentList,
  isLoading,
  mode,
}: {
  contentList: ContentItem[];
  isLoading: boolean;
  mode: ContentType;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="content.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return (
      <div data-ocid="content.empty_state" className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
          {mode === ContentType.liveClass && (
            <Video className="h-8 w-8 text-muted-foreground" />
          )}
          {mode === ContentType.recordedClass && (
            <PlayCircle className="h-8 w-8 text-muted-foreground" />
          )}
          {mode === ContentType.pdfNotes && (
            <FileText className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="font-display font-bold text-lg mb-2">No Content Yet</h3>
        <p className="text-sm text-muted-foreground">
          Content will be added by your teacher soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contentList.map((item, idx) => (
        <motion.div
          key={item.id.toString()}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-muted-foreground">
                {idx + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-sm text-foreground mb-0.5 truncate">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.description}
                </p>
              )}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                {mode === ContentType.pdfNotes ? (
                  <>
                    <Download className="h-3 w-3" /> Download / View PDF
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-3 w-3" /> Open Link
                  </>
                )}
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Quiz Section ──────────────────────────────────────────────────────────────

function QuizSection({
  contentList,
  isLoading,
}: {
  contentList: ContentItem[];
  isLoading: boolean;
  selectedClass: bigint;
  selectedSubjectId: bigint;
}) {
  const [selectedContentId, setSelectedContentId] = useState<bigint | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="quiz.loading_state">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return (
      <div data-ocid="quiz.empty_state" className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2">No Quizzes Yet</h3>
        <p className="text-sm text-muted-foreground">
          Your teacher hasn&apos;t added any quizzes yet.
        </p>
      </div>
    );
  }

  if (selectedContentId !== null) {
    return (
      <QuizPlayer
        contentId={selectedContentId}
        onBack={() => setSelectedContentId(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Choose a quiz to start:
      </p>
      {contentList.map((item, idx) => (
        <motion.button
          key={item.id.toString()}
          data-ocid={`quiz.item.${idx + 1}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          whileHover={{ x: 4 }}
          onClick={() => setSelectedContentId(item.id)}
          className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover text-left group transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm text-foreground">
              {item.title}
            </div>
            {item.description && (
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                {item.description}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            Start
          </Badge>
        </motion.button>
      ))}
    </div>
  );
}

function QuizPlayer({
  contentId,
  onBack,
}: { contentId: bigint; onBack: () => void }) {
  const { data: quiz, isLoading } = useGetQuiz(contentId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function handleSubmit() {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === Number(q.correctOption)) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  }

  if (isLoading) {
    return (
      <div data-ocid="quiz.loading_state" className="space-y-4">
        <Skeleton className="h-8 w-1/2 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div data-ocid="quiz.error_state" className="text-center py-12">
        <p className="text-muted-foreground">
          Quiz not found. The teacher hasn&apos;t added questions yet.
        </p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg text-foreground">
          {quiz.title}
        </h3>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-xs">
          ← Back
        </Button>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background:
                score >= quiz.questions.length / 2
                  ? "oklch(0.55 0.18 162 / 15%)"
                  : "oklch(0.55 0.2 15 / 15%)",
            }}
          >
            {score >= quiz.questions.length / 2 ? (
              <CheckCircle2 className="h-10 w-10 text-brand-green" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <h3 className="text-2xl font-display font-bold mb-1">
            {score}/{quiz.questions.length}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            {score >= quiz.questions.length
              ? "Perfect Score! 🎉"
              : score >= quiz.questions.length / 2
                ? "Well Done! Keep it up!"
                : "Keep practicing! You'll do better next time."}
          </p>

          <div className="space-y-3 text-left mb-6">
            {quiz.questions.map((q, idx) => {
              const isCorrect = answers[idx] === Number(q.correctOption);
              return (
                <div
                  key={q.text || `result-q-${idx}`}
                  className={`p-3 rounded-xl border text-sm ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <p className="font-semibold mb-1 text-foreground">{q.text}</p>
                  <p
                    className={`text-xs ${isCorrect ? "text-green-700" : "text-red-700"}`}
                  >
                    {isCorrect
                      ? "✓ Correct"
                      : `✗ Your answer: ${q.options[answers[idx]] ?? "Not answered"}`}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-green-700 mt-0.5">
                      Correct: {q.options[Number(q.correctOption)]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="w-full"
          >
            Try Again
          </Button>
        </motion.div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {quiz.questions.map((q, idx) => (
              <div
                key={q.text || `q-${idx}`}
                data-ocid={`quiz.item.${idx + 1}`}
                className="bg-card rounded-xl border border-border p-4 shadow-card"
              >
                <p className="font-semibold text-sm text-foreground mb-3">
                  <span className="text-muted-foreground">Q{idx + 1}. </span>
                  {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      type="button"
                      key={opt || `opt-${optIdx}`}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [idx]: optIdx }))
                      }
                      className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all ${
                        answers[idx] === optIdx
                          ? "bg-primary/10 border-primary/50 text-primary font-semibold"
                          : "border-border hover:border-primary/30 hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <span className="text-muted-foreground mr-2 font-mono text-xs">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            data-ocid="quiz.submit_button"
            onClick={handleSubmit}
            className="w-full h-11 font-bold bg-brand-saffron hover:bg-brand-saffron/90 text-white"
            disabled={Object.keys(answers).length < quiz.questions.length}
          >
            Submit Quiz
          </Button>
          {Object.keys(answers).length < quiz.questions.length && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Answer all {quiz.questions.length} questions to submit
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Doubt Section ─────────────────────────────────────────────────────────────

function DoubtSection({
  phone,
  selectedClass,
  selectedSubjectId,
  selectedSubjectName,
}: {
  phone: string;
  selectedClass: bigint;
  selectedSubjectId: bigint;
  selectedSubjectName: string;
}) {
  const [doubtText, setDoubtText] = useState("");
  const submitDoubt = useSubmitDoubt();
  const { data: myDoubts, isLoading: doubtsLoading } = useGetMyDoubts(phone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doubtText.trim()) return;
    try {
      await submitDoubt.mutateAsync({
        phone,
        classNumber: selectedClass,
        subjectId: selectedSubjectId,
        subjectName: selectedSubjectName,
        doubtText: doubtText.trim(),
      });
      toast.success("Doubt submitted! Teacher will reply soon.");
      setDoubtText("");
    } catch {
      toast.error("Failed to submit doubt. Please try again.");
    }
  }

  const relevantDoubts =
    myDoubts?.filter(
      (d) => d.subjectId.toString() === selectedSubjectId.toString(),
    ) ?? [];

  return (
    <div className="space-y-6">
      {/* Submit form */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand-saffron" />
          Ask a Doubt
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            data-ocid="doubt.textarea"
            placeholder={`Type your doubt about ${selectedSubjectName}...`}
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            rows={4}
            className="text-sm resize-none"
          />
          <Button
            data-ocid="doubt.submit_button"
            type="submit"
            className="w-full font-semibold bg-brand-saffron hover:bg-brand-saffron/90 text-white"
            disabled={submitDoubt.isPending || !doubtText.trim()}
          >
            {submitDoubt.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Doubt
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Previous doubts */}
      <div>
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          My Previous Doubts
          {relevantDoubts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {relevantDoubts.length}
            </Badge>
          )}
        </h3>

        {doubtsLoading ? (
          <div data-ocid="doubt.loading_state" className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : relevantDoubts.length === 0 ? (
          <div
            data-ocid="doubt.empty_state"
            className="text-center py-8 text-muted-foreground text-sm"
          >
            No doubts submitted for this subject yet.
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {relevantDoubts.map((doubt, idx) => (
                <motion.div
                  key={doubt.id.toString()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-xl border border-border p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-foreground flex-1">
                      {doubt.doubtText}
                    </p>
                    <Badge
                      variant={doubt.reply ? "default" : "secondary"}
                      className={`text-[10px] shrink-0 ${doubt.reply ? "bg-green-100 text-green-700 border-green-200" : ""}`}
                    >
                      {doubt.reply ? "Answered" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    {new Date(
                      Number(doubt.timestamp) / 1_000_000,
                    ).toLocaleDateString("en-IN")}
                  </div>
                  {doubt.reply && (
                    <div className="mt-2 pl-3 border-l-2 border-brand-saffron/50 bg-muted/40 rounded-r-lg py-2 pr-3">
                      <p className="text-[10px] font-bold text-brand-saffron uppercase tracking-wide mb-1">
                        Teacher&apos;s Reply
                      </p>
                      <p className="text-sm text-foreground">{doubt.reply}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
