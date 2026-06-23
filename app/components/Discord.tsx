"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";

const DISCORD_INVITE = "https://discord.gg/1518963490772094996";

export default function Discord() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState<"chat" | "signals">("chat");

  return (
    <section className="discord-section" id="discord">
      <div className="discord-ambient" />
      <div className="container">
        {/* Two-column layout: Text left, 2.5D Mockup right */}
        <div className="discord-wrapper reveal">
          {/* Left Column: Info + Features + CTA */}
          <div className="discord-info">
            <div className="section-label discord-label">
              <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor" style={{ marginRight: 8, verticalAlign: "middle" }}>
                <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1A60 60 0 00.4 43.9a.3.3 0 00.1.2 58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4c-1.8 1-3.6 1.9-5.5 2.6a.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.1 44a.3.3 0 00.1-.2 59.7 59.7 0 00-10.1-39zm-35 31.2c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm22.9 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.7 7-6.2 7z" />
              </svg>
              {t("discord.label")}
            </div>
            <h2 className="section-title" style={{ textAlign: "left", margin: "12px 0 20px" }}>
              {t("discord.title")}
            </h2>
            <p className="discord-desc">
              {lang === "en"
                ? "Experience the best of both worlds. Engage in our active student community discussions, and gain access to proprietary quantitative analysis tools and automated alert feeds directly inside our Discord server."
                : "体验双重核心价值。在我们的 Discord 服务器中，您不仅能参与活跃的学生社群讨论，还能获取独家开发的量化分析工具与自动化信号推送。"}
            </p>

            <div className="discord-features">
              <div className="discord-feature" onClick={() => setActiveTab("chat")} style={{ cursor: "pointer" }}>
                <span className="discord-feature-emoji">💬</span>
                <div>
                  <strong>
                    {lang === "en" ? "1. Club Discussion Group" : "1. 社团讨论组"}
                  </strong>
                  <p>
                    {lang === "en"
                      ? "Connect with ambitious peers, discuss interview strategies, and build lifelong networks in our chat channels."
                      : "与志同道合的优秀同伴交流，讨论求职面试策略，在我们的专属频道中建立宝贵的人脉网络。"}
                  </p>
                </div>
              </div>

              <div className="discord-feature" onClick={() => setActiveTab("signals")} style={{ cursor: "pointer" }}>
                <span className="discord-feature-emoji">📊</span>
                <div>
                  <strong>
                    {lang === "en" ? "2. Quant Tools & Bots" : "2. 我们的量化小工具"}
                  </strong>
                  <p>
                    {lang === "en"
                      ? "Access real-time options flow scanners, multi-indicator technical alerts (RSI/MACD), and news feeds."
                      : "获取实时期权异动扫描、多指标技术面信号提醒（RSI/MACD）以及一线财经新闻推送。"}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-discord"
            >
              <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor">
                <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1A60 60 0 00.4 43.9a.3.3 0 00.1.2 58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4c-1.8 1-3.6 1.9-5.5 2.6a.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.1 44a.3.3 0 00.1-.2 59.7 59.7 0 00-10.1-39zm-35 31.2c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm22.9 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.7 7-6.2 7z" />
              </svg>
              {t("discord.join")}
              <span className="btn-arrow">→</span>
            </a>
          </div>

          {/* Right Column: 2.5D Simulated Discord Mockup */}
          <div className="discord-preview">
            <div className="discord-mockup-glow" />
            <div className="discord-mockup-wrapper">
              <div className="discord-mockup">
                {/* Sidebar */}
                <div className="discord-sidebar">
                  <div className="discord-server-icon">RUCF</div>
                  <div className="discord-sidebar-divider" />
                  <div className="discord-channel-list">
                    <div className="discord-category">
                      {lang === "en" ? "Text Channels" : "文字频道"}
                    </div>
                    <div
                      className={`discord-ch ${activeTab === "chat" ? "active" : ""}`}
                      onClick={() => setActiveTab("chat")}
                    >
                      # community-chat
                    </div>
                    <div
                      className={`discord-ch ${activeTab === "signals" ? "active" : ""}`}
                      onClick={() => setActiveTab("signals")}
                    >
                      # alpha-signals
                    </div>
                  </div>
                </div>

                {/* Main chat window */}
                <div className="discord-main">
                  <div className="discord-mockup-header">
                    <span className="discord-hash">#</span>
                    <span className="discord-channel-name">
                      {activeTab === "chat" ? "community-chat" : "alpha-signals"}
                    </span>
                    <span className="discord-topic">
                      {activeTab === "chat"
                        ? (lang === "en" ? "Club Discussion & Announcements" : "社团交流与公告")
                        : (lang === "en" ? "Real-time Quant Alerts & Bots" : "实时量化信号与机器人")}
                    </span>
                  </div>

                  <div className="discord-mockup-body">
                    {activeTab === "chat" ? (
                      <>
                        {/* Message 1: Lucas */}
                        <div className="discord-msg animate-fade-in">
                          <div className="discord-msg-avatar" style={{ background: "#7289da", color: "#fff" }}>👑</div>
                          <div>
                            <div className="discord-msg-name">
                              ZhiYao Yan (Lucas)
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 10:15 AM</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#dcddde", lineHeight: "1.4" }}>
                              {lang === "en"
                                ? "Welcome to RUCF! Excited to launch our Fall 2026 cohort. Let's bridge Eastern and Western business cultures together."
                                : "欢迎来到 RUCF！很高兴启动我们的 2026 秋季招新。让我们一起搭建连接东西方商业文化的桥梁。"}
                            </div>
                          </div>
                        </div>

                        {/* Message 2: Bowen */}
                        <div className="discord-msg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                          <div className="discord-msg-avatar" style={{ background: "#43b581", color: "#fff" }}>💻</div>
                          <div>
                            <div className="discord-msg-name">
                              BoWen Rui (Bowen)
                              <span className="bot-badge" style={{ background: "#43b581" }}>CTO</span>
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 10:24 AM</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#dcddde", lineHeight: "1.4" }}>
                              {lang === "en" ? (
                                <>
                                  Hey everyone! Go check out the{" "}
                                  <span style={{ color: "#00aff4", cursor: "pointer", textDecoration: "underline" }} onClick={() => setActiveTab("signals")}>
                                    #alpha-signals
                                  </span>{" "}
                                  channel. Just deployed our new Bloomberg-connected technical scanner bot! 📈
                                </>
                              ) : (
                                <>
                                  大家伙好！快去看看{" "}
                                  <span style={{ color: "#00aff4", cursor: "pointer", textDecoration: "underline" }} onClick={() => setActiveTab("signals")}>
                                    #alpha-signals
                                  </span>{" "}
                                  频道。我刚刚部署了我们连接彭博终端的最新技术面扫描机器人！📈
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Message 3: Harry */}
                        <div className="discord-msg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                          <div className="discord-msg-avatar" style={{ background: "#faa61a", color: "#fff" }}>🤝</div>
                          <div>
                            <div className="discord-msg-name">
                              JianXia Sun (Harry)
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 11:02 AM</span>
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#dcddde", lineHeight: "1.4" }}>
                              {lang === "en"
                                ? "Don't forget our upcoming FinTech workshop on deploying AI agents for trading! Let's get certified together."
                                : "别忘了我们即将举办的金融科技工作坊，主题是如何部署AI代理进行量化交易！大家一起考取 BMC 和 ESG 证书。"}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Bot Message 1: Options Flow */}
                        <div className="discord-msg animate-fade-in">
                          <div className="discord-msg-avatar bot">📊</div>
                          <div style={{ flex: 1 }}>
                            <div className="discord-msg-name">
                              OptionsRadar_Alpha
                              <span className="bot-badge">BOT</span>
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 1:45 PM</span>
                            </div>
                            <div className="signal-card signal-bullish">
                              <div className="signal-header">QQQ $737.95 | 0DTE Call · 0DTE</div>
                              <div className="signal-body">
                                <div className="signal-row">
                                  <span>IV: <span style={{ color: "#34d399", fontWeight: 600 }}>35.2%</span></span>
                                  <span>Delta: <span style={{ color: "#34d399", fontWeight: 600 }}>+0.585</span></span>
                                </div>
                                <div className="signal-row">
                                  <span>OI: 12.3x</span>
                                  <span>Vol: $10.5M+</span>
                                </div>
                                <div className="signal-score">
                                  <div className="score-bar">
                                    <div className="score-fill" style={{ width: "73%" }}></div>
                                  </div>
                                  <span>73/100</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bot Message 2: RSI */}
                        <div className="discord-msg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                          <div className="discord-msg-avatar bot-red">🤖</div>
                          <div style={{ flex: 1 }}>
                            <div className="discord-msg-name">
                              StockSp_X
                              <span className="bot-badge" style={{ background: "#ed4245" }}>BOT</span>
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 1:52 PM</span>
                            </div>
                            <div className="signal-card signal-bearish">
                              <div className="signal-header">RSI Overbought Alert — DOGE</div>
                              <div className="signal-body">
                                <div className="signal-row">
                                  <span>{t("discord.period")}: 5m</span>
                                  <span>{t("discord.direction")}: <span style={{ color: "#ef4444", fontWeight: 600 }}>Short</span></span>
                                </div>
                                <div className="signal-row">
                                  <span>Price: $0.0832</span>
                                  <span>RSI: <span style={{ color: "#ef4444", fontWeight: 600 }}>78.5</span></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bot Message 3: News Feed */}
                        <div className="discord-msg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                          <div className="discord-msg-avatar bot-news">📰</div>
                          <div style={{ flex: 1 }}>
                            <div className="discord-msg-name">
                              LucasYanzy_News
                              <span className="bot-badge" style={{ background: "#9ba3af" }}>APP</span>
                              <span className="discord-msg-time" style={{ marginLeft: 8 }}>Today at 2:05 PM</span>
                            </div>
                            <div className="signal-card signal-news">
                              <div className="signal-news-source">Reuters | Financial News</div>
                              <div className="signal-news-headline">Asian refiners see little room for Iranian oil, leaving China as key buyer after US waiver</div>
                              <div className="signal-news-meta">
                                <span style={{ color: "#ed4245" }}>🔴</span> 2026-06-23 17:35 UTC
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Online counter */}
            <div className="discord-online">
              <span className="online-dot" />
              <span> {lang === "en" ? "Members Online" : "成员在线"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
