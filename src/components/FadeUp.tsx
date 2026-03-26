import { motion } from "motion/react";
import { ReactNode, Key } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  key?: Key;
}

export const FadeUp = ({ children, delay = 0, className = "" }: FadeUpProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
