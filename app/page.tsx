"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { LangProvider, useLang } from "./components/LangProvider";
import NewsletterForm from "./components/NewsletterForm";
import Globe from "./components/Globe";
import { JOIN_URL, DISCORD_INVITE, LINKEDIN_URL } from "./lib/links";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M5 12h14m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}
function Brand() {
  return (
    <span className="brand">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>
        RUCFC<span className="brand-period">.</span>
      </span>
    </span>
  );
}
function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
function ProgramVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="toolkit-visual" aria-hidden="true">
        <div className="visual-topline">
          <span>THE TOOLKIT</span>
          <span>01 — 03</span>
        </div>
        <div className="tool-row">
          <span className="tool-icon">⌘</span>
          <span>AI in Finance</span>
          <span>↗</span>
        </div>
        <div className="tool-row">
          <span className="tool-icon">B</span>
          <span>Bloomberg Terminal</span>
          <span>↗</span>
        </div>
        <div className="tool-row">
          <span className="tool-icon">↗</span>
          <span>BMC & ESG</span>
          <span>↗</span>
        </div>
      </div>
    );
  if (index === 1)
    return (
      <div className="conversation-visual" aria-hidden="true">
        <div className="visual-topline">
          <span>CHINA IN CONTEXT</span>
          <span>↗</span>
        </div>
        <svg viewBox="0 0 360 150" fill="none">
          <path d="M0 75h360" stroke="currentColor" opacity=".12" />
          {Array.from({ length: 39 }, (_, i) => (
            <path
              key={i}
              className="wave-line"
              d={`M${9 + i * 9} ${75 - (Math.sin(i * 0.52) ** 2 * 44 + 6)}v${(Math.sin(i * 0.52) ** 2 * 44 + 6) * 2}`}
              stroke="currentColor"
              strokeWidth="2"
              style={{ animationDelay: `${i * 55}ms` }}
            />
          ))}
        </svg>
        <div className="visual-footline">
          <span>MARKETS</span>
          <span>TECHNOLOGY</span>
          <span>CULTURE</span>
        </div>
      </div>
    );
  return (
    <div className="network-visual" aria-hidden="true">
      <div className="visual-topline">
        <span>BUILT ON CONNECTION</span>
        <span>↗</span>
      </div>
      <svg viewBox="0 0 360 176" fill="none">
        <path
          d="m66 86 57-47 112 8 58 58-68 34-104-4ZM66 86l114 0 55-39M123 39l57 47 45 53M121 135l59-49 113 19"
          stroke="currentColor"
          opacity=".2"
        />
        {[
          [66, 86],
          [123, 39],
          [235, 47],
          [293, 105],
          [225, 139],
          [121, 135],
        ].map(([x, y]) => (
          <g key={x}>
            <circle
              cx={x}
              cy={y}
              r="12"
              fill="var(--surface)"
              stroke="currentColor"
              strokeOpacity=".25"
            />
            <circle cx={x} cy={y} r="2" fill="currentColor" />
          </g>
        ))}
        <circle
          cx="180"
          cy="86"
          r="28"
          fill="var(--surface)"
          stroke="currentColor"
          strokeOpacity=".4"
        />
        <text
          x="180"
          y="90"
          fill="currentColor"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
        >
          RUCFC
        </text>
      </svg>
    </div>
  );
}

