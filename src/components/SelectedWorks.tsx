import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    slug: "automotive-motion",
    title: "Automotive Motion",
    image: "/travessia.png",
    gradient: "from-black/35 via-black/10 to-transparent",
    span: "md:col-span-7",
  },
  {
    slug: "urban-architecture",
    title: "Urban Architecture",
    image: "https://picsum.photos/seed/urban/800/600?grayscale",
    gradient: "from-sky-500 via-blue-400/60 to-transparent",
    span: "md:col-span-5",
  },
  {
    slug: "human-perspective",
    title: "Human Perspective",
    image: "https://picsum.photos/seed/human/800/600?grayscale",
    gradient: "from-emerald-500 via-emerald-300/60 via-teal-500/60 to-transparent",
    span: "md:col-span-5",
  },
  {
    slug: "brand-identity",
    title: "Brand Identity",
    image: "https://picsum.photos/seed/brand/800/600?grayscale",
    gradient: "from-amber-500 via-amber-300/60 via-orange-500/60 to-transparent",
    span: "md:col-span-7",
  },
];

const ProjectCard = ({ project }: { project: (typeof projects)[number] }) => {
  return (
    <>
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-60`}
      />

      <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-all duration-500 group-hover:opacity-100">
        <div className="relative overflow-hidden rounded-full p-[1px]">
          <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-gradient-to-r from-[#533517] via-[#feeaa5] to-[#c49746]" />
          <div className="relative flex items-center gap-2 rounded-full border border-[rgba(232,175,72,0.28)] bg-[rgba(var(--toolbar-rgb),0.76)] px-6 py-2 text-foreground backdrop-blur-xl">
            <span className="text-sm font-medium">
              View - <span className="font-serif italic">{project.title}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export const SelectedWorks = () => {
  return (
    <section id="search" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-stroke" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-text">
                Selected Work
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-medium tracking-tight md:text-6xl">
              Featured <span className="font-serif italic">projects</span>
            </h2>
            <p className="text-lg font-light text-muted-text">
              A selection of projects I&apos;ve worked on, from concept to launch.
            </p>
          </div>

          <Button variant="outline" className="group hidden h-12 px-8 md:inline-flex">
            <span className="relative z-10 flex items-center gap-2">
              View all work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-3xl border border-stroke bg-surface ${project.span} md:h-full`}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
