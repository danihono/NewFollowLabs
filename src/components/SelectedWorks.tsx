import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  { 
    slug: "automotive-motion", 
    title: "Automotive Motion", 
    image: "https://picsum.photos/seed/auto/800/600?grayscale", 
    gradient: "from-violet-500 via-fuchsia-400/60 via-indigo-500/60 to-transparent",
    span: "md:col-span-7"
  },
  { 
    slug: "urban-architecture", 
    title: "Urban Architecture", 
    image: "https://picsum.photos/seed/urban/800/600?grayscale", 
    gradient: "from-sky-500 via-blue-400/60 to-transparent",
    span: "md:col-span-5"
  },
  { 
    slug: "human-perspective", 
    title: "Human Perspective", 
    image: "https://picsum.photos/seed/human/800/600?grayscale", 
    gradient: "from-emerald-500 via-emerald-300/60 via-teal-500/60 to-transparent",
    span: "md:col-span-5"
  },
  { 
    slug: "brand-identity", 
    title: "Brand Identity", 
    image: "https://picsum.photos/seed/brand/800/600?grayscale", 
    gradient: "from-amber-500 via-amber-300/60 via-orange-500/60 to-transparent",
    span: "md:col-span-7"
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  return (
    <>
      {/* Background Image */}
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      {/* Halftone Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
        style={{ 
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '4px 4px'
        }}
      />

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

      {/* Hover State */}
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
        {/* Animated Gradient Border Pill */}
        <div className="relative p-[1px] rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent via-white to-accent animate-[spin_3s_linear_infinite]" />
          <div className="relative bg-white px-6 py-2 rounded-full flex items-center gap-2">
            <span className="text-black text-sm font-medium">
              View — <span className="font-serif italic">{project.title}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export const SelectedWorks = () => {
  return (
    <section className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted-text uppercase tracking-[0.3em] font-semibold">Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
              Featured <span className="font-serif italic">projects</span>
            </h2>
            <p className="text-muted-text text-lg font-light">
              A selection of projects I've worked on, from concept to launch.
            </p>
          </div>

          <Button 
            variant="outline" 
            className="hidden md:inline-flex rounded-full px-8 h-12 border-stroke hover:border-accent group relative overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              View all work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Gradient hover border ring effect simulated via border transition */}
          </Button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className={`group relative overflow-hidden bg-surface border border-stroke rounded-3xl aspect-[4/3] ${project.span} md:h-full`}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
