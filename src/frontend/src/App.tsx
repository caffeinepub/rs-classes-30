import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import type { ContentType } from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import ClassSelectPage from "./pages/ClassSelectPage";
import ContentPage from "./pages/ContentPage";
import LoginPage from "./pages/LoginPage";
import ModeSelectPage from "./pages/ModeSelectPage";
import ProgressPage from "./pages/ProgressPage";
import SubjectSelectPage from "./pages/SubjectSelectPage";
import TalkToSiwachanPage from "./pages/TalkToSiwachanPage";

export type AppView =
  | "login"
  | "classSelect"
  | "subjectSelect"
  | "modeSelect"
  | "content"
  | "talkToSir"
  | "progress";

export interface AppState {
  phone: string | null;
  studentName: string | null;
  selectedClass: bigint | null;
  selectedSubjectId: bigint | null;
  selectedSubjectName: string | null;
  selectedMode: ContentType | "doubt" | null;
}

const SESSION_KEY = "rs_classes_session";

function loadSession(): AppState {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        phone: data.phone ?? null,
        studentName: data.studentName ?? null,
        selectedClass:
          data.selectedClass !== null ? BigInt(data.selectedClass) : null,
        selectedSubjectId:
          data.selectedSubjectId !== null
            ? BigInt(data.selectedSubjectId)
            : null,
        selectedSubjectName: data.selectedSubjectName ?? null,
        selectedMode: data.selectedMode ?? null,
      };
    }
  } catch {
    // ignore
  }
  return {
    phone: null,
    studentName: null,
    selectedClass: null,
    selectedSubjectId: null,
    selectedSubjectName: null,
    selectedMode: null,
  };
}

function saveSession(state: AppState) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...state,
      selectedClass: state.selectedClass?.toString() ?? null,
      selectedSubjectId: state.selectedSubjectId?.toString() ?? null,
    }),
  );
}

export default function App() {
  const isAdminRoute =
    window.location.pathname === "/admin" ||
    window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        <AdminPage />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return <StudentApp />;
}

function StudentApp() {
  const [appState, setAppState] = useState<AppState>(loadSession);
  const [view, setView] = useState<AppView>(() => {
    const s = loadSession();
    if (s.phone) return "classSelect";
    return "login";
  });

  useEffect(() => {
    saveSession(appState);
  }, [appState]);

  function handleLoginSuccess(phone: string, name: string) {
    setAppState((prev) => ({ ...prev, phone, studentName: name }));
    setView("classSelect");
  }

  function handleClassSelect(classNumber: bigint) {
    setAppState((prev) => ({ ...prev, selectedClass: classNumber }));
    setView("subjectSelect");
  }

  function handleSubjectSelect(subjectId: bigint, subjectName: string) {
    setAppState((prev) => ({
      ...prev,
      selectedSubjectId: subjectId,
      selectedSubjectName: subjectName,
    }));
    setView("modeSelect");
  }

  function handleModeSelect(mode: ContentType | "doubt") {
    setAppState((prev) => ({ ...prev, selectedMode: mode }));
    setView("content");
  }

  function handleBack() {
    if (view === "subjectSelect") setView("classSelect");
    else if (view === "modeSelect") setView("subjectSelect");
    else if (view === "content") setView("modeSelect");
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAppState({
      phone: null,
      studentName: null,
      selectedClass: null,
      selectedSubjectId: null,
      selectedSubjectName: null,
      selectedMode: null,
    });
    setView("login");
  }

  function handleTalkToSir() {
    setView("talkToSir");
  }

  function handleProgress() {
    setView("progress");
  }

  return (
    <>
      {view === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {view === "classSelect" && (
        <ClassSelectPage
          phone={appState.phone!}
          onClassSelect={handleClassSelect}
          onLogout={handleLogout}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      {view === "subjectSelect" && (
        <SubjectSelectPage
          phone={appState.phone!}
          selectedClass={appState.selectedClass!}
          onSubjectSelect={handleSubjectSelect}
          onBack={() => setView("classSelect")}
          onLogout={handleLogout}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      {view === "modeSelect" && (
        <ModeSelectPage
          phone={appState.phone!}
          selectedClass={appState.selectedClass!}
          selectedSubjectName={appState.selectedSubjectName!}
          onModeSelect={handleModeSelect}
          onBack={handleBack}
          onLogout={handleLogout}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      {view === "content" && (
        <ContentPage
          phone={appState.phone!}
          selectedClass={appState.selectedClass!}
          selectedSubjectId={appState.selectedSubjectId!}
          selectedSubjectName={appState.selectedSubjectName!}
          mode={appState.selectedMode!}
          onBack={handleBack}
          onLogout={handleLogout}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      {view === "talkToSir" && (
        <TalkToSiwachanPage
          onBack={() => setView("classSelect")}
          studentName={appState.studentName}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      {view === "progress" && (
        <ProgressPage
          phone={appState.phone}
          studentName={appState.studentName}
          selectedClass={appState.selectedClass}
          onBack={() => setView("classSelect")}
          onTalkToSir={handleTalkToSir}
          onProgress={handleProgress}
        />
      )}
      <Toaster position="top-center" richColors />
    </>
  );
}
