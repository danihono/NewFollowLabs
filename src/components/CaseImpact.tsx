import { FadeUp } from "./FadeUp";

export const CaseImpact = () => {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
          Impacto real, medido em <span className="text-serif-italic">crescimento</span>
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            company: "Fintech Alpha", 
            result: "+140%", 
            metric: "Aumento em LTV", 
            desc: "Reestruturação completa do funil de retenção através de modelos preditivos de churn." 
          },
          { 
            company: "SaaS Global", 
            result: "-45%", 
            metric: "Redução no CAC", 
            desc: "Otimização algorítmica de canais de aquisição e automação de lead scoring." 
          }
        ].map((item, i) => (
          <FadeUp key={i} delay={0.1 * i} className="liquid-glass p-12 rounded-[40px] flex flex-col justify-between h-[400px]">
            <div>
              <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">{item.company}</span>
              <p className="text-xl text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
            <div>
              <div className="text-6xl md:text-8xl font-medium tracking-tighter mb-2">{item.result}</div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">{item.metric}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
};
