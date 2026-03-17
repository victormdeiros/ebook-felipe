import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type PerspectiveBookProps = {
  coverSrc: string;
  title: string;
  eyebrow?: string;
  className?: string;
  coverClassName?: string;
  progress?: MotionValue<number>;
};

export function PerspectiveBook({
  coverSrc,
  title,
  eyebrow,
  className,
  coverClassName,
  progress,
}: PerspectiveBookProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  const rotateX = useSpring(shouldReduceMotion ? 0 : 8, { stiffness: 160, damping: 18, mass: 0.45 });
  const rotateY = useSpring(shouldReduceMotion ? 0 : -14, { stiffness: 160, damping: 18, mass: 0.45 });
  const glareX = useSpring(50, { stiffness: 160, damping: 22, mass: 0.35 });
  const glareY = useSpring(24, { stiffness: 160, damping: 22, mass: 0.35 });

  const travelY = progress ? useTransform(progress, [0, 1], [0, -56]) : undefined;
  const shadowScale = progress ? useTransform(progress, [0, 1], [1, 0.86]) : undefined;

  const shine = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32), rgba(255,255,255,0.04) 22%, transparent 52%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    rotateY.set((px - 0.5) * 24);
    rotateX.set((0.5 - py) * 20);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const reset = () => {
    setIsActive(false);
    if (shouldReduceMotion) return;
    rotateX.set(8);
    rotateY.set(-14);
    glareX.set(50);
    glareY.set(24);
  };

  return (
    <div className={cn("relative [perspective:2200px]", className)}>
      <motion.div
        className="absolute inset-x-[12%] bottom-3 h-10 rounded-full bg-black/45 blur-2xl"
        style={shadowScale ? { scaleX: shadowScale } : undefined}
        aria-hidden="true"
      />

      <motion.div
        className="relative mx-auto aspect-[5/7] w-full max-w-[22rem] [transform-style:preserve-3d]"
        style={{
          rotateX,
          rotateY,
          y: travelY,
        }}
        onPointerEnter={() => setIsActive(true)}
        onPointerMove={handleMove}
        onPointerLeave={reset}
      >
        <div className="absolute inset-y-[4%] left-[5%] w-8 rounded-l-[1.4rem] bg-gradient-to-b from-white/20 via-white/10 to-black/40 [transform:rotateY(-90deg)_translateZ(1rem)]" />

        <div className="absolute inset-y-[3.5%] right-[-0.85rem] w-7 rounded-r-[1.2rem] bg-gradient-to-b from-[#f7efe5] via-[#e6d7c9] to-[#c8baa9] [transform:rotateY(90deg)_translateZ(0.9rem)]" />

        <motion.div
          className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#13090c] [transform:translateZ(1.7rem)]"
          animate={shouldReduceMotion ? undefined : { y: isActive ? -6 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={coverSrc}
            alt={title}
            className={cn("h-full w-full object-cover", coverClassName)}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-white/16 via-transparent to-black/30" />
          <motion.div className="absolute inset-0 opacity-90 mix-blend-screen" style={{ background: shine }} />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/16 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/45 to-transparent" />

          {(eyebrow || title) && (
            <div className="absolute inset-x-5 top-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
              {eyebrow ? (
                <p className="font-body text-[0.65rem] uppercase tracking-[0.32em] text-white/60">{eyebrow}</p>
              ) : null}
              <p className="mt-1 font-body text-sm font-semibold text-white/90">{title}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}