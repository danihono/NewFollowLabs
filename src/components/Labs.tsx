import { FadeUp } from "./FadeUp";
import { motion } from "motion/react";
import { FlaskConical, BarChart3, Settings2, Zap } from "lucide-react";

export const Labs = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background visual cues */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <FadeUp>
            <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 block">Metodologia</span>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">
              Experimentação <span className="text-serif-italic">contínua</span>. Resultado consistente.
            </h2>
          </FadeUp>
          
          <div className="space-y-8">
            {[
              { icon: FlaskConical, title: "Testes", desc: "Hipóteses validadas em ambientes controlados antes da escala." },
              { icon: BarChart3, title: "Dados", desc: "Coleta granular de cada interação para extrair inteligência real." },
              { icon: Settings2, title: "Ajustes", desc: "Otimização em tempo real baseada em performance e comportamento." },
              { icon: Zap, title: "Evolução", desc: "Um sistema que aprende e se torna mais eficiente a cada ciclo." }
            ].map((item, i) => (
              <FadeUp key={i} delay={0.1 * i} className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-accent">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <div className="relative aspect-square">
          <div className="absolute inset-0 liquid-glass rounded-[40px] overflow-hidden">
            {/* Animated system flow simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border border-accent/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.5],
                      opacity: [0.5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 1
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent rounded-full blur-2xl opacity-20 animate-pulse" />
                  <FlaskConical className="w-12 h-12 text-accent relative z-10" />
                </div>
              </div>
            </div>
            
            {/* Flow lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <motion.path
                d="M50,50 Q250,150 450,50"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-accent"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
              <motion.path
                d="M50,450 Q250,350 450,450"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-accent"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
