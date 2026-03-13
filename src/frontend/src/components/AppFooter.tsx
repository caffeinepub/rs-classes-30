export default function AppFooter() {
  return (
    <footer className="w-full py-3 px-4 mt-auto border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center gap-0.5 text-center">
        <p className="text-[11px] font-semibold text-foreground/80 leading-snug">
          Application Built by{" "}
          <span className="text-brand-saffron font-bold">Parbin Kumar</span>
        </p>
        <p className="text-[10px] text-muted-foreground leading-snug">
          Class designed by{" "}
          <span className="text-foreground/70 font-medium">Siwachan Sir</span>
          {" · "}
          Graphic designed by{" "}
          <span className="text-foreground/70 font-medium">Ankush Kumar</span>
        </p>
      </div>
    </footer>
  );
}
