"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useLang } from "./LangProvider";

const JOIN_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSejjOl4pe0uux4EFgA-422cIIHpvoisIeId5vv1sS0zmfvwCQ/viewform?usp=header";

function TypingText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentIndex, texts]);

  return (
    <span className={className}>
      {displayed}
      <span className="typing-cursor">|</span>
    </span>
  );
}

/* ── Animated geometric mesh background ── */
function GeometricMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nodes for the mesh
    const nodes: { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.offsetWidth * dpr);
      canvas.height = Math.floor(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Reset nodes
      nodes.length = 0;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const nodeCount = reducedMotion ? 18 : window.innerWidth < 768 ? 24 : 40;
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        nodes.push({
          x, y,
          baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Soft boundary bounce
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // Gentle drift back toward base
        n.vx += (n.baseX - n.x) * 0.0001;
        n.vy += (n.baseY - n.y) * 0.0001;
      });

      // Draw connections
      const maxDist = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.fill();
      });

      if (!reducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="geo-mesh-canvas" />;
}

export default function Hero() {
  const { t, lang } = useLang();

  const typingTexts = useMemo(
    () =>
      lang === "en"
        ? ["East Meets West", "Career Success", "Global Vision", "Business Excellence"]
        : ["东西融合", "职业成功", "全球视野", "商业卓越"],
    [lang]
  );

  return (
    <section className="hero" id="hero">
      {/* Background gradient */}
      <div className="hero-bg" />

      {/* Animated geometric mesh */}
      <GeometricMesh />

      {/* Subtle grid */}
      <div className="hero-grid" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge animate-float-in">
          <span className="dot" />
          {t("hero.badge")}
        </div>

        <h1 className="animate-hero-title">
          {t("hero.title1")}
          <br />
          <span className="hero-title-accent">{t("hero.title2")}</span>
        </h1>

        {/* Typing subtitle */}
        <div className="hero-typing">
          <TypingText texts={typingTexts} className="typing-text" />
        </div>

        <p className="animate-hero-desc">{t("hero.desc")}</p>

        <div className="hero-buttons animate-hero-buttons">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {t("hero.cta1")}
            <span className="btn-arrow">→</span>
          </a>
          <a href="#programs" className="btn-secondary">
            {t("hero.cta2")}
          </a>
        </div>
      </div>
      
      {/* Minimal scroll arrow */}
      <a href="#programs" className="scroll-arrow animate-hero-buttons" aria-label="Scroll down">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}
