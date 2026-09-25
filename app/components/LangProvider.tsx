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
  "nav.join": { en: "Join Us", zh: "加入我们" },
  "nav.focus": { en: "Focus", zh: "关注领域" },

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

  // Home page -- the club's current focus. The Programs strings below are the
  // previous focus, still shown on /classic.
  "home.title1": { en: "From Rutgers", zh: "从罗格斯，" },
  "home.title2": { en: "to China.", zh: "到中国。" },
  "home.thesis": {
    en: "We educate and connect the Rutgers community to advanced education and opportunities to work in China.",
    zh: "我们为罗格斯社区提供前沿教育，并连接赴华深造与工作的机会。",
  },
  "home.focusLabel": { en: "Our Focus", zh: "关注领域" },
  "home.newsletterDesc": {
    en: "Events and China insights in your inbox.",
    zh: "活动与中国洞察，直接送到邮箱。",
  },

  // Route map
  "route.aria": {
    en: "Map viewed from above the North Pole, showing the shortest route from New Brunswick, New Jersey, to Shanghai.",
    zh: "从北极上空俯瞰的地图，标出从新泽西州新布朗斯维克到上海的最短航线。",
  },
  "route.nb": { en: "New Brunswick, NJ", zh: "新布朗斯维克" },
  "route.nbAlt": { en: "新布朗斯维克", zh: "New Brunswick, NJ" },
  "route.sh": { en: "Shanghai", zh: "上海" },
  "route.shAlt": { en: "上海", zh: "Shanghai" },
  "route.nbZone": { en: "", zh: "美东时间" },
  "route.shZone": { en: "UTC+8", zh: "北京时间" },
  "route.km": { en: "km", zh: "公里" },
  "route.kind": { en: "Shortest route, over the Arctic", zh: "最短航线，途经北极" },
  "route.ahead": { en: "Shanghai is {h} h ahead", zh: "上海快 {h} 小时" },
  "route.pole": { en: "North Pole", zh: "北极" },
  "route.beijing": { en: "Beijing", zh: "北京" },
  "route.shenzhen": { en: "Shenzhen", zh: "深圳" },

  // Focus -- one character each: 金 finance, 智 intelligence, 交 exchange, 链 chain.
  "focus.label": { en: "Our Focus", zh: "关注领域" },
  "focus.title": { en: "What we focus on", zh: "我们的四个方向" },
  "focus.subtitle": {
    en: "Four areas where we help Rutgers students understand China and build connections there.",
    zh: "四个方向，帮助罗格斯学生了解中国，并在那里建立联系。",
  },
  "focus.1.title": { en: "Chinese Finance", zh: "中国金融" },
  "focus.1.alt": { en: "中国金融", zh: "Chinese Finance" },
  "focus.1.gloss": { en: "jīn · gold, money", zh: "jīn" },
  "focus.1.desc": {
    en: "How China's markets, banks and capital flows work, and how they differ from Wall Street.",
    zh: "理解中国的市场、银行与资本流动，以及它们与华尔街的差异。",
  },
  "focus.2.title": { en: "AI & Innovation", zh: "人工智能与创新" },
  "focus.2.alt": { en: "人工智能与创新", zh: "AI & Innovation" },
  "focus.2.gloss": { en: "zhì · intelligence", zh: "zhì" },
  "focus.2.desc": {
    en: "China's AI and technology ecosystem, and the tools reshaping finance.",
    zh: "中国的人工智能与科技生态，以及正在重塑金融的工具。",
  },
  "focus.3.title": { en: "Exchange", zh: "交流" },
  "focus.3.alt": { en: "交流", zh: "Exchange" },
  "focus.3.gloss": { en: "jiāo · to exchange", zh: "jiāo" },
  "focus.3.desc": {
    en: "Connecting members with advanced study and work opportunities in China.",
    zh: "为会员连接在华深造与工作的机会。",
  },
  "focus.4.title": { en: "Supply Chains", zh: "供应链" },
  "focus.4.alt": { en: "供应链", zh: "Supply Chains" },
  "focus.4.gloss": { en: "liàn · chain", zh: "liàn" },
  "focus.4.desc": {
    en: "How goods, capital and data move between the U.S. and China.",
    zh: "理解商品、资本与数据如何在中美之间流动。",
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
    en: "Peers to job-hunt and study with, from across finance, economics, and business.",
    zh: "一起求职和学习的同伴，来自金融、经济与商科。",
  },

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
  "footer.thesis": {
    en: "Educating and connecting the Rutgers community to advanced education and opportunities to work in China.",
    zh: "为罗格斯社区提供前沿教育，连接赴华深造与工作的机会。",
  },
  "footer.links": { en: "Quick Links", zh: "快速链接" },
  "footer.copyright": {
    en: "© 2026 Rutgers Chinese Finance Club. All rights reserved.",
    zh: "© 2026 罗格斯华人金融社团 版权所有",
  },
  "footer.classic": { en: "Classic version", zh: "经典版页面" },
  "footer.newVersion": { en: "New version", zh: "新版页面" },

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

  // Screen readers and font fallback both key off <html lang>, which the root
  // layout hardcodes to "en".
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

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
