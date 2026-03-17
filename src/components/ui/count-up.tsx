import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
};

export function CountUp({
  to,
  duration = 1.2,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setValue(to);
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, shouldReduceMotion, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}