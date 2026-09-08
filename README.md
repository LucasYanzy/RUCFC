# RUCFC 网站新版

当前设计采用纯黑与炭灰背景、白色主操作、少量 RUCFC 红色。参考用户指定设计库的 Linear、Vercel、Resend 设计分析，具体原则见 DESIGN.md。

## 本地预览

```sh
npm ci
npm run build:local
npm run preview
```

打开 http://127.0.0.1:3000 。当前已启动预览时无需重复运行。

开发模式使用 `npm run dev:local`，与静态预览二选一。原 `npm run build` 仍面向 `/RUCFC` GitHub Pages；Railway 配置和独立订阅服务保留。

## 本版重点

- 首页与项目明确介绍中国 AI 和科技对全球市场的影响、AI 与金融实践、中国市场与商业文化，以及行业连接与职业探索；中英文同步。
- 首屏及入会区明确面向所有 Rutgers 学生开放，无需中文或金融背景。
- 邮件订阅位于首屏，手机也优先显示完整输入框和按钮。
- 手机使用独立的项目展开列表，桌面为可切换的项目详情卡片。
- 黑色表面与细边框、真实本地 Geist 字体、统一的字级和间距。
- 银白交互地球、细航线、滚动渐入与交互反馈；动效可暂停并遵循系统减少动态设置。
- 中英文切换；深浅主题以约 650ms 平滑过渡，页面和地球颜色同步变化。入会、Discord、LinkedIn 使用原站真实外链。
- 顶部、会员区、页尾与 PNG 图标均统一 RUCFC。

## 订阅服务

本地预览未配置真实邮件后台。未配置 `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` 时，表单明确提示订阅暂未开放并引导加入社团，不模拟订阅成功。配置该构建变量后重新构建即可连接现有服务，详见 NEWSLETTER_BACKEND.md。

## 文件入口

- app/page.tsx：页面结构、中英文文案、导航与项目交互。
- app/globals.css：完整桌面与手机设计、主题和动效。
- app/components/Globe.tsx：无需外部地图服务的 Canvas 地球。
- app/components/NewsletterForm.tsx：验证、提交、失败状态。
- app/fonts/：Geist 字体与 OFL 许可证。

当前只在本机预览，未发布外部网站。
