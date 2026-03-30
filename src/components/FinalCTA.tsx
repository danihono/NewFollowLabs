import { FadeUp } from "./FadeUp";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section id="user" className="relative overflow-hidden px-6 py-32">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(232,175,72,0.14),transparent_32%),linear-gradient(180deg,rgba(9,10,15,0.84),rgba(5,6,10,0.96))]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/6 blur-[120px]" />

      <div className="mx-auto max-w-4xl text-center">
        <FadeUp>
          <h2 className="mb-10 text-4xl leading-tight font-medium tracking-tight md:text-7xl">
            Construa um sistema que <span className="text-serif-italic">cresce sozinho</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-16 px-10 text-lg shadow-[0_26px_60px_rgba(232,175,72,0.2)]"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg">
              Agendar conversa
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
