import { FadeUp } from "./FadeUp";
import { motion } from "motion/react";
import { Database, TrendingUp, Layers } from "lucide-react";

const MarketCard = ({ icon: Icon, title, description, delay }: any) => (
  <FadeUp delay={delay} className="liquid-glass p-8 rounded-3xl group hover:border-accent/30 transition-colors">
    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-medium mb-4">{title}</h3>
    <p className="text-muted-foreground leading-relaxed text-sm">
      {description}
    </p>
  </FadeUp>
);

export const MarketShift = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight max-w-2xl mx-auto">
          O crescimento mudou. <span className="text-serif-italic">Seu sistema acompanhou?</span>
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MarketCard 
          icon={Database}
          title="Decisões sem dados"
          description="A intuição não é mais suficiente. Sistemas modernos exigem validação empírica para cada movimento estratégico."
          delay={0.1}
        />
        <MarketCard 
          icon={TrendingUp}
          title="Crescimento inconsistente"
          description="Picos seguidos de quedas. Construímos motores de crescimento previsíveis que operam em ciclos de feedback contínuo."
          delay={0.2}
        />
        <MarketCard 
          icon={Layers}
          title="Processos sem estrutura"
          description="Escalar o caos só gera mais caos. Implementamos infraestrutura tecnológica que evolui com a sua demanda."
          delay={0.3}
        />
      </div>
    </section>
  );
};
