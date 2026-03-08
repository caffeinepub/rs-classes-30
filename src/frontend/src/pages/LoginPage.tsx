import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Phone, ShieldCheck, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRequestOtp, useVerifyOtp } from "../hooks/useQueries";

interface LoginPageProps {
  onLoginSuccess: (phone: string, name: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sentOtp, setSentOtp] = useState<string>("");

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    try {
      const result = await requestOtp.mutateAsync(phone.trim());
      setSentOtp(result);
      setStep("otp");
      toast.success("OTP sent! (Check console for demo OTP)");
      // In demo/dev, show the OTP
      if (result) {
        toast.info(`Demo OTP: ${result}`, { duration: 10000 });
      }
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      const valid = await verifyOtp.mutateAsync({
        phone: phone.trim(),
        otp: otp.trim(),
      });
      if (valid) {
        toast.success("Login successful!");
        onLoginSuccess(phone.trim(), name.trim());
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("Verification failed. Please try again.");
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
          <h1 className="text-3xl font-display font-extrabold text-white hero-text-shadow mb-1">
            RS Classes 30
          </h1>
          <p className="text-white/60 text-sm font-body">by Siwachan Sir</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <BookOpen className="h-3.5 w-3.5 text-brand-saffron" />
            <span className="text-white/50 text-xs">For Classes 1 – 12</span>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl p-6 shadow-card-hover"
          style={{
            background: "oklch(1 0 0 / 97%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-1">
            {step === "phone" ? "Login to Continue" : "Verify OTP"}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {step === "phone"
              ? "Enter your phone number to get started"
              : `OTP sent to +91 ${phone}`}
          </p>

          {step === "phone" ? (
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
                disabled={requestOtp.isPending}
              >
                {requestOtp.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                    OTP…
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP
                </Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    data-ocid="login.otp_input"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="pl-9 text-base font-mono tracking-widest"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                </div>
                {sentOtp && (
                  <p className="text-xs text-muted-foreground">
                    Demo mode: OTP is{" "}
                    <span className="font-mono font-bold text-brand-saffron">
                      {sentOtp}
                    </span>
                  </p>
                )}
              </div>
              <Button
                data-ocid="login.verify_button"
                type="submit"
                className="w-full font-semibold h-11 bg-brand-indigo hover:bg-brand-indigo/90 text-white"
                disabled={verifyOtp.isPending}
              >
                {verifyOtp.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
              >
                Change phone number
              </Button>
            </form>
          )}
        </motion.div>

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
