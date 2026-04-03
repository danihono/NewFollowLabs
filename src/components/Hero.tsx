import { FadeUp } from "./FadeUp";
import { VideoBackground } from "./VideoBackground";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative isolate h-[100svh] min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <VideoBackground
          src="/hero.mp4"
          preload="auto"
          className="absolute inset-0 h-full w-full scale-[1.22] object-cover object-center will-change-transform md:scale-[1.16]"
        />
      </div>

      <div className="relative z-10 flex h-full items-end px-6 pb-12 pt-32 md:px-12 md:pb-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl text-left drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]">
            <FadeUp>
              <span className="mb-5 inline-flex rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
                Focused growth intelligence
              </span>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="mb-6 text-5xl leading-[1.02] font-medium tracking-tight text-white md:text-7xl xl:text-8xl">
                Crescimento guiado por <span className="text-serif-italic">inteligência</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mb-10 max-w-2xl text-base font-light leading-relaxed text-white/78 md:text-xl">
                Dados, automação e experimentação contínua para escalar com precisão.
              </p>
            </FadeUp>

            <FadeUp delay={0.35}>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group h-14 px-8 text-base shadow-[0_24px_60px_rgba(232,175,72,0.22)]"
                >
                  Ver soluções
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base text-white [--button-border:rgba(255,255,255,0.18)] [--button-highlight:rgba(255,255,255,0.12)] [--button-core:linear-gradient(180deg,rgba(10,13,20,0.48),rgba(10,13,20,0.74))]"
                >
                  Falar com especialista
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/65">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-px bg-gradient-to-b from-white/80 to-transparent"
        />
      </div>
    </section>
  );
};
