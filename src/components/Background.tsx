import { motion } from "motion/react";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 9) % 100}%`,
  top: `${(index * 23 + 11) % 100}%`,
  duration: 12 + (index % 5) * 2.2,
  delay: (index % 6) * 1.1,
  drift: -40 - (index % 4) * 18,
  opacity: 0.22 + (index % 5) * 0.08,
}));

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500">
      <div className="ambient-glow absolute inset-0" />

      <div
        className="absolute left-[8%] top-[6%] h-[24rem] w-[24rem] rounded-full blur-[120px]"
        style={{ background: "rgba(232, 175, 72, 0.12)" }}
      />
      <div
        className="absolute bottom-[-12%] right-[-8%] h-[28rem] w-[28rem] rounded-full blur-[140px]"
        style={{ background: "rgba(119, 155, 255, 0.12)" }}
      />
      <div
        className="absolute bottom-[8%] left-[50%] h-[18rem] w-[32rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "rgba(232, 175, 72, 0.08)" }}
      />

      <div className="grain-overlay pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.28) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.18))",
        }}
      />

      <div className="absolute inset-0 opacity-35">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-1 w-1 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              backgroundColor: "rgba(var(--accent-rgb), 0.78)",
              boxShadow: "0 0 14px rgba(var(--accent-rgb), 0.32)",
            }}
            initial={{ opacity: particle.opacity, y: 0 }}
            animate={{
              y: [0, particle.drift],
              opacity: [particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50">
        <motion.path
          d="M-80,280 C180,60 420,510 1280,180"
          strokeWidth="0.7"
          fill="none"
          style={{ stroke: "rgba(var(--accent-rgb), 0.28)" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M-120,640 C280,860 600,360 1380,760"
          strokeWidth="0.7"
          fill="none"
          style={{ stroke: "rgba(141, 178, 255, 0.2)" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </svg>
    </div>
  );
};
