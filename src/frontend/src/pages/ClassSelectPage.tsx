import { motion } from "motion/react";
import AppHeader from "../components/AppHeader";

interface ClassSelectPageProps {
  phone: string;
  onClassSelect: (classNumber: bigint) => void;
  onLogout: () => void;
}

const CLASS_COLORS = [
  "from-orange-400 to-amber-500",
  "from-yellow-400 to-orange-400",
  "from-green-400 to-emerald-500",
  "from-teal-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
  "from-purple-400 to-pink-500",
  "from-pink-400 to-rose-500",
  "from-red-400 to-orange-500",
  "from-amber-400 to-yellow-500",
  "from-lime-400 to-green-500",
  "from-cyan-400 to-blue-500",
];

const ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export default function ClassSelectPage({
  phone,
  onClassSelect,
  onLogout,
}: ClassSelectPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader onLogout={onLogout} />

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 268) 0%, oklch(0.45 0.15 290) 100%)",
        }}
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              Select Your Class
            </h2>
            <p className="text-white/60 text-sm">
              Hi{phone ? ` (+91 ${phone})` : ""}! Choose your class to continue
            </p>
          </motion.div>
        </div>
        {/* wave divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        />
      </div>

      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((cls, idx) => (
            <motion.button
              key={cls}
              data-ocid={`class_select.item.${cls}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onClassSelect(BigInt(cls))}
              className="relative overflow-hidden rounded-xl p-0.5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div
                className={`w-full h-full rounded-[10px] bg-gradient-to-br ${CLASS_COLORS[idx]} flex flex-col items-center justify-center py-4 px-2`}
              >
                <span className="text-white/70 text-[10px] font-body font-medium uppercase tracking-widest mb-0.5">
                  Class
                </span>
                <span className="text-white text-2xl font-display font-black leading-none">
                  {cls}
                </span>
                <span className="text-white/60 text-[10px] font-mono mt-0.5">
                  {ROMAN[idx]}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-8">
          Choose your class to view available subjects
        </p>
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
