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
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ContentType,
  useAddAnnouncement,
  useAddContent,
  useAddQuiz,
  useAddSubject,
  useDeleteAnnouncement,
  useDeleteContent,
  useDeleteSubject,
  useGetAllDoubts,
  useGetAllStudents,
  useGetAnnouncements,
  useGetContent,
  useGetContent as useGetQuizContent,
  useGetSubjects,
  useReplyDoubt,
  useUpdateContent,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "@RS30";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminSection =
  | "dashboard"
  | "subjects"
  | "content"
  | "quiz"
  | "students"
  | "doubts"
  | "notices";

// ─── Admin Login ───────────────────────────────────────────────────────────────

function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      toast.success("Welcome, Admin!");
      onLoginSuccess();
    } else {
      setError("Galat password hai. Dobara try karein.");
      setPassword("");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
          <h2 className="text-base font-display font-bold text-foreground mb-1">
            Password se Login karein
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Admin password enter karein
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  data-ocid="admin.password_input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pl-9 pr-10 h-11 text-base"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error && (
                <p
                  data-ocid="admin.login.error_state"
                  className="text-xs text-destructive font-medium mt-1"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              data-ocid="admin.login_button"
              type="submit"
              className="w-full h-11 font-bold bg-brand-saffron hover:bg-brand-saffron/90 text-white"
              disabled={!password.trim()}
            >
              Admin Panel mein Jaiye
            </Button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} RS Classes 30
        </p>
      </motion.div>
    </div>
  );
}

// ─── Sidebar Nav Item ──────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  section: AdminSection;
  active: boolean;
  badge?: number;
  onClick: () => void;
  ocid: string;
}

