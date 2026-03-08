import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AppHeader from "../components/AppHeader";

interface TalkToSiwachanPageProps {
  onBack: () => void;
  studentName: string | null;
  onTalkToSir?: () => void;
  onProgress?: () => void;
}

interface Message {
  id: number;
  sender: "student" | "sir";
  text: string;
  timestamp: Date;
}

function getSimulatedResponse(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("maths") ||
    lower.includes("math") ||
    lower.includes("ganit")
  ) {
    return "Maths mein practice sabse zaroori hai! Roz ek chapter ka revision karo aur problems solve karo. Koi specific topic hai jisme help chahiye?";
  }
  if (lower.includes("science") || lower.includes("vigyan")) {
    return "Science samajhne ke liye concepts clear karo. Diagrams banao aur NCERT padhna mat bhoolna!";
  }
  if (
    lower.includes("exam") ||
    lower.includes("pariksha") ||
    lower.includes("test")
  ) {
    return "Exam ke liye time table banao. Revision important hai. Previous year questions zaroor solve karo!";
  }
  if (lower.includes("doubt")) {
    return "Doubt natural hai! App mein Doubt section mein apna sawal daalo, main personally jawab dunga.";
  }
  return "Bahut achha sawal hai! Mehnat karo, consistent raho. Padhai mein koi shortcut nahi hota. Agar koi specific topic mein help chahiye toh batao!";
}

const WELCOME_MESSAGE: Message = {
  id: 0,
  sender: "sir",
  text: "Namaste! Main Siwachan Sir hoon. Padhai mein koi bhi sawaal poochho — maths, science, ya koi bhi topic. Main madad karne ke liye yahan hoon! 📚",
  timestamp: new Date(),
};

export default function TalkToSiwachanPage({
  onBack,
  studentName,
  onTalkToSir,
  onProgress,
}: TalkToSiwachanPageProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || isTyping) return;

    const studentMsg: Message = {
      id: nextId.current++,
      sender: "student",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText("");
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const sirMsg: Message = {
        id: nextId.current++,
        sender: "sir",
        text: getSimulatedResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sirMsg]);
      setIsTyping(false);
    }, delay);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        onBack={onBack}
        showBack
        title="Talk to Siwachan Sir"
        subtitle="AI-powered study assistant"
        onTalkToSir={onTalkToSir}
        onProgress={onProgress}
      />

      {/* Chat header */}
      <div
        className="px-4 py-4 flex items-center gap-3 border-b border-border/40"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 268) 0%, oklch(0.35 0.12 268) 100%)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-glow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
          }}
        >
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-white font-display font-bold text-base leading-tight">
            Siwachan Sir
          </p>
          <p className="text-white/60 text-xs">
            {studentName
              ? `Haan ${studentName}, kya poochhhna hai?`
              : "RS Classes 30 — AI Tutor"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60 text-xs">Online</span>
        </div>
      </div>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-2xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 ${msg.sender === "student" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.sender === "sir" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
                  }}
                >
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  msg.sender === "student"
                    ? "rounded-tr-sm text-white"
                    : "rounded-tl-sm bg-card border border-border text-foreground"
                }`}
                style={
                  msg.sender === "student"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.5 0.18 265), oklch(0.42 0.2 290))",
                      }
                    : undefined
                }
              >
                {msg.sender === "sir" && (
                  <p className="text-[10px] font-bold text-brand-saffron uppercase tracking-wide mb-1">
                    Siwachan Sir
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${msg.sender === "student" ? "text-white/50 text-right" : "text-muted-foreground"}`}
                >
                  {msg.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex gap-2 items-center"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
                }}
              >
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span
                    className="w-2 h-2 rounded-full bg-brand-saffron/70 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-brand-saffron/70 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-brand-saffron/70 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="text-xs text-muted-foreground ml-1">
                    Siwachan Sir is typing…
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3">
        <form
          onSubmit={handleSend}
          className="flex gap-2 items-center max-w-2xl mx-auto"
        >
          <Input
            data-ocid="chat.input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Apna sawaal poochho…"
            className="flex-1 rounded-full border-border bg-card text-sm h-11 px-4"
            disabled={isTyping}
          />
          <Button
            data-ocid="chat.send_button"
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="h-11 w-11 rounded-full p-0 shrink-0 bg-brand-saffron hover:bg-brand-saffron/90 text-white"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          AI-simulated responses for study guidance
        </p>
      </div>
    </div>
  );
}
