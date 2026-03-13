import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Hash } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const APP_CODE = "RS302030";

interface JoinCodePageProps {
  onCodeVerified: () => void;
}

export default function JoinCodePage({ onCodeVerified }: JoinCodePageProps) {
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entered = code.trim().toUpperCase();
    if (entered === APP_CODE) {
      onCodeVerified();
    } else {
      toast.error("Galat code! Sahi 8-digit class code daalo.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.22 0.08 268) 0%, oklch(0.35 0.12 268) 50%, oklch(0.28 0.1 290) 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
        style={{
          background: "oklch(0.65 0.19 45)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{
          background: "oklch(0.6 0.16 265)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.19 45), oklch(0.55 0.22 30))",
              }}
            >
              <img
                src="/assets/generated/rs-classes-logo-transparent.dim_200x200.png"
                alt="RS Classes 30"
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-display font-black mb-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 75), oklch(1 0 0) 60%, oklch(0.85 0.12 80))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 16px oklch(0.65 0.19 45 / 60%))",
            }}
          >
            RS Classes 30
          </h1>
          <p
            className="text-lg sm:text-xl font-semibold font-body mb-1"
            style={{ color: "oklch(0.82 0.18 75)" }}
          >
            by Siwachan Sir
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <BookOpen className="h-4 w-4 text-brand-saffron" />
            <span className="text-white/70 text-sm font-semibold">
              For Classes 1 – 12
            </span>
          </div>
        </motion.div>

        {/* Code Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-6 shadow-card-hover"
          style={{
            background: "oklch(1 0 0 / 97%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.95 0.08 85)" }}
            >
              <Hash className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                Class Code Daalo
              </h2>
              <p className="text-xs text-muted-foreground">
                8-digit code enter karein aur join karein
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-3 mt-4 mb-4 text-center"
            style={{
              background: "oklch(0.97 0.04 85)",
              border: "1px dashed oklch(0.75 0.1 80)",
            }}
          >
            <p className="text-xs text-amber-700/70 font-medium uppercase tracking-wider mb-1">
              App ka Class Code
            </p>
            <p className="text-3xl font-mono font-black tracking-[0.25em] text-amber-900">
              RS302030
            </p>
            <p className="text-xs text-amber-700/60 mt-1">
              Yeh code apne students ko share karein
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="join.code_input"
                type="text"
                placeholder="8-digit code daalo (e.g. RS302030)"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.toUpperCase().slice(0, 8))
                }
                className="pl-9 text-base font-mono tracking-widest text-center uppercase"
                autoComplete="off"
                autoFocus
                maxLength={8}
              />
            </div>
            <Button
              data-ocid="join.submit_button"
              type="submit"
              className="w-full font-semibold h-11 bg-brand-saffron hover:bg-brand-saffron/90 text-white"
            >
              Join RS Classes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </motion.div>

        <div className="text-center mt-6 space-y-0.5">
          <p className="text-white/80 text-[11px] font-semibold">
            Application Built by{" "}
            <span className="text-brand-saffron font-bold">Parbin Kumar</span>
          </p>
          <p className="text-white/50 text-[10px]">
            Class designed by Siwachan Sir · Graphic designed by Ankush Kumar
          </p>
        </div>
      </div>
    </div>
  );
}
