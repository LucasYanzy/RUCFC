"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "./LangProvider";
import { useInteractiveTilt } from "./useInteractiveTilt";
import logo from "@/public/logo.png";

const LINKEDIN_URL = "https://www.linkedin.com/company/rutgers-chinese-finance-club/";

export default function LinkedIn() {
  const { t, lang } = useLang();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(852);
  const [activeTab, setActiveTab] = useState<"about" | "posts" | "people">("posts");
  const [postLikes, setPostLikes] = useState(68);
  const [hasLiked, setHasLiked] = useState(false);
  const [connected, setConnected] = useState<Record<number, boolean>>({});
  const tiltRef = useInteractiveTilt({ maxTilt: 2.2, scale: 1.012, gyroTilt: 1.1 });

  const handleFollowClick = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handleLikeClick = () => {
    if (hasLiked) {
      setHasLiked(false);
      setPostLikes((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setPostLikes((prev) => prev + 1);
    }
  };

  const handleConnectClick = (index: number) => {
    setConnected((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const teamMembers = [
    {
      name: "ZhiYao Yan (Lucas)",
      role: lang === "en" ? "Founder @ RUCFC" : "创始人 @ RUCFC",
      headline: lang === "en" ? "Incoming IB Analyst" : "准投行分析师",
      avatar: "👑",
      bg: "#7289da",
    },
    {
      name: "Bowen Rui",
      role: lang === "en" ? "CTO @ RUCFC" : "首席技术官 @ RUCFC",
      headline: lang === "en" ? "Incoming Quant Researcher" : "准量化研究员",
      avatar: "💻",
      bg: "#43b581",
    },
    {
      name: "JianXia Sun (Harry)",
      role: lang === "en" ? "Vice President @ RUCFC" : "副主席 @ RUCFC",
      headline: lang === "en" ? "Incoming PE / VC Analyst" : "准私募股权分析师",
      avatar: "🤝",
      bg: "#faa61a",
    },
  ];

  return (
    <section className="linkedin-section" id="linkedin">
      <div className="container">
        <div className="linkedin-wrapper reveal">
          
          {/* Left Column: Copywriting & Value Props */}
          <div className="linkedin-info">
            <div className="section-label linkedin-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              {t("linkedin.label")}
            </div>
            
            <h2 className="section-title section-title-left">
              {t("linkedin.title")}
            </h2>
            
            <p className="linkedin-desc">
              {t("linkedin.desc")}
            </p>

            <div className="linkedin-features">
              <div className="linkedin-feature">
                <span className="linkedin-feature-emoji">👔</span>
                <div>
                  <strong>
                    {lang === "en" ? "1. Career Opportunities & Referrals" : "1. 职业机遇与内推推荐"}
                  </strong>
                  <p>
                    {lang === "en"
                      ? "Access exclusive job postings, corporate events, and direct referral channels within the finance and tech industries."
                      : "获取专有岗位招聘、企业宣讲会动态，以及金融与科技行业的直接内推渠道。"}
                  </p>
                </div>
              </div>

              <div className="linkedin-feature">
                <span className="linkedin-feature-emoji">🤝</span>
                <div>
                  <strong>
                    {lang === "en" ? "2. Alumni Network & Mentorship" : "2. 校友网络与导师计划"}
                  </strong>
                  <p>
                    {lang === "en"
                      ? "Connect with experienced Rutgers alumni working at top investment banks, quant funds, and tech giants."
                      : "与在顶尖投资银行、量化基金和科技巨头工作的资深罗格斯校友对接，吸取求职经验。"}
                  </p>
                </div>
              </div>

              <div className="linkedin-feature">
                <span className="linkedin-feature-emoji">📅</span>
                <div>
                  <strong>
                    {lang === "en" ? "3. Event Recap & Thought Leadership" : "3. 活动回顾与前沿分享"}
                  </strong>
                  <p>
                    {lang === "en"
                      ? "Never miss our macroeconomic reports, panel recaps, and financial literacy workshops."
                      : "随时查看我们发表的宏观经济报告、行业论坛要点回顾以及金融素养工作坊干货。"}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-linkedin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span className="btn-label">{t("linkedin.cta")}</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>

          {/* Right Column: 2.5D LinkedIn Interactive Mockup */}
          <div className="linkedin-preview">
            <div className="linkedin-mockup-wrapper interactive-tilt" ref={tiltRef}>
              <div className="linkedin-mockup">
                
                {/* LinkedIn Card Top Header Section */}
                <div className="linkedin-card-header">
                  {/* cover photo */}
                  <div className="linkedin-cover">
                    <div className="linkedin-cover-gradient" />
                  </div>
                  {/* profile photo & action bar */}
                  <div className="linkedin-profile-bar">
                    <div className="linkedin-avatar">
                      <Image src={logo} alt="RUCFC Logo" width={68} height={68} />
                    </div>
                    <button
                      className={`linkedin-follow-btn ${isFollowing ? "following" : ""}`}
                      onClick={handleFollowClick}
                    >
                      {isFollowing ? (
                        <>
                          <span style={{ marginRight: 4 }}>✓</span>
                          {t("linkedin.following")}
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: "1.2rem", marginRight: 4, lineHeight: 0 }}>+</span>
                          {t("linkedin.follow")}
                        </>
                      )}
                    </button>
                  </div>
                  {/* club name & details */}
                  <div className="linkedin-info-block">
                    <h3 className="linkedin-company-name">Rutgers Chinese Finance Club (RUCFC)</h3>
                    <p className="linkedin-tagline">
                      {lang === "en" 
                        ? "Bridging Eastern and Western business cultures • Finance & Tech Community at Rutgers"
                        : "连接东西方商业文化 • 罗格斯大学金融与科技社群"}
                    </p>
                    <p className="linkedin-subdetails">
                      Financial Services • New Brunswick, NJ • <span className="follower-count">{followersCount}</span> {t("linkedin.followers")}
                    </p>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="linkedin-tabs">
                    <button 
                      className={`linkedin-tab ${activeTab === "posts" ? "active" : ""}`}
                      onClick={() => setActiveTab("posts")}
                    >
                      {t("linkedin.tab.posts")}
                    </button>
                    <button 
                      className={`linkedin-tab ${activeTab === "about" ? "active" : ""}`}
                      onClick={() => setActiveTab("about")}
                    >
                      {t("linkedin.tab.about")}
                    </button>
                    <button 
                      className={`linkedin-tab ${activeTab === "people" ? "active" : ""}`}
                      onClick={() => setActiveTab("people")}
                    >
                      {t("linkedin.tab.people")}
                    </button>
                  </div>
                </div>

                {/* Tab Content Body */}
                <div className="linkedin-card-body">
                  
                  {activeTab === "about" && (
                    <div className="linkedin-about-content animate-fade-in">
                      <h4>{lang === "en" ? "Overview" : "社团概述"}</h4>
                      <p>
                        {lang === "en"
                          ? "Rutgers Chinese Finance Club (RUCFC) is a premier student-led organization at Rutgers University. We aim to empower undergraduate and graduate students by providing comprehensive resources in finance, macro market analyses, and quantitative trading tools, while serving as a cultural and professional bridge between East and West."
                          : "罗格斯华人金融协会 (RUCFC) 是罗格斯大学领先的学生社团。我们旨在通过提供丰富的金融求职资源、宏观市场分析和量化交易工具，赋能本科生及研究生，同时致力于打造连接东西方商业文化的专业桥梁。"}
                      </p>
                      <div className="linkedin-about-grid">
                        <div className="linkedin-about-item">
                          <strong>{lang === "en" ? "Website" : "官方网站"}</strong>
                          <span style={{ color: "#0a66c2", textDecoration: "underline", fontSize: "0.8rem" }}>rutgerscfc.org</span>
                        </div>
                        <div className="linkedin-about-item">
                          <strong>{lang === "en" ? "Industry" : "行业领域"}</strong>
                          <span>Financial Services / Fintech</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "posts" && (
                    <div className="linkedin-post-content animate-fade-in">
                      {/* Post Author Bar */}
                      <div className="linkedin-post-author">
                        <Image src={logo} alt="RUCFC Logo" width={36} height={36} className="post-author-avatar" />
                        <div>
                          <div className="post-author-name">Rutgers Chinese Finance Club (RUCFC)</div>
                          <div className="post-author-sub">850+ followers • 1w • Edited • 🌐</div>
                        </div>
                      </div>
                      
                      {/* Post Copy */}
                      <p className="linkedin-post-text">
                        {lang === "en"
                          ? "🚀 We are thrilled to launch the Rutgers Chinese Finance Club (RUCFC) for the upcoming Fall 2026 cohort! Our mission is to bridge Eastern and Western financial markets, equipping members with career-essential skills, BMC & ESG certifications, and hands-on quantitative analytics training. Let's shape the future of finance together. 📈💼 #Rutgers #Finance #CareerAdvancement #Networking"
                          : "🚀 我们非常高兴地宣布启动 RUCFC 2026秋季招新！我们的使命是搭建连接东西方金融市场的桥梁，助力成员掌握核心职业技能、考取 BMC & ESG 认证，并参与前沿量化分析实践。让我们携手并肩，共同塑造金融行业的未来！📈💼 #罗格斯大学 #金融 #求职 #人脉拓展"}
                      </p>

                      {/* Post Visual Media Block */}
                      <div className="linkedin-post-media">
                        <div className="linkedin-post-media-gradient">
                          <span className="media-tag">{lang === "en" ? "RUCFC ROUNDTABLE" : "RUCFC 圆桌论坛"}</span>
                          <span className="media-title">
                            {lang === "en" 
                              ? "Bridging Markets: Finance & AI Agent Tech" 
                              : "跨越市场：金融与 AI 代理前沿科技"}
                          </span>
                          <span className="media-sub">Fall 2026 Launch & Workshop Series</span>
                        </div>
                      </div>

                      {/* Post Stats */}
                      <div className="linkedin-post-stats">
                        <div className="post-stats-left">
                          <span className="like-emoji">👍</span>
                          <span className="heart-emoji">❤️</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 6 }}>
                            {postLikes}
                          </span>
                        </div>
                        <div className="post-stats-right">
                          <span>12 comments • 4 shares</span>
                        </div>
                      </div>

                      <div className="linkedin-post-divider" />

                      {/* Post Action Buttons */}
                      <div className="linkedin-post-actions">
                        <button 
                          className={`post-action-btn ${hasLiked ? "liked" : ""}`}
                          onClick={handleLikeClick}
                        >
                          <span className="action-icon">👍</span>
                          <span>{lang === "en" ? "Like" : "点赞"}</span>
                        </button>
                        <button className="post-action-btn" onClick={() => alert("Simulated: Comments section coming soon!")}>
                          <span className="action-icon">💬</span>
                          <span>{lang === "en" ? "Comment" : "评论"}</span>
                        </button>
                        <button className="post-action-btn" onClick={() => alert("Link copied to clipboard!")}>
                          <span className="action-icon">🔁</span>
                          <span>{lang === "en" ? "Share" : "分享"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "people" && (
                    <div className="linkedin-people-content animate-fade-in">
                      <h4>{lang === "en" ? "Featured Executive Board" : "执委会核心成员"}</h4>
                      <div className="linkedin-people-grid">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="linkedin-member-card">
                            <div className="linkedin-member-avatar" style={{ background: member.bg }}>
                              {member.avatar}
                            </div>
                            <div className="linkedin-member-info">
                              <h5>{member.name}</h5>
                              <p className="member-role">{member.role}</p>
                              <p className="member-headline">{member.headline}</p>
                            </div>
                            <button
                              className={`linkedin-connect-btn ${connected[index] ? "pending" : ""}`}
                              onClick={() => handleConnectClick(index)}
                            >
                              {connected[index] ? (
                                <>
                                  <span style={{ marginRight: 4 }}>✓</span>
                                  {t("linkedin.connected")}
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: "1rem", marginRight: 4 }}>+</span>
                                  {t("linkedin.connect")}
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            
            {/* Visual badge simulating official verification */}
            <div className="linkedin-badge-verified">
              <span className="verified-check">✓</span>
              <span> {lang === "en" ? "Official Page" : "官方认证主页"}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
