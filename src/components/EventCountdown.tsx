"use client";

import { useEffect, useState } from "react";

// Data e hora do evento em Recife/PE (UTC-3).
const EVENT_DATE = new Date("2026-06-10T16:00:00-03:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

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

export function EventCountdown() {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(calcTimeLeft());

    const id = window.setInterval(() => {
      setTime(calcTimeLeft());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const isOver = mounted && EVENT_DATE.getTime() <= Date.now();

  const units = [
    { label: "DIAS", value: time.days },
    { label: "HORAS", value: time.hours },
    { label: "MIN", value: time.minutes },
    { label: "SEG", value: time.seconds },
  ];

  return (
    <section className="bg-gold py-6">
      <div className="container mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-12">
        {isOver ? (
          <p className="font-ui text-xs font-black tracking-[0.25em] uppercase text-black/70">
            Evento encerrado
          </p>
        ) : (
          <>
            <p className="font-ui text-xs font-black tracking-[0.25em] uppercase text-black/70">
              O evento comeca em
            </p>
            <div className="flex items-end gap-3 sm:gap-6">
              {units.map(({ label, value }, i) => (
                <div key={label} className="flex items-end gap-3">
                  <div className="text-center">
                    <p className="font-display text-5xl leading-none text-black tabular-nums">
                      {mounted ? String(value).padStart(2, "0") : "--"}
                    </p>
                    <p className="mt-1 font-ui text-[10px] font-black tracking-[0.2em] uppercase text-black/60">
                      {label}
                    </p>
                  </div>
                  {i < units.length - 1 && (
                    <span className="mb-1 font-display text-4xl text-black/40">:</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default EventCountdown;
