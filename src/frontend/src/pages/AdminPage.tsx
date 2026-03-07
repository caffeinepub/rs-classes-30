import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  MessageCircle,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AppHeader from "../components/AppHeader";
import {
  ContentType,
  useAddContent,
  useAddQuiz,
  useAddSubject,
  useAdminLogin,
  useDeleteContent,
  useDeleteSubject,
  useGetAllDoubts,
  useGetContent,
  useGetContent as useGetQuizContent,
  useGetSubjects,
  useReplyDoubt,
} from "../hooks/useQueries";

// ─── Admin Login ───────────────────────────────────────────────────────────────

function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const adminLogin = useAdminLogin();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    try {
      const ok = await adminLogin.mutateAsync(password.trim());
      if (ok) {
        toast.success("Welcome, Admin!");
        onLoginSuccess();
      } else {
        toast.error("Invalid password.");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.08 268), oklch(0.32 0.1 290))",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-glow"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
            }}
          >
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Admin Login
          </h1>
          <p className="text-white/50 text-sm">RS Classes 30 — Siwachan Sir</p>
        </div>

        <div className="bg-white/97 rounded-2xl p-6 shadow-card-hover">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-pw" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="admin-pw"
                data-ocid="admin.login_input"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                autoComplete="current-password"
              />
            </div>
            <Button
              data-ocid="admin.login_button"
              type="submit"
              className="w-full h-11 font-bold bg-brand-indigo hover:bg-brand-indigo/90 text-white"
              disabled={adminLogin.isPending}
            >
              {adminLogin.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in…
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader onLogout={onLogout} isAdmin />

      <main className="container mx-auto px-4 py-6 flex-1 max-w-2xl">
        <Tabs defaultValue="subjects">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger
              data-ocid="admin.subjects_tab"
              value="subjects"
              className="text-xs sm:text-sm"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Subjects
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.content_tab"
              value="content"
              className="text-xs sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Content
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.quiz_tab"
              value="quiz"
              className="text-xs sm:text-sm"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Quiz
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.doubts_tab"
              value="doubts"
              className="text-xs sm:text-sm"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Doubts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <SubjectsTab />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab />
          </TabsContent>
          <TabsContent value="quiz">
            <QuizTab />
          </TabsContent>
          <TabsContent value="doubts">
            <DoubtsTab />
          </TabsContent>
        </Tabs>
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

// ─── Subjects Tab ──────────────────────────────────────────────────────────────

function SubjectsTab() {
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [subjectName, setSubjectName] = useState("");
  const classNumber = BigInt(selectedClass);

  const { data: subjects, isLoading } = useGetSubjects(classNumber);
  const addSubject = useAddSubject();
  const deleteSubject = useDeleteSubject();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectName.trim()) return;
    try {
      await addSubject.mutateAsync({ classNumber, name: subjectName.trim() });
      toast.success(`Subject "${subjectName}" added!`);
      setSubjectName("");
    } catch {
      toast.error("Failed to add subject.");
    }
  }

  async function handleDelete(id: bigint, name: string) {
    if (!confirm(`Delete subject "${name}"? This cannot be undone.`)) return;
    try {
      await deleteSubject.mutateAsync(id);
      toast.success("Subject deleted.");
    } catch {
      toast.error("Failed to delete subject.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-display font-bold text-base mb-4">Add Subject</h3>
        <div className="mb-3">
          <Label className="text-sm mb-1.5 block">Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                <SelectItem key={c} value={String(c)}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            data-ocid="admin.add_subject_input"
            placeholder="Subject name (e.g., Mathematics)"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="flex-1"
          />
          <Button
            data-ocid="admin.add_subject_button"
            type="submit"
            disabled={addSubject.isPending || !subjectName.trim()}
            className="bg-brand-saffron hover:bg-brand-saffron/90 text-white shrink-0"
          >
            {addSubject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Subjects for Class {selectedClass}
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="space-y-2">
            {subjects.map((subj, idx) => (
              <div
                key={subj.id.toString()}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
              >
                <span className="text-xs text-muted-foreground font-mono w-5">
                  {idx + 1}
                </span>
                <span className="flex-1 font-medium text-sm">{subj.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(subj.id, subj.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No subjects added for Class {selectedClass} yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab() {
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.recordedClass,
  );
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const classNumber = BigInt(selectedClass);
  const { data: subjects } = useGetSubjects(classNumber);
  const subjectId = selectedSubjectId ? BigInt(selectedSubjectId) : null;
  const { data: contentList, isLoading } = useGetContent(
    classNumber,
    subjectId,
    contentType,
  );
  const addContent = useAddContent();
  const deleteContent = useDeleteContent();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId || !title.trim() || !link.trim()) return;
    try {
      await addContent.mutateAsync({
        classNumber,
        subjectId,
        contentType,
        title: title.trim(),
        link: link.trim(),
        description: description.trim(),
      });
      toast.success("Content added!");
      setTitle("");
      setLink("");
      setDescription("");
    } catch {
      toast.error("Failed to add content.");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this content item?")) return;
    try {
      await deleteContent.mutateAsync(id);
      toast.success("Content deleted.");
    } catch {
      toast.error("Failed to delete content.");
    }
  }

  const contentTypeLabels: Record<ContentType, string> = {
    [ContentType.liveClass]: "Live Class",
    [ContentType.recordedClass]: "Recorded Class",
    [ContentType.quiz]: "Quiz",
    [ContentType.pdfNotes]: "PDF Notes",
  };

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-display font-bold text-base mb-4">Add Content</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs mb-1.5 block">Class</Label>
            <Select
              value={selectedClass}
              onValueChange={(v) => {
                setSelectedClass(v);
                setSelectedSubjectId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Subject</Label>
            <Select
              value={selectedSubjectId}
              onValueChange={setSelectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-3">
          <Label className="text-xs mb-1.5 block">Content Type</Label>
          <Select
            value={contentType}
            onValueChange={(v) => setContentType(v as ContentType)}
          >
            <SelectTrigger data-ocid="admin.content_type_select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(contentTypeLabels).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <form onSubmit={handleAdd} className="space-y-2">
          <Input
            data-ocid="admin.content_title_input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            data-ocid="admin.content_url_input"
            placeholder="URL / Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            type="url"
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="resize-none text-sm"
          />
          <Button
            data-ocid="admin.add_content_button"
            type="submit"
            className="w-full bg-brand-saffron hover:bg-brand-saffron/90 text-white font-semibold"
            disabled={
              addContent.isPending ||
              !subjectId ||
              !title.trim() ||
              !link.trim()
            }
          >
            {addContent.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Content
          </Button>
        </form>
      </div>

      {/* Content list */}
      <div>
        <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          {contentTypeLabels[contentType]} — Class {selectedClass}
          {selectedSubjectId &&
            subjects?.find((s) => s.id.toString() === selectedSubjectId) &&
            ` · ${subjects.find((s) => s.id.toString() === selectedSubjectId)?.name}`}
        </h3>
        {!subjectId ? (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            Select a subject to view content
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : contentList && contentList.length > 0 ? (
          <div className="space-y-2">
            {contentList.map((item) => (
              <div
                key={item.id.toString()}
                className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />{" "}
                    {item.link.slice(0, 40)}...
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No content added yet for this selection.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────

function QuizTab() {
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<
    Array<{
      text: string;
      options: string[];
      correctOption: number;
    }>
  >([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);

  const classNumber = BigInt(selectedClass);
  const { data: subjects } = useGetSubjects(classNumber);
  const subjectId = selectedSubjectId ? BigInt(selectedSubjectId) : null;
  const { data: quizContentList } = useGetQuizContent(
    classNumber,
    subjectId,
    ContentType.quiz,
  );
  const addQuiz = useAddQuiz();

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  }

  function updateQuestion(idx: number, field: string, value: string | number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)),
    );
  }

  function updateOption(qIdx: number, oIdx: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((o, oi) => (oi === oIdx ? value : o)),
            }
          : q,
      ),
    );
  }

  function removeQuestion(idx: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContentId || !quizTitle.trim()) return;
    try {
      await addQuiz.mutateAsync({
        contentId: BigInt(selectedContentId),
        title: quizTitle.trim(),
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctOption: BigInt(q.correctOption),
        })),
      });
      toast.success("Quiz saved!");
      setQuizTitle("");
      setQuestions([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);
    } catch {
      toast.error("Failed to save quiz.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-display font-bold text-base mb-4">Build a Quiz</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs mb-1.5 block">Class</Label>
            <Select
              value={selectedClass}
              onValueChange={(v) => {
                setSelectedClass(v);
                setSelectedSubjectId("");
                setSelectedContentId("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Subject</Label>
            <Select
              value={selectedSubjectId}
              onValueChange={(v) => {
                setSelectedSubjectId(v);
                setSelectedContentId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((s) => (
                  <SelectItem key={s.id.toString()} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-3">
          <Label className="text-xs mb-1.5 block">Select Quiz Content</Label>
          <Select
            value={selectedContentId}
            onValueChange={setSelectedContentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick a quiz content item" />
            </SelectTrigger>
            <SelectContent>
              {quizContentList?.map((c) => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedContentId && (
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <Input
              placeholder="Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />

            {questions.map((q, qIdx) => (
              <div
                key={q.text || `question-${qIdx}`}
                className="border border-border rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">
                    Question {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-destructive hover:bg-destructive/10 rounded p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Question text"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
                />
                {q.options.map((opt, oIdx) => (
                  <div
                    key={opt || `q${qIdx}-opt-${oIdx}`}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctOption === oIdx}
                      onChange={() =>
                        updateQuestion(qIdx, "correctOption", oIdx)
                      }
                      className="accent-green-500"
                    />
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      value={opt}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      className="flex-1 h-8 text-sm"
                    />
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground">
                  Select the radio button for correct answer
                </p>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="w-full text-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
            </Button>

            <Button
              type="submit"
              className="w-full bg-brand-saffron hover:bg-brand-saffron/90 text-white font-semibold"
              disabled={addQuiz.isPending || !quizTitle.trim()}
            >
              {addQuiz.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Save Quiz
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Doubts Tab ───────────────────────────────────────────────────────────────

function DoubtsTab() {
  const { data: doubts, isLoading } = useGetAllDoubts();
  const [replies, setReplies] = useState<Record<string, string>>({});
  const replyDoubt = useReplyDoubt();

  async function handleReply(id: bigint, key: string) {
    const reply = replies[key];
    if (!reply?.trim()) return;
    try {
      await replyDoubt.mutateAsync({ id, reply: reply.trim() });
      toast.success("Reply sent!");
      setReplies((prev) => ({ ...prev, [key]: "" }));
    } catch {
      toast.error("Failed to send reply.");
    }
  }

  const unanswered = doubts?.filter((d) => !d.reply) ?? [];
  const answered = doubts?.filter((d) => d.reply) ?? [];

  return (
    <div className="space-y-5">
      {isLoading ? (
        <div data-ocid="admin.doubts.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {doubts?.length === 0 && (
            <div
              data-ocid="admin.doubts.empty_state"
              className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl"
            >
              No doubts submitted yet.
            </div>
          )}

          {unanswered.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({unanswered.length})
              </h3>
              <div className="space-y-3">
                {unanswered.map((doubt, idx) => {
                  const key = doubt.id.toString();
                  return (
                    <div
                      key={key}
                      className="bg-card rounded-xl border border-amber-200 p-4 shadow-card"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-[10px]">
                              Class {doubt.classNumber.toString()}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {doubt.subjectName}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {doubt.phone}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">
                            {doubt.doubtText}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(
                              Number(doubt.timestamp) / 1_000_000,
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] shrink-0 bg-amber-100 text-amber-700 border-amber-200"
                        >
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Textarea
                          data-ocid={`admin.reply_input.${idx + 1}`}
                          placeholder="Type your reply…"
                          value={replies[key] || ""}
                          onChange={(e) =>
                            setReplies((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          rows={2}
                          className="flex-1 text-sm resize-none"
                        />
                        <Button
                          data-ocid={`admin.reply_button.${idx + 1}`}
                          size="icon"
                          className="bg-brand-saffron hover:bg-brand-saffron/90 text-white shrink-0"
                          onClick={() => handleReply(doubt.id, key)}
                          disabled={
                            replyDoubt.isPending || !replies[key]?.trim()
                          }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {answered.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Answered ({answered.length})
              </h3>
              <div className="space-y-3">
                {answered.map((doubt) => (
                  <div
                    key={doubt.id.toString()}
                    className="bg-card rounded-xl border border-green-200 p-4 shadow-card opacity-80"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">
                            Class {doubt.classNumber.toString()}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {doubt.subjectName}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {doubt.phone}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {doubt.doubtText}
                        </p>
                      </div>
                      <Badge className="text-[10px] shrink-0 bg-green-100 text-green-700 border-green-200">
                        Answered
                      </Badge>
                    </div>
                    {doubt.reply && (
                      <div className="mt-2 pl-3 border-l-2 border-green-400/50 bg-green-50 rounded-r-lg py-2 pr-3">
                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide mb-0.5">
                          Your Reply
                        </p>
                        <p className="text-sm text-foreground">{doubt.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("rs_admin_logged_in") === "true";
  });

  function handleLoginSuccess() {
    sessionStorage.setItem("rs_admin_logged_in", "true");
    setIsLoggedIn(true);
  }

  function handleLogout() {
    sessionStorage.removeItem("rs_admin_logged_in");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