function SidebarNavItem({
  icon,
  label,
  active,
  badge,
  onClick,
  ocid,
}: NavItemProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
        active
          ? "bg-brand-saffron text-white shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileNavItem({
  icon,
  label,
  active,
  badge,
  onClick,
  ocid,
}: NavItemProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-1 py-1.5 flex-1 relative transition-colors ${
        active ? "text-brand-saffron" : "text-muted-foreground"
      }`}
    >
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-saffron rounded-full" />
      )}
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[9px] font-medium leading-none">{label}</span>
    </button>
  );
}

// ─── Admin CMS Dashboard ───────────────────────────────────────────────────────

function AdminCMS({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const { data: doubts } = useGetAllDoubts();
  const pendingDoubts = doubts?.filter((d) => !d.reply).length ?? 0;

  const navItems: Array<{
    section: AdminSection;
    label: string;
    icon: React.ReactNode;
    ocid: string;
    badge?: number;
  }> = [
    {
      section: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      ocid: "admin.nav.dashboard_link",
    },
    {
      section: "subjects",
      label: "Subjects",
      icon: <BookOpen className="h-4 w-4" />,
      ocid: "admin.nav.subjects_link",
    },
    {
      section: "content",
      label: "Content",
      icon: <FileText className="h-4 w-4" />,
      ocid: "admin.nav.content_link",
    },
    {
      section: "quiz",
      label: "Quiz",
      icon: <HelpCircle className="h-4 w-4" />,
      ocid: "admin.nav.quiz_link",
    },
    {
      section: "students",
      label: "Students",
      icon: <Users className="h-4 w-4" />,
      ocid: "admin.nav.students_link",
    },
    {
      section: "doubts",
      label: "Doubts",
      icon: <MessageCircle className="h-4 w-4" />,
      ocid: "admin.nav.doubts_link",
      badge: pendingDoubts,
    },
    {
      section: "notices",
      label: "Notices",
      icon: <Bell className="h-4 w-4" />,
      ocid: "admin.nav.notices_link",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 min-h-screen sticky top-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.09 268) 0%, oklch(0.25 0.1 275) 100%)",
        }}
      >
        {/* Sidebar header */}
        <div className="px-4 py-5 border-b border-sidebar-border/50">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-lg bg-brand-saffron/90 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-sm leading-none">
                RS Classes 30
              </p>
              <p className="text-white/40 text-[10px] leading-tight mt-0.5">
                Admin CMS
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.section}
              {...item}
              active={activeSection === item.section}
              onClick={() => setActiveSection(item.section)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-sidebar-border/50">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
          <p className="text-center text-white/20 text-[10px] mt-3">
            © {new Date().getFullYear()} RS Classes 30
          </p>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <div
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-13 border-b border-border/60"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.22 0.09 268) 0%, oklch(0.30 0.1 280) 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-saffron/80 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm leading-none">
              RS Classes 30
            </p>
            <p className="text-white/40 text-[9px]">Admin CMS</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {/* Section header */}
        <div className="sticky top-0 md:top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/60 px-4 md:px-6 h-12 flex items-center">
          <h1 className="font-display font-bold text-base text-foreground capitalize">
            {activeSection === "notices"
              ? "Notices & Announcements"
              : activeSection === "dashboard"
                ? "Dashboard Overview"
                : activeSection.charAt(0).toUpperCase() +
                  activeSection.slice(1)}
          </h1>
          {activeSection === "doubts" && pendingDoubts > 0 && (
            <Badge className="ml-2 bg-red-100 text-red-700 text-[10px]">
              {pendingDoubts} pending
            </Badge>
          )}
        </div>

        <div className="px-4 md:px-6 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeSection === "dashboard" && <DashboardTab />}
              {activeSection === "subjects" && <SubjectsTab />}
              {activeSection === "content" && <ContentTab />}
              {activeSection === "quiz" && <QuizTab />}
              {activeSection === "students" && <StudentsTab />}
              {activeSection === "doubts" && <DoubtsTab />}
              {activeSection === "notices" && <NoticesTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border/60 flex items-stretch shadow-lg">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.section}
            {...item}
            active={activeSection === item.section}
            onClick={() => setActiveSection(item.section)}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const { data: students } = useGetAllStudents();
  const { data: subjects6 } = useGetSubjects(BigInt(6));
  const { data: doubts } = useGetAllDoubts();
  const { data: announcements, isLoading: annLoading } = useGetAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();

  const totalStudents = students?.length ?? 0;
  const totalSubjects = subjects6?.length ?? 0;
  const pendingDoubts = doubts?.filter((d) => !d.reply).length ?? 0;
  const totalContent = 0; // shown as stat only

  async function handleDeleteAnnouncement(id: bigint) {
    if (!confirm("Delete this notice?")) return;
    try {
      await deleteAnnouncement.mutateAsync(id);
      toast.success("Notice deleted.");
    } catch {
      toast.error("Failed to delete notice.");
    }
  }

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-700",
      iconBg: "bg-blue-100",
      ocid: "admin.dashboard.students_card",
    },
    {
      label: "Subjects (Class 6)",
      value: totalSubjects,
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-50 text-green-700",
      iconBg: "bg-green-100",
      ocid: "admin.dashboard.subjects_card",
    },
    {
      label: "Content Items",
      value: totalContent,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-purple-50 text-purple-700",
      iconBg: "bg-purple-100",
      ocid: "admin.dashboard.content_card",
    },
    {
      label: "Pending Doubts",
      value: pendingDoubts,
      icon: <MessageCircle className="h-5 w-5" />,
      color: "bg-amber-50 text-amber-700",
      iconBg: "bg-amber-100",
      ocid: "admin.dashboard.doubts_card",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-ocid={stat.ocid}
            className="bg-card border border-border rounded-xl p-4 shadow-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <span className={stat.color.split(" ")[1]}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Notices */}
      <div>
        <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Recent Notices
        </h3>
        {annLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-2">
            {[...announcements]
              .sort((a, b) => Number(b.timestamp - a.timestamp))
              .slice(0, 5)
              .map((ann) => (
                <div
                  key={ann.id.toString()}
                  className="bg-card border border-border rounded-xl p-3 flex items-start gap-3 shadow-card"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {ann.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {ann.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(
                        Number(ann.timestamp) / 1_000_000,
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No notices posted yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Subjects Tab ──────────────────────────────────────────────────────────────

function SubjectsTab() {
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [subjectName, setSubjectName] = useState("");
  const [showAllClasses, setShowAllClasses] = useState(false);
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
      {/* Add Subject Form */}
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

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide">
          {showAllClasses ? "All Classes" : `Subjects — Class ${selectedClass}`}
        </h3>
        <button
          type="button"
          onClick={() => setShowAllClasses((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
            showAllClasses
              ? "bg-brand-saffron/10 text-brand-saffron border-brand-saffron/30"
              : "bg-muted text-muted-foreground border-border hover:bg-accent"
          }`}
        >
          {showAllClasses ? "Selected class only" : "Show all classes"}
        </button>
      </div>

      {showAllClasses ? (
        <AllClassesSubjectsView onDelete={handleDelete} />
      ) : isLoading ? (
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
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-xs"
            >
              <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">
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
  );
}

