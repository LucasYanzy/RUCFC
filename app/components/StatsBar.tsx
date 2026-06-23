"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";

interface StatProps {
  end: number;
  suffix?: string;
  labelKey: string;
}

function AnimatedStat({ end, suffix = "", labelKey }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const { t } = useLang();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">
        {count}
        <span className="accent">{suffix}</span>
      </div>
      <div className="stat-label">{t(labelKey)}</div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid reveal-stagger">
          <AnimatedStat end={15} suffix="+" labelKey="stat.members" />
          <AnimatedStat end={3} suffix="+" labelKey="stat.workshops" />
          <AnimatedStat end={5} suffix="+" labelKey="stat.speakers" />
          <AnimatedStat end={1} suffix="st" labelKey="stat.first" />
        </div>
      </div>
    </section>
  );
}
