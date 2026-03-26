import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
        </div>
        <span className="text-lg font-semibold tracking-tighter uppercase">FollowLabs</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Home</a>
        <a href="#" className="hover:text-foreground transition-colors">Soluções</a>
        <a href="#" className="hover:text-foreground transition-colors">Labs</a>
        <a href="#" className="hover:text-foreground transition-colors">Casos</a>
        <a href="#" className="hover:text-foreground transition-colors">Contato</a>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Search className="w-4 h-4" />
        </Button>
        <Button className="hidden md:flex bg-white text-black hover:bg-white/90 rounded-full px-6">
          Começar
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </motion.nav>
  );
};
