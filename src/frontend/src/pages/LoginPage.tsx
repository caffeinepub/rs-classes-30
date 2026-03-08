import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  BookOpen,
  Eye,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginPageProps {
  onLoginSuccess: (phone: string, name: string) => void;
}

// Step 1: phone + name
// Step 2: show OTP (display only)
// Step 3: enter OTP input

type Step = "details" | "showOtp" | "enterOtp";

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("details");
  const [sentOtp, setSentOtp] = useState<string>("");

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Apna naam likhein");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("10-digit phone number daalo");
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(newOtp);
    setStep("showOtp");
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.length < 4) {
      toast.error("OTP daalo");
      return;
    }
    if (otp.trim() === sentOtp) {
      toast.success("Login successful!");
      onLoginSuccess(phone.trim(), name.trim());
    } else {
      toast.error("OTP galat hai. Dobara try karein.");
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
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
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
        {/* Logo + Branding */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow"
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
            className="text-5xl sm:text-6xl font-display font-black hero-text-shadow mb-2"
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

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {(["details", "showOtp", "enterOtp"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background:
                    step === s
                      ? "oklch(0.65 0.19 45)"
                      : s === "details" ||
                          (s === "showOtp" &&
                            (step === "showOtp" || step === "enterOtp")) ||
                          (s === "enterOtp" && step === "enterOtp")
                        ? "oklch(0.55 0.15 45 / 70%)"
                        : "oklch(1 0 0 / 20%)",
                  color: "white",
                }}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className="w-6 h-0.5 rounded"
                  style={{
                    background:
                      (s === "details" &&
                        (step === "showOtp" || step === "enterOtp")) ||
                      (s === "showOtp" && step === "enterOtp")
                        ? "oklch(0.65 0.19 45 / 80%)"
                        : "oklch(1 0 0 / 20%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          {/* Step 1: Phone + Name */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 shadow-card-hover"
              style={{
                background: "oklch(1 0 0 / 97%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-1">
                Login karein
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Phone number aur naam darj karein
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      data-ocid="login.phone_input"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="pl-9 text-base font-mono"
                      autoComplete="tel"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="student-name" className="text-sm font-medium">
                    Student Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="student-name"
                      data-ocid="login.name_input"
                      type="text"
                      placeholder="Apna naam likhein"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 text-base"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <Button
                  data-ocid="login.send_otp_button"
                  type="submit"
                  className="w-full font-semibold h-11 bg-brand-saffron hover:bg-brand-saffron/90 text-white"
                >
                  Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Show OTP */}
          {step === "showOtp" && (
            <motion.div
              key="showOtp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 shadow-card-hover"
              style={{
                background: "oklch(1 0 0 / 97%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-1">
                Aapka OTP
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Neeche diya gaya OTP yaad kar lein ya likh lein
              </p>

              {/* Big OTP display */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl p-6 text-center mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.95 0.08 85), oklch(0.92 0.1 60))",
                  border: "2px solid oklch(0.65 0.19 45)",
                }}
                data-ocid="login.otp_display_card"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Eye className="h-5 w-5 text-amber-700" />
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-800">
                    Aapka Demo OTP
                  </p>
                </div>
                <p className="text-5xl font-mono font-extrabold tracking-[0.35em] text-amber-900 my-2">
                  {sentOtp}
                </p>
                <p className="text-xs text-amber-700/80 mt-2">
                  Phone: +91 {phone}
                </p>
              </motion.div>

              <Button
                data-ocid="login.proceed_to_enter_otp_button"
                type="button"
                className="w-full font-semibold h-11 bg-brand-saffron hover:bg-brand-saffron/90 text-white"
                onClick={() => setStep("enterOtp")}
              >
                OTP dekh liya, aage badho{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm text-muted-foreground mt-2"
                onClick={() => {
                  setStep("details");
                  setSentOtp("");
                }}
              >
                Wapas jaayein
              </Button>
            </motion.div>
          )}

          {/* Step 3: Enter OTP */}
          {step === "enterOtp" && (
            <motion.div
              key="enterOtp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 shadow-card-hover"
              style={{
                background: "oklch(1 0 0 / 97%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-lg font-display font-bold text-foreground mb-1">
                OTP verify karein
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Abhi dikha hua OTP neeche daalo
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    OTP daalo
                  </Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      data-ocid="login.otp_input"
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="pl-9 text-base font-mono tracking-widest"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      autoFocus
                    />
                  </div>
                </div>
                <Button
                  data-ocid="login.verify_button"
                  type="submit"
                  className="w-full font-semibold h-11 bg-brand-indigo hover:bg-brand-indigo/90 text-white"
                >
                  Verify & Login
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => setStep("showOtp")}
                >
                  OTP dobara dekho
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

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
      </div>
    </div>
  );
}
