"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Lang = "en" | "zh";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // ---- Navbar ----
  "nav.home": { en: "Home", zh: "首页" },
  "nav.programs": { en: "Programs", zh: "项目活动" },
  "nav.join": { en: "Join", zh: "加入" },
  "nav.joinCta": { en: "Join Us", zh: "加入我们" },

  // ---- Hero ----
  "hero.badge": { en: "Founding Cohort · Fall 2026", zh: "创始成员 · 2026 秋" },
  "hero.title1": { en: "Bridging Cultures,", zh: "跨越文化" },
  "hero.title2": { en: "Advancing Careers", zh: "驱动未来" },
  "hero.desc": {
    en: "A Rutgers finance community bridging Eastern and Western business cultures — practical skills, industry access, and a perspective on Chinese markets.",
    zh: "连接东西方商业文化的罗格斯金融社区——实用技能、行业资源，以及对中国市场的独特视角。",
  },
  "hero.cta1": { en: "Become a Member", zh: "成为会员" },
  "hero.cta2": { en: "Explore Programs", zh: "探索项目" },
  "hero.newsletter": { en: "Newsletter", zh: "邮件订阅" },
  "hero.newsletterDesc": {
    en: "Events, workshops, and Chinese market insights in your inbox.",
    zh: "活动、工作坊与中国市场洞察，直接送到邮箱。",
  },
  "hero.scroll": { en: "Scroll", zh: "向下" },

  // ---- Programs ----
  "programs.label": { en: "What We Do", zh: "我们做什么" },
  "programs.title": { en: "Our Programs & Events", zh: "项目与活动" },
  "programs.subtitle": {
    en: "Bridging the gap between coursework and how finance actually works.",
    zh: "弥合课堂知识与真实金融工作之间的差距。",
  },
  "programs.card1.title": { en: "Skill Advancement Workshops", zh: "技能进阶工作坊" },
  "programs.card1.desc": {
    en: "Bloomberg Terminal, BMC and ESG certifications, and hands-on work with AI tools in finance.",
    zh: "彭博终端、BMC 与 ESG 认证，以及 AI 工具在金融中的实操。",
  },
  "programs.card2.title": { en: "Engage with Industry Leaders", zh: "对话行业领袖" },
  "programs.card2.desc": {
    en: "Frontline practitioners on how the work actually happens — markets, careers, and current trends.",
    zh: "一线从业者讲真实的工作方式——市场、职业路径与当下趋势。",
  },
  "programs.card3.title": { en: "Build an Exclusive Community", zh: "构建精英社群" },
  "programs.card3.desc": {
    en: "Peers to job-hunt and study with, from across finance, economics, and business.",
    zh: "一起求职和学习的同伴，来自金融、经济与商科。",
  },

  // ---- Join ----
  "join.label": { en: "Join Us", zh: "加入我们" },
  "join.title": { en: "Become a Member", zh: "成为会员" },
  "join.subtitle": {
    en: "Open to all Rutgers students. No finance background required.",
    zh: "面向所有罗格斯学生开放，无需金融背景。",
  },
  "join.form": { en: "Membership Form", zh: "会员申请表" },
  "join.formNote": { en: "Takes about a minute.", zh: "大约一分钟。" },
  "join.discord": { en: "Discord", zh: "Discord" },
  "join.discordDesc": {
    en: "Day-to-day chat, event announcements, and questions.",
    zh: "日常交流、活动通知与答疑。",
  },
  "join.linkedin": { en: "LinkedIn", zh: "LinkedIn" },
  "join.linkedinDesc": {
    en: "Club updates, recruitment cycles, and career events.",
    zh: "社团动态、招新信息与职业活动。",
  },

  // ---- Footer ----
  "footer.desc": {
    en: "Bridging Eastern and Western business cultures for Rutgers finance students since 2026.",
    zh: "自 2026 年起，为罗格斯金融学生连接东西方商业文化。",
  },
  "footer.links": { en: "Quick Links", zh: "快速链接" },
  "footer.copyright": {
    en: "© 2026 Rutgers Chinese Finance Club. All rights reserved.",
    zh: "© 2026 罗格斯华人金融社团 版权所有",
  },

  // ---- Newsletter ----
  "newsletter.subscribe": { en: "Subscribe", zh: "订阅" },
  "newsletter.email": { en: "Email address", zh: "邮箱地址" },
  "newsletter.invalid": { en: "Enter a valid email address.", zh: "请输入有效邮箱地址。" },
  "newsletter.submitting": { en: "Subscribing…", zh: "订阅中…" },
  "newsletter.submittingMessage": {
    en: "Adding you to the newsletter list.",
    zh: "正在加入订阅名单。",
  },
  "newsletter.subscribed": { en: "Subscribed", zh: "已订阅" },
  "newsletter.success": {
    en: "You're on the RUCFC newsletter list.",
    zh: "你已加入 RUCFC 订阅名单。",
  },
  "newsletter.error": { en: "Subscription failed. Please try again.", zh: "订阅失败，请稍后再试。" },

  // ==================================================================
  // Reserved sections — built and translated, switched off in lib/site.ts
  // until the club supplies real numbers, dates and names.
  // ==================================================================

  // Ticker
  "ticker.items": {
    en: "Equity Research · Investment Banking · Bloomberg Terminal · China A-Shares · Private Equity · Quantitative Finance · Cross-Border M&A · ESG · Venture Capital · Risk Management",
    zh: "股票研究 · 投资银行 · 彭博终端 · 中国 A 股 · 私募股权 · 量化金融 · 跨境并购 · ESG · 风险投资 · 风险管理",
  },

  // Stats
  "stats.label": { en: "By The Numbers", zh: "数据一览" },
  "stats.title": { en: "A club built in its first year", zh: "第一年就建起来的社团" },
  "stats.1.value": { en: "120+", zh: "120+" },
  "stats.1.label": { en: "Founding members", zh: "创始会员" },
  "stats.2.value": { en: "18", zh: "18" },
  "stats.2.label": { en: "Events held", zh: "已办活动" },
  "stats.3.value": { en: "9", zh: "9" },
  "stats.4.value": { en: "3", zh: "3" },
  "stats.3.label": { en: "Partner firms", zh: "合作机构" },
  "stats.4.label": { en: "Certification tracks", zh: "认证方向" },

  // About
  "about.label": { en: "Who We Are", zh: "关于我们" },
  "about.title": { en: "Two markets, one career path", zh: "两个市场，一条职业路径" },
  "about.body1": {
    en: "Rutgers sends students into New York finance every year. Very few of them arrive able to read a Chinese filing, price cross-border risk, or explain why an A-share moves the way it does. That gap is the reason this club exists.",
    zh: "罗格斯每年都向纽约金融业输送学生，但其中很少有人能读懂中文财报、为跨境风险定价，或解释 A 股为何这样波动。这个缺口，就是社团存在的理由。",
  },
  "about.body2": {
    en: "We are not a culture club with a finance theme, and not a stock-pitch club with a Chinese name. We teach the tools, bring in the people who use them, and keep the room bilingual.",
    zh: "我们不是挂着金融名号的文化社团，也不是取了中文名的选股社团。我们教工具、请来真正在用它的人，并让这个房间保持双语。",
  },
  "about.pillar1.title": { en: "Practical first", zh: "实操优先" },
  "about.pillar1.desc": {
    en: "Every session ends with something you can put on a résumé or into a model.",
    zh: "每一场活动结束时，你都能带走可以写进简历或建进模型的东西。",
  },
  "about.pillar2.title": { en: "Bilingual by default", zh: "双语为默认" },
  "about.pillar2.desc": {
    en: "Materials in both languages, so nobody is working at half speed.",
    zh: "材料中英双语，没有人需要在语言上打折。",
  },
  "about.pillar3.title": { en: "Open to everyone", zh: "向所有人开放" },
  "about.pillar3.desc": {
    en: "No finance major, no prior background, no Chinese required.",
    zh: "不限专业、不问基础、不要求中文。",
  },

  // Timeline
  "timeline.label": { en: "This Semester", zh: "本学期" },
  "timeline.title": { en: "What's on the calendar", zh: "日程上有什么" },
  "timeline.subtitle": {
    en: "Dates and details are announced in Discord first.",
    zh: "日期与细节优先在 Discord 公布。",
  },
  "timeline.1.date": { en: "September", zh: "九月" },
  "timeline.1.title": { en: "Kickoff & Info Session", zh: "开学说明会" },
  "timeline.1.desc": {
    en: "What the club runs, how membership works, and who to talk to.",
    zh: "社团做什么、会员如何运作、可以找谁。",
  },
  "timeline.2.date": { en: "October", zh: "十月" },
  "timeline.2.title": { en: "Bloomberg Terminal Lab", zh: "彭博终端实操" },
  "timeline.2.desc": {
    en: "Hands-on session in the terminal room, working toward BMC.",
    zh: "在终端机房实操，为 BMC 认证做准备。",
  },
  "timeline.3.date": { en: "November", zh: "十一月" },
  "timeline.3.title": { en: "Industry Panel", zh: "行业圆桌" },
  "timeline.3.desc": {
    en: "Practitioners on cross-border deals and what they actually look for.",
    zh: "从业者谈跨境交易，以及他们真正看重什么。",
  },
  "timeline.4.date": { en: "December", zh: "十二月" },
  "timeline.4.title": { en: "Recruiting Workshop", zh: "求职工作坊" },
  "timeline.4.desc": {
    en: "Résumé review, behavioral prep, and spring internship timelines.",
    zh: "简历修改、行为面试准备与春季实习时间线。",
  },

  // Speakers
  "speakers.label": { en: "Past Guests", zh: "往期嘉宾" },
  "speakers.title": { en: "People who have spoken here", zh: "来这里讲过的人" },
  "speakers.subtitle": {
    en: "Placeholder entries — replace with real guests before publishing.",
    zh: "占位内容——发布前请替换为真实嘉宾。",
  },

  // FAQ
  "faq.label": { en: "Questions", zh: "常见问题" },
  "faq.title": { en: "Before you apply", zh: "申请之前" },
  "faq.q1": { en: "Do I need to speak Chinese?", zh: "需要会中文吗？" },
  "faq.a1": {
    en: "No. Everything we run is available in English, and most of our members are more comfortable in it.",
    zh: "不需要。我们的所有活动都提供英文版本，大部分成员也更习惯用英文。",
  },
  "faq.q2": { en: "Do I need a finance background?", zh: "需要金融背景吗？" },
  "faq.a2": {
    en: "No. Workshops start from the tools, not from the theory. First-years and non-business majors are welcome.",
    zh: "不需要。工作坊从工具讲起，而不是从理论讲起，欢迎大一新生和非商科专业。",
  },
  "faq.q3": { en: "Is there a membership fee?", zh: "需要会费吗？" },
  "faq.a3": {
    en: "No fee for the founding cohort. Certification exams have their own external costs.",
    zh: "创始成员免会费。认证考试本身的费用由考试机构收取。",
  },
  "faq.q4": { en: "How much time does it take?", zh: "需要投入多少时间？" },
  "faq.a4": {
    en: "One or two events a month. Members who want to run programming can put in more.",
    zh: "每月一到两次活动。想参与组织的成员可以投入更多。",
  },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (key) => key,
});

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("rucfc-lang");
    if (stored === "en" || stored === "zh") setLang(stored);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next: Lang = current === "en" ? "zh" : "en";
      localStorage.setItem("rucfc-lang", next);
      // The <html lang> attribute drives the CJK tracking corrections in
      // base.css, so it has to move with the toggle, not just at boot.
      document.documentElement.setAttribute("lang", next);
      return next;
    });
  }, []);

  const value = useMemo<LangContextType>(
    () => ({
      lang,
      toggleLang,
      t: (key: string) => translations[key]?.[lang] ?? key,
    }),
    [lang, toggleLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
