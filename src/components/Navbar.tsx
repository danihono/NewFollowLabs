import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { House, MoonStar, Search, SunMedium, UserRound } from "lucide-react";

const STORAGE_KEY = "followlabs-theme";

const navItems = [
  { id: "home", label: "Home", icon: House },
  { id: "search", label: "Search", icon: Search },
  { id: "user", label: "User", icon: UserRound },
] as const;

type Theme = "dark" | "light";
type NavId = (typeof navItems)[number]["id"];

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const rootTheme = document.documentElement.dataset.theme;
  if (rootTheme === "dark" || rootTheme === "light") {
    return rootTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors and keep the in-memory theme.
  }
};

export const Navbar = () => {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [activeId, setActiveId] = useState<NavId>("home");
  const [toggleBurstKey, setToggleBurstKey] = useState(0);
  const [indicator, setIndicator] = useState({ x: 0, width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<NavId, HTMLButtonElement | null>>({
    home: null,
    search: null,
    user: null,
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const activeButton = buttonRefs.current[activeId];

      if (!container || !activeButton) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicator({
        x: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        height: buttonRect.height,
      });
    };

    const frame = window.requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextId = visibleEntry.target.id as NavId;
        if (nextId === "home" || nextId === "search" || nextId === "user") {
          setActiveId(nextId);
        }
      },
      {
        threshold: [0.25, 0.45, 0.65],
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    for (const item of navItems) {
      const section = document.getElementById(item.id);
      if (section) {
        observer.observe(section);
      }
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (targetId: NavId) => {
    setActiveId(targetId);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleThemeToggle = () => {
    setToggleBurstKey((current) => current + 1);
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-2 left-5 z-50 md:top-0"
      >
        <img
          src="/logo.png"
          alt="FollowLabs logo"
          className="h-auto w-28 object-contain drop-shadow-[0_14px_32px_rgba(0,0,0,0.28)] md:w-36"
        />
      </motion.div>

      <motion.nav
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        aria-label="Floating navigation"
      >
        <div className="pointer-events-none absolute bottom-1 h-28 w-[22rem] max-w-[calc(100vw-2rem)] toolbar-ambient sm:w-[24.5rem]" />

        <div className="floating-toolbar">
          <div className="toolbar-noise" />

          <div className="relative z-10 flex items-center gap-1.5 p-1.5 sm:gap-2 sm:p-2">
            <div ref={containerRef} className="toolbar-nav-cluster">
              {indicator.width > 0 && (
                <motion.div
                  className="toolbar-indicator"
                  animate={{
                    x: indicator.x,
                    width: indicator.width,
                    height: indicator.height,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.34, 1.2, 0.64, 1],
                  }}
                >
                  <span className="toolbar-indicator-glow" />
                  <span className="toolbar-indicator-clip">
                    <span className="toolbar-indicator-gradient" />
                  </span>
                  <span className="toolbar-indicator-plate" />
                </motion.div>
              )}

              {navItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Fragment key={item.id}>
                    <button
                      ref={(node) => {
                        buttonRefs.current[item.id] = node;
                      }}
                      type="button"
                      className="toolbar-action toolbar-action-nav"
                      data-active={activeId === item.id}
                      aria-current={activeId === item.id ? "page" : undefined}
                      onClick={() => handleNavigate(item.id)}
                    >
                      <Icon className="size-[1.05rem]" />
                      <span className="toolbar-label">{item.label}</span>
                    </button>

                    {index < navItems.length - 1 && <div className="toolbar-divider" aria-hidden="true" />}
                  </Fragment>
                );
              })}
            </div>

            <div className="toolbar-divider" aria-hidden="true" />

            <motion.div
              key={toggleBurstKey}
              initial={{ scale: 1, y: 0 }}
              animate={
                toggleBurstKey === 0
                  ? { scale: 1, y: 0 }
                  : { scale: [1, 1.25, 0.98, 1], y: [0, -5, 1, 0] }
              }
              transition={{
                duration: toggleBurstKey === 0 ? 0 : 0.68,
                times: [0, 0.32, 0.7, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20"
            >
              <button
                type="button"
                className="toolbar-action toolbar-action-theme"
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                onClick={handleThemeToggle}
              >
                <span className="relative size-5">
                  <motion.span
                    className="theme-icon"
                    animate={
                      theme === "light"
                        ? { opacity: 1, rotate: 0, scale: 1 }
                        : { opacity: 0, rotate: -70, scale: 0.45 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SunMedium className="size-[1.05rem]" />
                  </motion.span>

                  <motion.span
                    className="theme-icon"
                    animate={
                      theme === "dark"
                        ? { opacity: 1, rotate: 0, scale: 1 }
                        : { opacity: 0, rotate: 70, scale: 0.45 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <MoonStar className="size-[1.05rem]" />
                  </motion.span>
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