function AllClassesSubjectsView({
  onDelete,
}: {
  onDelete: (id: bigint, name: string) => void;
}) {
  // Load subjects for all classes at once
  const classNums = Array.from({ length: 12 }, (_, i) => BigInt(i + 1));
  // We'll render individual class sections with lazy loading
  return (
    <div className="space-y-3">
      {classNums.map((cn) => (
        <ClassSubjectRow
          key={cn.toString()}
          classNumber={cn}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function ClassSubjectRow({
  classNumber,
  onDelete,
}: {
  classNumber: bigint;
  onDelete: (id: bigint, name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: subjects, isLoading } = useGetSubjects(
    expanded ? classNumber : null,
  );
  const hasSubjects = subjects && subjects.length > 0;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-3 bg-card hover:bg-accent/50 transition-colors text-left"
      >
        <Badge variant="secondary" className="text-[11px] font-bold shrink-0">
          Class {classNumber.toString()}
        </Badge>
        <span className="flex-1 text-sm text-muted-foreground">
          {expanded && hasSubjects
            ? `${subjects.length} subject${subjects.length !== 1 ? "s" : ""}`
            : "Click to expand"}
        </span>
        <span className="text-muted-foreground text-xs">
          {expanded ? "▲" : "▼"}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-border px-3 py-2 space-y-1.5 bg-background">
          {isLoading ? (
            <Skeleton className="h-8 w-full rounded-lg" />
          ) : hasSubjects ? (
            subjects.map((subj) => (
              <div
                key={subj.id.toString()}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
              >
                <span className="flex-1 text-sm">{subj.name}</span>
                <button
                  type="button"
                  className="text-muted-foreground/50 hover:text-destructive transition-colors"
                  onClick={() => onDelete(subj.id, subj.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-2 text-center">
              No subjects yet.
            </p>
          )}
        </div>
      )}
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

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
  const updateContent = useUpdateContent();

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

  function startEdit(item: {
    id: bigint;
    title: string;
    link: string;
    description: string;
  }) {
    setEditingId(item.id.toString());
    setEditTitle(item.title);
    setEditLink(item.link);
    setEditDescription(item.description);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: bigint, itemIdx: number) {
    try {
      await updateContent.mutateAsync({
        id,
        title: editTitle.trim(),
        link: editLink.trim(),
        description: editDescription.trim(),
      });
      toast.success("Content updated!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update content.");
    }
    // itemIdx used for data-ocid purposes
    void itemIdx;
  }

  const contentTypeLabels: Record<ContentType, string> = {
    [ContentType.liveClass]: "Live Class",
    [ContentType.recordedClass]: "Recorded Class",
    [ContentType.quiz]: "Quiz",
    [ContentType.pdfNotes]: "PDF Notes",
  };

  const contentTypeBadgeColors: Record<ContentType, string> = {
    [ContentType.liveClass]: "bg-red-100 text-red-700",
    [ContentType.recordedClass]: "bg-blue-100 text-blue-700",
    [ContentType.quiz]: "bg-purple-100 text-purple-700",
    [ContentType.pdfNotes]: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-5">
      {/* Add Content Form */}
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

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={selectedClass}
          onValueChange={(v) => {
            setSelectedClass(v);
            setSelectedSubjectId("");
          }}
        >
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
              <SelectItem key={c} value={String(c)} className="text-xs">
                Class {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            {subjects?.map((s) => (
              <SelectItem
                key={s.id.toString()}
                value={s.id.toString()}
                className="text-xs"
              >
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={contentType}
          onValueChange={(v) => setContentType(v as ContentType)}
        >
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(contentTypeLabels).map(([v, label]) => (
              <SelectItem key={v} value={v} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            {contentList.map((item, idx) => {
              const isEditing = editingId === item.id.toString();
              const markerIdx = idx + 1;
              return (
                <div
                  key={item.id.toString()}
                  className="bg-card rounded-xl border border-border shadow-xs overflow-hidden"
                >
                  {isEditing ? (
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          Editing
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${contentTypeBadgeColors[item.contentType]}`}
                        >
                          {contentTypeLabels[item.contentType]}
                        </span>
                      </div>
                      <Input
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="URL / Link"
                        value={editLink}
                        onChange={(e) => setEditLink(e.target.value)}
                        type="url"
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        className="resize-none text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          data-ocid={`admin.content.save_button.${markerIdx}`}
                          size="sm"
                          className="flex-1 bg-brand-saffron hover:bg-brand-saffron/90 text-white"
                          onClick={() => saveEdit(item.id, idx)}
                          disabled={
                            updateContent.isPending ||
                            !editTitle.trim() ||
                            !editLink.trim()
                          }
                        >
                          {updateContent.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : null}
                          Save
                        </Button>
                        <Button
                          data-ocid={`admin.content.cancel_button.${markerIdx}`}
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="font-semibold text-sm truncate">
                            {item.title}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${contentTypeBadgeColors[item.contentType]}`}
                          >
                            {contentTypeLabels[item.contentType]}
                          </span>
                        </div>
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
                          <ExternalLink className="h-2.5 w-2.5" />
                          {item.link.length > 40
                            ? `${item.link.slice(0, 40)}…`
                            : item.link}
                        </a>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          data-ocid={`admin.content.edit_button.${markerIdx}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

let _qid = 0;
function newQId() {
  _qid += 1;
  return _qid.toString();
}

function QuizTab() {
  const [selectedClass, setSelectedClass] = useState<string>("6");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<
    Array<{
      uid: string;
      text: string;
      options: string[];
      correctOption: number;
    }>
  >([{ uid: newQId(), text: "", options: ["", "", "", ""], correctOption: 0 }]);

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
      { uid: newQId(), text: "", options: ["", "", "", ""], correctOption: 0 },
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
      setQuestions([
        {
          uid: newQId(),
          text: "",
          options: ["", "", "", ""],
          correctOption: 0,
        },
      ]);
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
                key={q.uid}
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
                    key={`${q.uid}-opt-${oIdx}`}
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

// ─── Students Tab ─────────────────────────────────────────────────────────────

function StudentsTab() {
  const { data: students, isLoading } = useGetAllStudents();
  const [search, setSearch] = useState("");

  const filtered = students?.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  }

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          data-ocid="admin.students.search_input"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>
          {isLoading
            ? "Loading…"
            : `${filtered?.length ?? 0} student${(filtered?.length ?? 0) !== 1 ? "s" : ""}${search ? " found" : " registered"}`}
        </span>
      </div>

      {/* List */}
      {isLoading ? (
        <div data-ocid="admin.students.loading_state" className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div data-ocid="admin.students.list" className="space-y-2">
          {filtered.map((student, idx) => {
            const colorClass = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={student.phone}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl shadow-xs"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 ${colorClass}`}
                >
                  {getInitials(student.name) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {student.phone}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[11px] shrink-0">
                  Class {student.classNumber.toString()}
                </Badge>
              </div>
            );
          })}
        </div>
      ) : search ? (
        <div
          data-ocid="admin.students.empty_state"
          className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl"
        >
          No students found for "{search}".
        </div>
      ) : (
        <div
          data-ocid="admin.students.empty_state"
          className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl"
        >
          No students registered yet.
        </div>
      )}
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

// ─── Notices Tab ──────────────────────────────────────────────────────────────

function NoticesTab() {
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const { data: announcements, isLoading } = useGetAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;
    try {
      await addAnnouncement.mutateAsync({
        title: noticeTitle.trim(),
        message: noticeMessage.trim(),
      });
      toast.success("Notice posted!");
      setNoticeTitle("");
      setNoticeMessage("");
    } catch {
      toast.error("Failed to post notice.");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this notice?")) return;
    try {
      await deleteAnnouncement.mutateAsync(id);
      toast.success("Notice deleted.");
    } catch {
      toast.error("Failed to delete notice.");
    }
  }

  const sorted = announcements
    ? [...announcements].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="space-y-5">
      {/* Post Notice Form */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-saffron" />
          Post a Notice
        </h3>
        <form onSubmit={handlePost} className="space-y-3">
          <div>
            <Label className="text-xs mb-1.5 block">Title</Label>
            <Input
              data-ocid="admin.notices.title_input"
              placeholder="Notice title (e.g., Holiday on Monday)"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Message</Label>
            <Textarea
              data-ocid="admin.notices.textarea"
              placeholder="Write the full notice message here..."
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>
          <Button
            data-ocid="admin.notices.submit_button"
            type="submit"
            className="w-full bg-brand-saffron hover:bg-brand-saffron/90 text-white font-semibold"
            disabled={
              addAnnouncement.isPending ||
              !noticeTitle.trim() ||
              !noticeMessage.trim()
            }
          >
            {addAnnouncement.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Post Notice
          </Button>
        </form>
      </div>

      {/* Notices list */}
      <div>
        <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          All Notices ({sorted.length})
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="space-y-3">
            {sorted.map((ann, idx) => (
              <div
                key={ann.id.toString()}
                className="bg-card border border-border rounded-xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-brand-saffron/80 uppercase tracking-wide">
                        #{sorted.length - idx}
                      </span>
                      <p className="font-semibold text-sm truncate">
                        {ann.title}
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {ann.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(
                        Number(ann.timestamp) / 1_000_000,
                      ).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors shrink-0 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            No notices posted yet. Post your first notice above!
          </div>
        )}
      </div>
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

  return <AdminCMS onLogout={handleLogout} />;
}
