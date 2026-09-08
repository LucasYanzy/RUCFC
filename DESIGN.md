# RUCFC design direction

参考资料（独立设计分析，并非上述品牌的官方规范）：

- https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md
- https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/vercel/DESIGN.md
- https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/resend/DESIGN.md

## 采用的设计原则

以 Linear 的字级、间距及细边框层次为基础，参考 Vercel 的 Geist 字体与清晰表单，采用 Resend 的纯黑画布与白色主操作。品牌色仍使用 RUCFC 的红色。

- 背景 #000000；一级表面 #0a0a0b；二级表面 #111113。
- 主文字 #f5f5f6，正文 #a1a1a8，辅助信息 #717179。
- 边框 #232326；选中或输入框边框 #353539。
- 红色 #cd3f55 仅用于品牌与少量连接线，白色用于首屏订阅按钮。
- Geist Variable 本地加载；中文使用系统 PingFang SC / Microsoft YaHei。
- 标题 600、正文 400；正文 14–16px，移动输入框 16px。
- 间距使用 4px 基础单位；桌面内容上限 1200px，区块间距 112px，手机 61px。
- 控件圆角 7px、内容卡片 12px；以边界和明度表达层次，不叠加彩色光晕与拟物高光。
- 动态只用于地球旋转、细小航线光点、滚动进入、悬停和项目展开。减少动态偏好与暂停开关均可关闭动画。

## 首屏订阅

订阅框紧跟简介，桌面和手机无需滚动即可看到。手机将地球放在订阅和主操作之后。首屏文案不使用虚构会员人数、合作伙伴或活动日期。

## 手机专门布局

小于或等于 600px：单列首屏、48px 高输入和订阅按钮、折叠导航、项目区使用原生 details/summary 展开列表，不显示桌面图形卡片。社区入口和会员申请纵向排列。

全部品牌标识书写为 RUCFC，不省略最后一个 C。保留中英切换、浅色主题和真实外链。
