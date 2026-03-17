import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: string;
};

export function SpotlightCard({ className, glow = "rgba(124, 30, 46, 0.28)", children, ...props }: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300",
        className,
      )}
      onPointerMove={handleMove}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, ${glow}, transparent 42%)`,
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}