function Website() {
  const { lang, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const c = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selected, setSelected] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const motionOff = paused || reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motionOff ? "off" : "on";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [motionOff]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => navObserver.observe(el));
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      navObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    document.body.classList.add("menu-open");
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const nodes = Array.from(
          header.current?.querySelectorAll<HTMLElement>(
            "a[href],button:not([disabled])",
          ) ?? [],
        ).filter((el) => el.getClientRects().length > 0);
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const resize = () => {
      if (innerWidth > 820) setMenuOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);

  const programs = [
    {
      name: c("把 AI 用于真实分析", "Put AI into practice"),
      short: c("AI 与金融实践", "AI & finance"),
      label: "PRACTICE",
      description: c(
        "探索 AI 在金融研究与商业工作中的实际应用。",
        "Explore AI tools for financial research, market analysis, and business.",
      ),
      detail: c(
        "结合彭博终端、BMC / ESG 学习资源，通过实操工作坊探索 AI 在金融研究、市场分析和日常商业工作中的应用。理解工具的能力与局限，把课堂知识带入真实问题。",
        "Explore AI tools for financial research, market analysis, and everyday business work through practical workshops. Work with Bloomberg Terminal and BMC / ESG learning resources, and understand both the possibilities and limits of these tools.",
      ),
      tags: ["AI in Finance", "Bloomberg Terminal", "BMC / ESG"],
    },
    {
      name: c("读懂市场背后的逻辑", "Understand the landscape"),
      short: c("中国市场与商业文化", "Chinese markets & culture"),
      label: "UNDERSTAND",
      description: c(
        "理解中国科技产业、企业竞争与跨文化合作。",
        "Discover China’s technology industries, competition, and business culture.",
      ),
      detail: c(
        "从中国 AI 与科技企业的案例出发，讨论产业布局、竞争格局及其对全球市场的影响。结合中国商业文化，帮助希望跨境创业或参与企业运营的同学建立背景知识。",
        "Use case studies of Chinese AI and technology companies to understand the industry landscape, competition, and global market impact. Explore Chinese business culture and build context for entrepreneurship and business operations across borders.",
      ),
      tags: [
        c("AI 与科技", "AI & technology"),
        c("企业竞争", "Competitive landscape"),
        c("跨文化商业", "Business across cultures"),
      ],
    },
    {
      name: c("连接行业，探索下一步", "Connect with what’s next"),
      short: c("行业连接与职业探索", "Connections & careers"),
      label: "CONNECT",
      description: c(
        "在校友与从业者的经验中，探索跨境职业方向。",
        "Explore careers across borders through alumni and practitioner perspectives.",
      ),
      detail: c(
        "通过校友与从业者分享、同伴交流和机会资讯，了解与中国市场相关的职业路径。连接 Rutgers 社群，一起交流学习、求职与跨文化工作的经验。",
        "Explore career paths connected to Chinese markets through alumni and practitioner conversations, peer exchange, and opportunity updates. Share learning, recruiting, and cross-cultural work experiences with the Rutgers community.",
      ),
      tags: [
        c("校友与行业交流", "Alumni & industry"),
        c("职业资讯", "Career insights"),
        c("同伴连接", "Peer connection"),
      ],
    },
  ];
  const nav = [
    { id: "about", name: c("关于我们", "Our story") },
    { id: "programs", name: c("项目与活动", "Programs") },
    { id: "join", name: c("加入社群", "Community") },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        {c("跳到主要内容", "Skip to content")}
      </a>
      <header
        className={`site-header ${menuOpen ? "menu-is-open" : ""}`}
        ref={header}
      >
        <div className="nav-shell container">
          <a
            className="brand-link"
            href="#hero"
            aria-label="RUCFC"
            onClick={() => setMenuOpen(false)}
          >
            <Brand />
          </a>
          <nav
            className={`nav-links ${menuOpen ? "open" : ""}`}
            id="navigation"
            aria-label={c("主导航", "Main navigation")}
          >
            {nav.map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#newsletter"
              className="mobile-newsletter"
              onClick={() => setMenuOpen(false)}
            >
              {c("订阅邮件", "Newsletter")}
              <Arrow />
            </a>
          </nav>
          <div className="nav-actions">
            <button
              className="language-button"
              onClick={toggleLang}
              aria-label={c("切换为英文", "Switch to Chinese")}
            >
              {lang === "zh" ? "EN" : "中"}
            </button>
            <button
              className="theme-button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? c("切换浅色模式", "Switch to light mode")
                  : c("切换深色模式", "Switch to dark mode")
              }
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {theme === "dark" ? (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" />
                  </>
                ) : (
                  <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
                )}
              </svg>
            </button>
            <External
              href={JOIN_URL}
              className="button button-small button-outline nav-join"
            >
              {c("成为会员", "Become a member")}
              <Arrow diagonal />
            </External>
            <button
              className={`menu-button ${menuOpen ? "open" : ""}`}
              ref={menuButton}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="navigation"
              aria-label={
                menuOpen
                  ? c("关闭菜单", "Close menu")
                  : c("打开菜单", "Open menu")
              }
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="reading-progress" ref={progress} />
      </header>
      {menuOpen && (
        <button
          className="menu-backdrop"
          aria-label={c("关闭导航菜单", "Close navigation")}
          onClick={() => {
            setMenuOpen(false);
            menuButton.current?.focus();
          }}
        />
      )}
      <main id="main">
        <section className="hero container" id="hero">
          <div className="hero-copy">
            <a href="#join" className="announcement">
              <span className="announcement-dot" />
              {c("2026 秋季 · 创始成员招募", "Fall 2026 · The founding cohort")}
              <Arrow />
            </a>
            <h1>
              {c("从中国市场，", "Understand China.")}
              <br />
              <span>{c("看全球商业。", "Think globally.")}</span>
            </h1>
            <p className="hero-description">
              {c(
                "中国的 AI 与科技发展，正在影响全球市场。\n在 Rutgers，一起理解趋势、动手实践、探索职业方向。",
                "Explore how China’s AI and technology advances shape global markets. Build practical skills and explore career paths at Rutgers.",
              )}
            </p>
            <div className="hero-newsletter" id="newsletter">
              <h2>
                {c(
                  "让下一次机会，先到你的邮箱。",
                  "Your next opportunity. In your inbox.",
                )}
              </h2>
              <NewsletterForm />
              <p className="newsletter-caption">
                {c(
                  "AI 实操工作坊、中国市场洞察与职业资讯。",
                  "AI workshops, Chinese market insights, and career updates.",
                )}
              </p>
            </div>
            <div className="hero-actions">
              <External href={JOIN_URL}>
                {c("成为创始成员", "Become a founding member")}
                <Arrow diagonal />
              </External>
              <span />
              <a href="#programs">
                {c("探索我们的项目", "Explore programs")}
                <Arrow />
              </a>
            </div>
            <p className="hero-welcome">
              {c(
                "面向所有 Rutgers 学生，无需中文或金融背景。",
                "Open to all Rutgers students. No Chinese language skills or finance background required.",
              )}
            </p>
          </div>
          <div className="hero-world">
            <div className="world-caption">
              <span>LOCAL ROOTS. GLOBAL REACH.</span>
              <span className="world-plus">+</span>
            </div>
            <div className="globe-stage">
              <Globe paused={motionOff} />
            </div>
            <div className="world-footer">
              <div>
                <span className="world-dot" />
                <span>
                  NEW BRUNSWICK <span className="world-divider">↔</span> THE
                  WORLD
                </span>
              </div>
              <button
                className="motion-button"
                aria-pressed={motionOff}
                disabled={reducedMotion}
                onClick={() => setPaused(!paused)}
                aria-label={
                  motionOff
                    ? c("播放动态效果", "Play animations")
                    : c("暂停动态效果", "Pause animations")
                }
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {motionOff ? (
                    <path d="m4 2 6 4-6 4Z" />
                  ) : (
                    <path d="M3 2h2v8H3zm4 0h2v8H7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="hero-baseline">
            <span>
              {c("罗格斯华人金融社团", "Rutgers Chinese Finance Club")}
            </span>
            <span>
              {c("面向所有 Rutgers 学生", "Open to all Rutgers students")}
            </span>
            <span>
              {c(
                "始于 2026，未来未设限。",
                "Founded in 2026. Built for what’s next.",
              )}
            </span>
          </div>
        </section>
        <section className="about container section" id="about">
          <div className="section-label" data-reveal>
            <span>01</span>
            {c("我们的出发点", "Our starting point")}
          </div>
          <div className="about-layout">
            <h2 data-reveal>
              {c("中国视角。", "A lens on China.")}
              <br />
              <span>{c("读懂全球商业。", "A global perspective.")}</span>
            </h2>
            <div className="about-description" data-reveal>
              <p>
                {c(
                  "从人工智能到科技产业，中国市场的变化正在影响全球企业、投资与竞争。理解这些发展，也需要理解背后的产业布局和商业文化。",
                  "From artificial intelligence to technology industries, developments in China are shaping global business, investment, and competition. Understanding these changes means understanding the industry landscape and business culture behind them.",
                )}
              </p>
              <p>
                {c(
                  "RUCFC 为 Rutgers 学生提供认识中国科技与商业市场的视角。通过 AI 与金融实践、企业案例、行业交流和跨文化连接，把新的认识用于学习、职业探索与未来的跨境创业。",
                  "RUCFC gives Rutgers students a perspective on China’s technology and business markets. Through AI and finance workshops, company case studies, industry conversations, and cross-cultural connections, we turn that perspective into practical learning, career exploration, and a foundation for entrepreneurship across borders.",
                )}
              </p>
              <a className="text-link" href="#programs">
                {c("了解我们在做什么", "Discover what we do")}
                <Arrow />
              </a>
            </div>
          </div>
          <div className="principles" data-reveal>
            <div>
              <span className="principle-mark">↗</span>
              <div>
                <h3>{c("立足实践", "Practical from day one")}</h3>
                <p>
                  {c(
                    "让课堂知识走向真实应用。",
                    "Turn what you learn into what you can do.",
                  )}
                </p>
              </div>
            </div>
            <div>
              <span className="principle-mark">◎</span>
              <div>
                <h3>{c("保持开放", "Open by nature")}</h3>
                <p>
                  {c(
                    "面向所有专业，无需中文或金融背景。",
                    "All majors welcome. No Chinese fluency or finance experience needed.",
                  )}
                </p>
              </div>
            </div>
            <div>
              <span className="principle-mark">↔</span>
              <div>
                <h3>{c("一起向前", "Better together")}</h3>
                <p>
                  {c(
                    "彼此支持，走出更远的路。",
                    "Find support for the journey ahead.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="programs section container" id="programs">
          <div className="section-label" data-reveal>
            <span>02</span>
            {c("把好奇变成行动", "Put curiosity into motion")}
          </div>
          <div className="section-heading" data-reveal>
            <h2>{c("为你的下一步而设计。", "Built for your next step.")}</h2>
            <p>
              {c(
                "AI 工具、中国市场与职业连接。\n把新的视角，用于你的下一步。",
                "Practical AI. Chinese markets. Career connections.\nBring a new perspective to your next step.",
              )}
            </p>
          </div>
          <div className="desktop-programs" data-reveal>
            <div
              className="program-grid"
              role="tablist"
              aria-label={c("项目介绍", "Explore programs")}
            >
              {programs.map((item, i) => (
                <button
                  key={item.label}
                  className={`program-card ${selected === i ? "selected" : ""}`}
                  role="tab"
                  id={`program-tab-${i}`}
                  aria-controls="program-panel"
                  aria-selected={selected === i}
                  tabIndex={selected === i ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(event) => {
                    let next = i;
                    if (event.key === "ArrowRight") next = (i + 1) % 3;
                    else if (event.key === "ArrowLeft") next = (i + 2) % 3;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = 2;
                    else return;
                    event.preventDefault();
                    setSelected(next);
                    document.getElementById(`program-tab-${next}`)?.focus();
                  }}
                >
                  <div className="program-label">
                    <span>
                      0{i + 1} / {item.label}
                    </span>
                    <Arrow diagonal />
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <ProgramVisual index={i} />
                  <span className="program-bottom">
                    {item.short}
                    <span>{selected === i ? "−" : "+"}</span>
                  </span>
                </button>
              ))}
            </div>
            <div
              className="program-panel"
              role="tabpanel"
              tabIndex={0}
              id="program-panel"
              aria-labelledby={`program-tab-${selected}`}
            >
              <div className="panel-copy" key={selected}>
                <h3>{programs[selected].short}</h3>
                <p>{programs[selected].detail}</p>
                <div className="tags">
                  {programs[selected].tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <External className="text-link" href={JOIN_URL}>
                {c("一起参与", "Be part of it")}
                <Arrow diagonal />
              </External>
            </div>
          </div>
          <div className="mobile-programs" data-reveal>
            {programs.map((item, i) => (
              <details
                key={item.label}
                name="mobile-programs"
                open={i === 0 ? true : undefined}
              >
                <summary>
                  <span className="mobile-program-index">0{i + 1}</span>
                  <div>
                    <span>{item.label}</span>
                    <h3>{item.short}</h3>
                  </div>
                  <span className="detail-toggle">+</span>
                </summary>
                <div className="mobile-program-body">
                  <h4>{item.name}</h4>
                  <p>{item.detail}</p>
                  <div className="tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <External className="text-link" href={JOIN_URL}>
                    {c("一起参与", "Be part of it")}
                    <Arrow diagonal />
                  </External>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section className="join section container" id="join">
          <div className="section-label" data-reveal>
            <span>03</span>
            {c("第一章，邀请你一起写", "Help write the first chapter")}
          </div>
          <div className="join-layout">
            <div className="join-copy" data-reveal>
              <h2>
                {c("有你，", "There’s a place")}
                <br />
                <span>{c("才是我们的未来。", "for you here.")}</span>
              </h2>
              <p>
                {c(
                  "无论你对金融、AI、创业还是跨文化商业感到好奇，这里都有你的位置。欢迎所有专业与文化背景的 Rutgers 学生一起参与。",
                  "Whether you are curious about finance, AI, entrepreneurship, or business across cultures, there is a place for you here. Rutgers students of every major and cultural background are welcome.",
                )}
              </p>
              <div className="community-links">
                <External href={DISCORD_INVITE}>
                  <span className="social-icon">#</span>
                  <span>
                    <strong>Discord</strong>
                    <small>{c("加入日常交流", "Join the conversation")}</small>
                  </span>
                  <Arrow diagonal />
                </External>
                <External href={LINKEDIN_URL}>
                  <span className="social-icon linkedin">in</span>
                  <span>
                    <strong>LinkedIn</strong>
                    <small>{c("关注社团动态", "Follow our journey")}</small>
                  </span>
                  <Arrow diagonal />
                </External>
              </div>
            </div>
            <div className="membership" data-reveal>
              <div className="membership-head">
                <Brand />
                <span>MEMBERSHIP / 2026</span>
              </div>
              <div className="membership-center">
                <span className="membership-edition">THE FOUNDING CHAPTER</span>
                <div className="membership-wordmark" aria-hidden="true">
                  RUCFC<span>.</span>
                </div>
                <span className="membership-location">
                  RUTGERS UNIVERSITY · NEW BRUNSWICK
                </span>
              </div>
              <div className="membership-bottom">
                <h3>{c("成为创始成员。", "Become a founding member.")}</h3>
                <p>
                  {c(
                    "面向所有 Rutgers 学生，无需中文或金融背景。",
                    "Open to all Rutgers students. No Chinese language skills or finance background required.",
                  )}
                </p>
                <External href={JOIN_URL} className="button button-primary">
                  {c("填写入会申请", "Apply for membership")}
                  <Arrow diagonal />
                </External>
                <small>
                  {c(
                    "大约 1 分钟，开启你的下一步。",
                    "About a minute to take your next step.",
                  )}
                </small>
              </div>
            </div>
          </div>
        </section>
        <section className="closing container" data-reveal>
          <div>
            <span>STAY CURIOUS. STAY CONNECTED.</span>
            <h2>
              {c(
                "下一次连接，从这里发生。",
                "Good things start with a connection.",
              )}
            </h2>
          </div>
          <a href="#newsletter" className="button button-outline">
            {c("订阅 RUCFC 邮件", "Get the RUCFC newsletter")}
            <Arrow />
          </a>
        </section>
      </main>
      <footer className="footer container">
        <div className="footer-top">
          <a href="#hero" aria-label="RUCFC">
            <Brand />
          </a>
          <p>
            {c("跨越文化，连接未来。", "Bridging cultures. Advancing futures.")}
          </p>
          <a
            href="#hero"
            className="back-top"
            aria-label={c("返回顶部", "Back to top")}
          >
            ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rutgers Chinese Finance Club</span>
          <span>NEW BRUNSWICK, NEW JERSEY</span>
          <div>
            <External href={DISCORD_INVITE}>Discord</External>
            <External href={LINKEDIN_URL}>LinkedIn</External>
          </div>
        </div>
      </footer>
    </>
  );
}
export default function Home() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Website />
      </LangProvider>
    </ThemeProvider>
  );
}
