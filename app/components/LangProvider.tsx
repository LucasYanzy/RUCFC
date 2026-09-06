"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "zh";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", zh: "首页" },
  "nav.programs": { en: "Programs", zh: "项目活动" },
  "nav.insights": { en: "Insights", zh: "市场洞察" },
  "nav.join": { en: "Join Us", zh: "加入我们" },

  // Hero
  "hero.badge": { en: "Founding Cohort · Fall 2026", zh: "创始成员 · 2026秋" },
  "hero.title1": { en: "Bridging Cultures,", zh: "跨越文化，" },
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

  // Programs
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
    en: "Peers to job-hunt and study with, plus regular briefings on Chinese market developments.",
    zh: "一起求职和学习的同伴，以及定期的中国市场动态简报。",
  },

  // Insights -- one header for one section. This used to be two stacked headers,
  // "Research / Chinese Market Insights" wrapped around "Market News / China & US
  // Finance Brief", the outer one being a permanent "Coming Soon" empty state.
  "insights.label": { en: "Market Insights", zh: "市场洞察" },
  "insights.title": { en: "China & US Finance Brief", zh: "中美金融简报" },
  "insights.subtitle": {
    en: "Finance headlines from China, the US, and global capital markets.",
    zh: "来自中国、美国及全球资本市场的金融要闻。",
  },
  "news.updated": { en: "Updated", zh: "更新于" },
  "news.regionFilter": { en: "Filter market news by region", zh: "按地区筛选市场新闻" },
  "news.region.All": { en: "All", zh: "全部" },
  "news.region.China": { en: "China", zh: "中国" },
  "news.region.United States": { en: "United States", zh: "美国" },
  "news.region.Global": { en: "Global", zh: "全球" },
  "news.readMore": { en: "Read story", zh: "阅读全文" },
  "news.poweredBy": { en: "News data refreshed from Finnhub during site build.", zh: "新闻数据在网站构建时由 Finnhub 刷新。" },
  "news.fallback": { en: "Preview items shown until Finnhub data is available.", zh: "Finnhub 数据可用前显示预览条目。" },

  // Join
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

  // Footer
  "footer.desc": {
    en: "Bridging Eastern and Western business cultures for Rutgers finance students since 2026.",
    zh: "自 2026 年起，为罗格斯金融学生连接东西方商业文化。",
  },
  "footer.links": { en: "Quick Links", zh: "快速链接" },
  "footer.copyright": {
    en: "© 2026 Rutgers Chinese Finance Club. All rights reserved.",
    zh: "© 2026 罗格斯华人金融社团 版权所有",
  },

  // Newsletter
  "newsletter.subscribe": { en: "Subscribe", zh: "订阅" },
  "newsletter.email": { en: "Email address", zh: "邮箱地址" },
  "newsletter.invalid": { en: "Enter a valid email address.", zh: "请输入有效邮箱地址。" },
  "newsletter.submitting": { en: "Subscribing...", zh: "订阅中..." },
  "newsletter.submittingMessage": { en: "Adding you to the newsletter list.", zh: "正在加入订阅名单。" },
  "newsletter.subscribed": { en: "Subscribed", zh: "已订阅" },
  "newsletter.success": { en: "You're on the RUCFC newsletter list.", zh: "你已加入 RUCFC 订阅名单。" },
  "newsletter.error": { en: "Subscription failed. Please try again.", zh: "订阅失败，请稍后再试。" },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  toggleLang: () => {},
  t: () => "",
});

export function useLang() {
  return useContext(LangContext);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("rucfc-lang") as Lang | null;
    if (stored === "en" || stored === "zh") {
      setLang(stored);
    }
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "zh" : "en";
    setLang(next);
    localStorage.setItem("rucfc-lang", next);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
