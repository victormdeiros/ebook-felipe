import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PerspectiveBook } from "@/components/ui/perspective-book";

interface VideoScrollHeroProps {
  videoSrc?: string;
  backgroundSrc?: string;
  foregroundSrc?: string;
  enableAnimations?: boolean;
  className?: string;
  startScale?: number;
  title?: string;
  description?: string;
  eyebrow?: string;
}

export function VideoScrollHero({
  videoSrc,
  backgroundSrc,
  foregroundSrc,
  enableAnimations = true,
  className = "",
  startScale = 0.78,
  title = "Manual do Empregador em destaque",
  description = "Role e veja a vitrine do conteúdo crescer enquanto a narrativa da seção avança.",
  eyebrow = "Felipe Lopes Advogados",
}: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [scrollScale, setScrollScale] = useState(startScale);

  useEffect(() => {
    if (!enableAnimations || shouldReduceMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = Math.max(containerHeight - windowHeight, 1);
      const progress = Math.min(scrolled / maxScroll, 1);
      const newScale = startScale + progress * (1 - startScale);
      setScrollScale(newScale);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableAnimations, shouldReduceMotion, startScale]);

  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const hasVideo = Boolean(videoSrc);

  return (
    <div className={cn("relative", className)}>
      <div ref={containerRef} className="relative h-[140vh] bg-transparent">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center">
          <div
            className="relative flex w-full items-center justify-center px-4 will-change-transform sm:px-6"
            style={{
              transform: shouldAnimate ? `scale(${scrollScale})` : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div className="relative h-[72vh] w-[94vw] max-w-[1280px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#120c0f] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.78)] sm:h-[76vh]">
              {backgroundSrc ? (
                <img
                  src={backgroundSrc}
                  alt="Apresentacao do Manual do Empregador"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              {hasVideo ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
                  <source src={videoSrc} type="video/mp4" />
                  Seu navegador nao suporta video.
                </video>
              ) : null}

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(9,6,8,0.2),rgba(9,6,8,0.8))]" />
              <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-background/80 via-background/35 to-transparent" />

              {foregroundSrc ? (
                <div className="absolute inset-y-0 right-[6%] flex items-center justify-center">
                  <PerspectiveBook
                    coverSrc={foregroundSrc}
                    title="Manual do Empregador"
                    eyebrow={eyebrow}
                    className="w-[min(34vw,20rem)]"
                  />
                </div>
              ) : null}

              <motion.div
                className="absolute inset-0 flex items-center rounded-[2rem] px-7 sm:px-10 lg:px-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="max-w-[32rem] text-white">
                  <motion.p
                    className="font-ui text-[0.68rem] tracking-[0.24em] text-wine-light"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52, duration: 0.7 }}
                  >
                    {eyebrow}
                  </motion.p>
                <motion.h2
                    className="mt-4 max-w-[10ch] font-display text-3xl font-semibold leading-[0.96] md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.8, type: "spring", stiffness: 180, damping: 24 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.p
                    className="mt-5 max-w-lg text-sm leading-relaxed text-white/78 md:text-base lg:text-lg"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.82, duration: 0.8, type: "spring", stiffness: 180, damping: 24 }}
                  >
                    {description}
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}