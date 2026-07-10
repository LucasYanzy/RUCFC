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
  "nav.board": { en: "Board", zh: "执行团队" },
  "nav.join": { en: "Join Us", zh: "加入我们" },

  // Hero
  "hero.badge": { en: "Founding Cohort · Fall 2026", zh: "创始成员 · 2026秋" },
  "hero.title1": { en: "Bridging Cultures,", zh: "跨越文化，" },
  "hero.title2": { en: "Advancing Careers", zh: "驱动未来" },
  "hero.desc": {
    en: "A dynamic platform empowering Rutgers students in finance by bridging Eastern and Western business cultures. We drive career success through an inclusive community, tech-driven financial skills, and unique insights into global and Chinese markets.",
    zh: "一个赋能罗格斯大学金融学生的动态平台，连接东西方商业文化。我们通过包容的社区、科技驱动的金融技能和独特的全球与中国市场洞察，推动职业成功。",
  },
  "hero.cta1": { en: "Become a Member", zh: "成为会员" },
  "hero.cta2": { en: "Explore Programs", zh: "探索项目" },

  // Stats
  "stat.members": { en: "Active Members", zh: "活跃成员" },
  "stat.workshops": { en: "Workshops", zh: "工作坊" },
  "stat.speakers": { en: "Industry Speakers", zh: "业界嘉宾" },
  "stat.first": { en: "Chinese Finance Club", zh: "华人金融社团" },

  // Programs
  "programs.label": { en: "What We Do", zh: "我们做什么" },
  "programs.title": { en: "Our Programs & Events", zh: "项目与活动" },
  "programs.subtitle": {
    en: "Comprehensive programs designed to bridge the gap between academic knowledge and real-world finance expertise.",
    zh: "全面的项目设计，旨在弥合学术知识与真实金融经验之间的差距。",
  },
  "programs.card1.title": { en: "Skill Advancement Workshops", zh: "技能进阶工作坊" },
  "programs.card1.desc": {
    en: "Master the Bloomberg Terminal and earn BMC & ESG certifications together. Embrace cutting-edge FinTech by learning how to deploy AI agents for VibeCoding, bridging Finance and Artificial Intelligence.",
    zh: "一起掌握彭博终端并获取BMC和ESG认证。通过学习部署AI代理进行VibeCoding，拥抱前沿金融科技，连接金融与人工智能。",
  },
  "programs.card2.title": { en: "Engage with Industry Leaders", zh: "对话行业领袖" },
  "programs.card2.desc": {
    en: "Broaden your horizons as we regularly invite frontline practitioners to share real workplace insights. Go beyond textbooks to deeply understand macro markets and accurately capture cutting-edge industry trends.",
    zh: "拓展视野，我们定期邀请一线从业者分享真实职场洞察。超越课本，深入理解宏观市场，精准把握行业前沿趋势。",
  },
  "programs.card3.title": { en: "Build an Exclusive Community", zh: "构建精英社群" },
  "programs.card3.desc": {
    en: "Connect with outstanding peers for job hunting and study techniques. We regularly introduce and share Chinese Market Insights to provide you with a unique global perspective in the financial landscape.",
    zh: "与优秀同伴交流求职和学习技巧。我们定期分享中国市场洞察，为你提供独特的全球金融视角。",
  },

  // Insights
  "insights.label": { en: "Research", zh: "研究" },
  "insights.title": { en: "Chinese Market Insights", zh: "中国市场洞察" },
  "insights.subtitle": {
    en: "A unique global perspective on finance, bringing you the latest trend analysis and macroeconomic views from the Chinese market.",
    zh: "独特的全球金融视角，为您带来最新的中国市场趋势分析和宏观经济观点。",
  },
  "insights.coming": { en: "Coming Soon", zh: "即将推出" },
  "insights.comingDesc": {
    en: "Our research team is preparing exclusive market analysis and insights. Stay tuned.",
    zh: "我们的研究团队正在准备独家市场分析和洞察，敬请期待。",
  },

  // Market News
  "news.label": { en: "Market News", zh: "市场新闻" },
  "news.title": { en: "China & US Finance Brief", zh: "中美金融新闻简报" },
  "news.subtitle": {
    en: "A curated feed of finance headlines relevant to China, the United States, and global capital markets.",
    zh: "精选与中国、美国及全球资本市场相关的金融新闻标题。",
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

  // CTA
  "cta.title": { en: "Ready to Shape Your Future?", zh: "准备好塑造你的未来了吗？" },
  "cta.subtitle": {
    en: "Join a community of ambitious finance students bridging cultures and building careers together.",
    zh: "加入一个志同道合的金融学生社区，跨越文化，共同成长。",
  },

  // Board
  "board.label": { en: "Leadership", zh: "领导团队" },
  "board.title": { en: "Executive Board Members", zh: "执行委员会成员" },
  "board.subtitle": {
    en: "Meet the founding team driving RUCF's mission forward.",
    zh: "认识推动RUCF使命前进的创始团队。",
  },
  "board.founder": { en: "Founder", zh: "创始人" },
  "board.cto": { en: "CTO", zh: "首席技术官" },
  "board.vp": { en: "Vice President", zh: "副主席" },
  "board.secretary": { en: "Secretary", zh: "秘书长" },
  "board.treasurer": { en: "Treasurer", zh: "财务" },
  "board.cofounders": { en: "26Fall Cohort 1 Co-Founders", zh: "26秋季第一期联合创始人" },

  // Footer
  "footer.desc": {
    en: "Empowering Rutgers students in finance by bridging Eastern and Western business cultures since 2026.",
    zh: "自2026年起，通过连接东西方商业文化，赋能罗格斯大学金融学生。",
  },
  "footer.links": { en: "Quick Links", zh: "快速链接" },
  "footer.newsletter": { en: "Newsletter", zh: "订阅通讯" },
  "footer.newsletterDesc": {
    en: "Get the latest updates on events, workshops, and Chinese market insights.",
    zh: "获取最新活动、工作坊和中国市场洞察资讯。",
  },
  "footer.subscribe": { en: "Subscribe", zh: "订阅" },
  "footer.copyright": {
    en: "© 2026 Rutgers Chinese Finance Club. All rights reserved.",
    zh: "© 2026 罗格斯华人金融社团 版权所有",
  },

  // Newsletter
  "newsletter.email": { en: "Email address", zh: "邮箱地址" },
  "newsletter.helper": { en: "Rutgers email preferred. No spam.", zh: "建议使用 Rutgers 邮箱。我们不会发送垃圾邮件。" },
  "newsletter.invalid": { en: "Enter a valid email address.", zh: "请输入有效邮箱地址。" },
  "newsletter.submitting": { en: "Subscribing...", zh: "订阅中..." },
  "newsletter.submittingMessage": { en: "Adding you to the newsletter list.", zh: "正在加入订阅名单。" },
  "newsletter.subscribed": { en: "Subscribed", zh: "已订阅" },
  "newsletter.success": { en: "You're on the RUCF newsletter list.", zh: "你已加入 RUCF 订阅名单。" },
  "newsletter.error": { en: "Subscription failed. Please try again.", zh: "订阅失败，请稍后再试。" },

  // Discord
  "discord.label": { en: "Community", zh: "社区" },
  "discord.title": { en: "Join Our Community", zh: "加入我们的社区" },
  "discord.desc": {
    en: "Connect with members, access exclusive automation tools, and stay ahead with real-time trading signals — all in our Discord server.",
    zh: "与成员交流，获取独家自动化工具，通过实时交易信号保持领先——尽在我们的 Discord 服务器。",
  },
  "discord.join": { en: "Join Discord Server", zh: "加入 Discord 服务器" },
  "discord.period": { en: "Period", zh: "周期" },
  "discord.direction": { en: "Direction", zh: "方向" },
  "discord.feat1.title": { en: "Options Radar", zh: "期权雷达" },
  "discord.feat1.desc": {
    en: "AI-powered options flow scanner detecting unusual activity in real-time.",
    zh: "AI驱动的期权异动扫描器，实时捕捉异常交易。",
  },
  "discord.feat2.title": { en: "Stock Signal Bot", zh: "股票信号机器人" },
  "discord.feat2.desc": {
    en: "RSI, MACD and multi-indicator alerts for stocks & crypto.",
    zh: "RSI、MACD等多指标信号提醒，覆盖股票和加密货币。",
  },
  "discord.feat3.title": { en: "Community Chat", zh: "社区交流" },
  "discord.feat3.desc": {
    en: "Discuss strategies, share insights, and learn together.",
    zh: "讨论策略、分享洞察、共同学习成长。",
  },
  "discord.feat4.title": { en: "Live News Feed", zh: "实时新闻推送" },
  "discord.feat4.desc": {
    en: "Reuters & Bloomberg financial news delivered instantly to your feed.",
    zh: "路透社、彭博社财经新闻实时推送到你的频道。",
  },

  // LinkedIn
  "linkedin.label": { en: "Network", zh: "人脉社交" },
  "linkedin.title": { en: "Follow Our LinkedIn", zh: "关注我们的 LinkedIn" },
  "linkedin.desc": {
    en: "Stay updated with our professional network, recruitment cycles, panel discussions, alumni stories, and exclusive career events.",
    zh: "与我们的专业网络接轨，获取最新的招新动态、论坛讲座、校友专访以及独家职业发展活动。",
  },
  "linkedin.cta": { en: "Follow Rutgers CFC", zh: "关注 RUCF 官方账号" },
  "linkedin.followers": { en: "followers", zh: "位关注者" },
  "linkedin.following": { en: "Following", zh: "已关注" },
  "linkedin.follow": { en: "Follow", zh: "关注" },
  "linkedin.connect": { en: "Connect", zh: "建立联系" },
  "linkedin.connected": { en: "Pending", zh: "已申请" },
  "linkedin.tab.about": { en: "About Us", zh: "关于社团" },
  "linkedin.tab.posts": { en: "Recent Posts", zh: "最新动态" },
  "linkedin.tab.people": { en: "Alumni & Team", zh: "校友与团队" },
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
    const stored = localStorage.getItem("rucf-lang") as Lang | null;
    if (stored === "en" || stored === "zh") {
      setLang(stored);
    }
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "zh" : "en";
    setLang(next);
    localStorage.setItem("rucf-lang", next);
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
