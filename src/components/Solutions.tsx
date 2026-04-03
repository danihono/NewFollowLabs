import React, { useCallback, useState } from "react";
import { FadeUp } from "./FadeUp";
import { motion } from "motion/react";
import { Cpu, BarChart, Users, Target } from "lucide-react";
import { GoldenParticleText } from "./GoldenParticleText";

const SolutionItem = ({ icon: Icon, title, desc, delay }: any) => (
  <FadeUp delay={delay} className="p-8 border-b border-white/5 md:border-r last:border-r-0">
    <Icon className="w-8 h-8 text-accent mb-6" />
    <h3 className="text-xl font-medium mb-4">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
  </FadeUp>
);

export const Solutions = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((touch.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((touch.clientY - rect.top) / rect.height) * 2 + 1,
    });
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeUp className="mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
            Soluções que <span className="text-serif-italic">evoluem</span> com seu negócio
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-white/5">
          <SolutionItem 
            icon={Cpu}
            title="Automação"
            desc="Sistemas inteligentes que eliminam gargalos operacionais e escalam processos sem aumentar o headcount."
            delay={0.1}
          />
          <SolutionItem 
            icon={BarChart}
            title="Análise de Dados"
            desc="Dashboards em tempo real e modelos preditivos que transformam ruído em decisões estratégicas claras."
            delay={0.2}
          />
          <SolutionItem 
            icon={Target}
            title="Aquisição"
            desc="Estratégias de performance multicanal focadas em ROI e LTV, otimizadas por algoritmos de aprendizado."
            delay={0.3}
          />
          <SolutionItem 
            icon={Users}
            title="Retenção"
            desc="Engajamento personalizado e automação de ciclo de vida para maximizar o valor de cada cliente conquistado."
            delay={0.4}
          />
        </div>

        {/* Cinematic visual */}
        <FadeUp delay={0.5} className="mt-20 relative aspect-[21/9] overflow-hidden">
          {/* Interactive golden particle text */}
          <div
            className="absolute inset-0 cursor-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            <GoldenParticleText
              text="FOLLOW LABS"
              mouseX={mouse.x}
              mouseY={mouse.y}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
