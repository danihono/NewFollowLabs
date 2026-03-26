import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const explorations = [
  { id: 1, title: "Celestial Planets", category: "3D Visualization", image: "https://picsum.photos/seed/planet/800/800?grayscale" },
  { id: 2, title: "ASCII Art Study", category: "Generative Art", image: "https://picsum.photos/seed/ascii/800/800?grayscale" },
  { id: 3, title: "Atmospheric Smoke", category: "Visual Effects", image: "https://picsum.photos/seed/smoke/800/800?grayscale" },
  { id: 4, title: "Abstract Cylinder", category: "3D Rendering", image: "https://picsum.photos/seed/cylinder/800/800?grayscale" },
  { id: 5, title: "Organic Waves", category: "Motion Design", image: "https://picsum.photos/seed/wave/800/800?grayscale" },
  { id: 6, title: "Geometric Cubes", category: "3D Composition", image: "https://picsum.photos/seed/cubes/800/800?grayscale" },
];

const ExplorationCard = ({ item, onClick }: { item: typeof explorations[0], onClick: () => void }) => {
  return (
    <>
      {/* Outer border frame */}
      <div className="absolute -inset-4 border border-white/10 rounded-[40px] transition-colors group-hover:border-accent/30" />
      
      {/* Main Card */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden bg-surface border border-stroke">
        {/* Image */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        {/* Blue tint overlay */}
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />

        {/* Halftone texture */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
          style={{ 
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '4px 4px'
          }}
        />

        {/* Hover Content Reveal */}
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-accent text-[10px] uppercase tracking-[0.2em] mb-2">{item.category}</span>
          <h4 className="text-lg font-medium mb-4">{item.title}</h4>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export const Explorations = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useGSAP(() => {
    // Pinned Center
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: contentRef.current,
      pinSpacing: false,
    });

    // Left Column Parallax
    gsap.fromTo(leftColRef.current, 
      { y: "10vh" },
      { 
        y: "-120vh",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      }
    );

    // Right Column Parallax
    gsap.fromTo(rightColRef.current, 
      { y: "40vh" },
      { 
        y: "-100vh",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      }
    );
  }, { scope: sectionRef });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
      {/* Layer 1: Pinned Center */}
      <div ref={contentRef} className="h-screen w-full flex items-center justify-center z-10 pointer-events-none">
        <div className="max-w-2xl text-center px-6 pointer-events-auto">
          <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 block">Explorations</span>
          <h2 className="text-4xl md:text-7xl font-medium tracking-tight mb-6">
            Visual <span className="font-serif italic">playground</span>
          </h2>
          <p className="text-muted-text text-lg font-light mb-10 max-w-lg mx-auto">
            A space for creative experiments, motion studies, and visual explorations.
          </p>
          
          <Button 
            className="rounded-full px-8 h-14 bg-transparent border border-white/10 hover:border-[#ea4c89] group transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#ea4c89] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                  <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-1.35-.415-2.73-.12-.137.028-.273.06-.408.093 1.277 1.96 1.887 3.522 2.037 3.95 1.16-1.105 1.886-2.66 2.102-4.393-.353.16-.67.317-1 .47zm-2.112 5.614c-.186-.407-.73-1.827-2.06-3.742-.403.166-.827.32-1.246.455-.097.03-.195.06-.294.088 1.27 1.548 2.355 3.47 2.612 3.948.353-.225.684-.475.988-.75zm-3.651 1.535c-.273-.472-1.455-2.553-2.856-4.23-.11.03-.22.06-.33.09-.135.034-.273.07-.413.103.462 2.1 1.035 4.456 1.202 5.182 1.04-.31 1.986-.81 2.803-1.475-.138-.225-.275-.45-.406-.67zm-5.22-4.947c.13-.03.26-.06.39-.09.155-.038.312-.08.472-.12-.43-1.88-1.305-4.14-1.623-4.893-.215.013-.436.028-.663.044-1.615.113-3.09.213-3.47.242.459 2.1 2.35 4.34 4.894 4.817zm-5.49-5.986c.415-.03 1.826-.13 3.412-.24.908-.063 1.813-.121 2.597-.16-.305-.715-1.265-2.744-2.36-4.416C4.89 7.17 3.036 9.322 2.647 11.86zm6.88-5.337c1.1 1.62 2.03 3.535 2.356 4.29.063 0 .128-.004.192-.004.614 0 1.214.036 1.8.104.118-.013.235-.027.352-.04 1.522-.17 3.81-.497 4.076-.547-1.2-1.77-3.012-3.066-5.108-3.592-.547.827-1.212 2.307-1.668 3.79z" />
                </svg>
              </div>
              <span className="text-sm font-medium">View on Dribbble</span>
              <ArrowUpRight className="w-4 h-4 text-muted-text group-hover:text-white transition-colors" />
            </div>
          </Button>
        </div>
      </div>

      {/* Layer 2: Parallax Columns */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 gap-12 md:gap-40 px-6">
          {/* Left Column */}
          <div ref={leftColRef} className="flex flex-col gap-24 pointer-events-auto">
            <div className="h-[20vh]" /> {/* Spacer */}
            {explorations.filter((_, i) => i % 2 === 0).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(item.image)}
                className="relative group cursor-pointer aspect-square max-w-[320px] w-full mx-auto"
                style={{ rotate: `${(item.id % 2 === 0 ? 1 : -1) * (1.5 + item.id % 3)}deg` }}
              >
                <ExplorationCard 
                  item={item} 
                  onClick={() => setSelectedImage(item.image)} 
                />
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div ref={rightColRef} className="flex flex-col gap-24 pointer-events-auto">
            <div className="h-[40vh]" /> {/* Spacer */}
            {explorations.filter((_, i) => i % 2 !== 0).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(item.image)}
                className="relative group cursor-pointer aspect-square max-w-[320px] w-full mx-auto"
                style={{ rotate: `${(item.id % 2 === 0 ? 1 : -1) * (1.5 + item.id % 3)}deg` }}
              >
                <ExplorationCard 
                  item={item} 
                  onClick={() => setSelectedImage(item.image)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 md:p-12 cursor-zoom-out"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 text-white hover:bg-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative aspect-[16/10] w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Exploration Detail"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
