import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

// Data e hora do evento em Recife/PE (UTC-3).
const EVENT_DATE = new Date("2026-06-10T16:00:00-03:00");

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const CountBlock = ({
  value,
  label,
  mounted,
}: {
  value: number;
  label: string;
  mounted: boolean;
}) => (
  <div className="flex flex-col items-center">
    <div className="flex h-9 w-9 items-center justify-center rounded bg-black/30 font-mono text-sm font-black tabular-nums text-white">
      {mounted ? String(value).padStart(2, "0") : "--"}
    </div>
    <span className="mt-0.5 font-ui text-[0.42rem] uppercase tracking-widest text-white/60">
      {label}
    </span>
  </div>
);

export function EventCountdown() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(calcTimeLeft());
    const id = window.setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const isOver = mounted && EVENT_DATE.getTime() <= Date.now();
  const units = [
    { label: "DIAS", value: time.days },
    { label: "HRS", value: time.hours },
    { label: "MIN", value: time.minutes },
    { label: "SEG", value: time.seconds },
  ];

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] flex h-12 items-center justify-center gap-3 bg-[#dc2626] px-4 sm:gap-5">
      <Flame className="h-3.5 w-3.5 shrink-0 text-white/80" />
      <span className="font-ui text-[0.58rem] font-black uppercase tracking-[0.22em] text-white">
        {isOver ? "Evento encerrado" : "Vagas encerrando em:"}
      </span>
      {!isOver && (
        <div className="flex items-end gap-1">
          {units.map(({ label, value }, i) => (
            <div key={label} className="flex items-end gap-1">
              <CountBlock value={value} label={label} mounted={mounted} />
              {i < units.length - 1 && (
                <span className="mb-4 font-mono text-xs font-black text-white/35">:</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventCountdown;
