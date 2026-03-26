import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Central Tech Element Integrated into Nature */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-video -z-10 opacity-40">
        <div className="relative w-full h-full">
          {/* Abstract system node */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 border border-accent/20 rounded-full"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-12 border border-accent/10 rounded-full"
          />
          
          {/* Glowing core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/20 blur-[60px] rounded-full" />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(0,255,255,0.8)]" 
          />
        </div>
      </div>

      <div className="max-w-4xl z-10">
        <FadeUp>
          <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-6 leading-[1.1]">
            Crescimento guiado por <span className="text-serif-italic">inteligência</span>
          </h1>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Dados, automação e experimentação contínua para escalar com precisão.
          </p>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 text-base group">
              Ver soluções
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-white/10 hover:bg-white/5">
              Falar com especialista
            </Button>
          </div>
        </FadeUp>
      </div>

      {/* Bottom atmospheric cue */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
        />
      </div>
    </section>
  );
};
