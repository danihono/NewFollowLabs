import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Darker version of environment */}
      <div className="absolute inset-0 bg-black -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-4xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-7xl font-medium tracking-tight mb-10 leading-tight">
            Construa um sistema que <span className="text-serif-italic">cresce sozinho</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-16 text-lg group">
              Começar agora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-white/10 hover:bg-white/5">
              Agendar conversa
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
