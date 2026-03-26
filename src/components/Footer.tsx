export const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <div className="w-3 h-3 bg-accent rounded-sm rotate-45" />
          </div>
          <span className="text-sm font-semibold tracking-tighter uppercase">FollowLabs</span>
        </div>

        <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>

        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          © 2026 FOLLOWLABS
        </div>
      </div>
    </footer>
  );
};
