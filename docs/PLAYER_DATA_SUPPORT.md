# FC 24 至 FC 27 球员数据与接口支持

[文档目录](README.md) · [使用指南](USER_GUIDE.md)

FC Career Top 采集经理生涯存档中的真实数据。SoFIFA 用来核对资料分类、年度名称和参考编码；网站上的初始能力、估值和合同不会替换存档中的值。是否可读，以正在运行的 Live Editor 实际返回的数据为准。

## 年度变化

| 项目 | FC 24 | FC 25 | FC 26 | FC 27 |
| --- | --- | --- | --- | --- |
| 基础技术属性 | 29 项非门将属性及 5 项门将属性 | 分类延续 | 分类延续，玩法效果调整 | 原始资料页采用同一基础分类 |
| 攻防积极性 | Work Rates | 被 FC IQ 角色机制替代 | 使用角色机制 | 使用角色机制 |
| 角色熟练度 | 无 FC IQ 角色 | Role+／Role++；参考目录有 44 个位置相关基础 ID | 新增 4 类角色，对应 5 个新增位置相关 ID | 当前 SoFIFA 目录沿用 49 个基础 ID |
| 偏好位置 | 旧版位置列表 | CF、LWB、RWB 不再作为常规 FC IQ 位置 | 支持第 4 个以后的偏好位置 | 最多 7 个偏好位置 |
| PlayStyles | 旧版编码 | 旧版编码；后续更新加入 Low Driven Shot | 新增和重组，位编码重排 | 当前 SoFIFA 目录与 FC 26 编码一致 |
| 加速类型 | 旧版细分类型 | SoFIFA 沿用细分标签 | EA 将 PC 比赛机制改为三类，男女身高阈值不同 | 不套用尚未确认的公式 |
| 生涯总评与成长 | 总评、潜力及成长计划 | 士气增加 Complacent 等级 | 成长、角色和教练系统继续扩展 | Dynamic OVR、6 类 Growth Profiles、Squad Ranks 和潜力评估调整 |
| 全局生涯机制 | 传统经理生涯 | 女足经理生涯、Rush 青训等 | Authentic／Competitive 两套玩法、经理市场等 | 转会阶段和财务结构改造、Authentic Gameplay 2.0 等 |

角色 ID 包含相同角色在不同位置上的独立编码，不等于独立角色名称数量。Role 熟练度不同于合同 Squad Role，也不同于阵型当前选择的 Role／Focus。

FC 25 的位置和 Work Rate 变化依据 [EA FC IQ 说明](https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-fc-iq-deep-dive)。FC 26 的新增特性、位置扩展和加速机制依据 [EA Gameplay Deep Dive](https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)。FC 27 的新增生涯系统依据 [EA Career Deep Dive](https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-27--career-deep-dive/13603463)。

全局生涯机制参考：[FC 25 Career Deep Dive](https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-career-mode-deep-dive)、[FC 26 新生涯功能](https://www.ea.com/games/ea-sports-fc/fc-26/features/fc-26-career-mode)。

## 基础属性对应表

本项目展示全部 34 项基础属性，包括非门将球员的门将属性。分类平均值是本项目的算术平均，不是 FUT 卡面六维，也不是 SoFIFA 的位置评分。

| 分类 | 游戏字段 |
| --- | --- |
| 速度 | acceleration、sprintspeed |
| 射门 | positioning、finishing、shotpower、longshots、volleys、penalties |
| 传球 | vision、crossing、freekickaccuracy、shortpassing、longpassing、curve |
| 盘带 | agility、balance、reactions、ballcontrol、dribbling、composure |
| 防守 | interceptions、headingaccuracy、defensiveawareness、standingtackle、slidingtackle |
| 身体 | jumping、stamina、strength、aggression |
| 门将 | gkdiving、gkhandling、gkkicking、gkpositioning、gkreflexes |

个人资料还包括生日、年龄、身高、体重、惯用脚、花式动作、逆足、国际声望、性别、体型、真实脸型和偏好位置。skillmoves 从 0 开始，显示星数时加 1；逆足和国际声望不采用同样的偏移。

SoFIFA 原始资料参考：[FC 24](https://sofifa.com/player/231747/kylian-mbappe/240050/)、[FC 25](https://sofifa.com/player/231747/kylian-mbappe/250044/)、[FC 26](https://sofifa.com/player/231747/kylian-mbappe/260046/)、[FC 27](https://sofifa.com/player/231747/kylian-mbappe/270004/)。这些是年度参考快照，不是用户生涯中的当前能力。

## PlayStyles 与隐藏特性

FC 26 移除并重组 Power Header、Aerial、Flair 和 Trivela，加入 Precision Header、Aerial Fortress、Inventive、Gamechanger 和 Enforcer。Low Driven Shot 在 FC 25 后续更新出现，并在 FC 26 新目录中有独立编码。不能仅替换名称，位编码和作用侧重点也发生了变化。

SoFIFA 使用合并位掩码。FC 24／25 的参考目录以前 30 位为一段，剩余目录包含 4 个门将特性、2 个 AI 特性和 5 个隐藏特性；FC 26／27 重排了前 32 位，剩余目录包含 4 个门将特性和 5 个隐藏特性。读取时根据编辑器提供的实际字段位宽拆分，并优先采用兼容的运行时枚举；这些参考分段不能证明每个版本的二进制字段布局都相同。trait1／trait2 和 icontrait1／icontrait2 分别保存普通与增强掩码。

| 数据 | 本项目处理 |
| --- | --- |
| 普通 PlayStyles／PlayStyles+ | 按年度解码，增强版本单独展示 |
| 新增特性 | 使用年度目录；兼容的运行时枚举可以继续扩展 |
| 门将特性 | 保留 Rush Out、1v1 Close Down、Quick Reflexes、Deflector 的年度名称区别 |
| 隐藏特性 | 独立显示 Solid Player、Team Player、One Club Player、Injury Prone、Leadership |
| 旧版 AI 特性 | 独立保存 Long Shot Taker 和 Early Crosser，不伪装成 PlayStyles+ |
| 未识别位 | 保存原始掩码与未识别位，不猜测名称 |
| 旧版编辑器枚举 | 核对已知 Technical 位后才采用，防止覆盖新版编码 |

参考目录来自 [SoFIFA 自定义页面](https://sofifa.com/player/231747/kylian-mbappe/customize)的各年度字段选项，并与 [FC 24 官方 Lua 枚举](https://github.com/xAranaktu/FC-24-Live-Editor/blob/main/lua/libs/v2/imports/other/playstyles_enum.lua)、[FC 25 官方 Lua 枚举](https://github.com/xAranaktu/FC-25-Live-Editor/blob/main/lua/libs/v2/imports/other/playstyles_enum.lua)交叉对照。Low Driven Shot 的编辑器支持见 [FC 25 v25.3.1 更新日志](https://github.com/xAranaktu/FC-25-Live-Editor/blob/main/changelog.txt)；后续更新中未明确收录的位值依赖兼容的运行时枚举或保留为原始值。

## Live Editor 支持范围

| 数据或机制 | 支持证据与限制 | 采集方式 |
| --- | --- | --- |
| 技术属性、身份、外观、位置 | 四代均有球员和数据库编辑，具体字段依赖版本 | 读取 players 实际字段 |
| 角色熟练度 | FC 25 v25.1.6 加入角色编辑，v25.2.6 加入 Role4／Role5；SoFIFA FC 27 页面提供更多槽，但不证明所有编辑器均暴露全部槽 | 自动保存可读 roleN 字段，解释已知 ID |
| 合同、加入日期、工资、解约金 | 界面支持，但字段及单位可能改变 | 读取实际合同和球队关联记录 |
| 市场价值 | Player Value 界面不等于公开 Lua getter；FC 27 估值模型也已改变 | 只展示实际取得的值，不用网站初始价格替换 |
| 当前赛季统计 | 有 GetPlayersStats／GetPlayerStats；赛事覆盖有限，部分统计字段在文档中标注不确定性 | 批量读取后按球员和赛事保存，失败时标明未提供 |
| 状态、士气、体能、伤病 | UI 和写入接口不证明有对应读取接口 | 读取存在的生涯表，未取得的值留空 |
| FC 27 动态及基础总评 | EA 确认机制存在，公开文档未给出完整稳定的专用读取说明 | 读取实际暴露字段，不将 overallrating 自动当成 Dynamic OVR |
| FC 27 Growth Profiles／Squad Ranks | EA 确认机制，公开资料无完整可靠的游戏编号对照 | 保存原始值；未知编号不伪造含义 |
| AcceleRATE | 属于派生比赛机制，不等于 acceleration 数值；SoFIFA FC 26 页面仍可能显示旧标签 | FC 26 使用 EA 官方三类规则，其余版本未确认的公式不套用 |
| SoFIFA Specialities、位置评分、最佳位置 | 网站派生值，不等于独立存档字段 | 保留实际暴露原始字段，不将网站计算结果冒充游戏值 |
| 玩法预设、教练、经理市场、谈判等 | 属于全局生涯系统，不是单个球员数值 | 记录年度机制变化，不伪造对应玩家属性 |
| 在线模式 | Live Editor 官方不支持 FUT／Clubs 等在线模式 | 本项目采集经理生涯 |

接口来源：[FC 25 更新日志](https://github.com/xAranaktu/FC-25-Live-Editor/blob/main/changelog.txt)、[FC 26 更新日志](https://github.com/xAranaktu/FC-26-Live-Editor/blob/main/changelog.txt)、[FC 27 更新日志](https://github.com/xAranaktu/FC-27-Live-Editor/blob/main/changelog.txt)、[赛季统计接口](https://github.com/xAranaktu/FC-26-Live-Editor/wiki/LUA-API#GetPlayersStats)、[职业模式与在线限制](https://github.com/xAranaktu/FC-26-Live-Editor/wiki/Editing-Player)。

## 数据保存与可用状态

player_profile 保存最新扩展快照：球员实际字段、按球员 ID 关联的生涯记录、赛季统计、隐藏特性、未识别掩码、编辑器版本及来源可用状态。新增年度字段仍可保留，不需要为每个新字段增加数据库列。

核心阵容必须完整。辅助接口不可用不会丢弃整个阵容；缺少核心球员记录时跳过上传，避免误归档。读取失败的字段单独记录；「—」代表没有取得数据，不能解释成 0 或游戏没有该机制。

旧客户端未上传扩展资料或 PlayStyles 时，后端保留已有资料。复制最新版脚本后才能生成新增数据。扩展资料目前保存最新快照，成长历史仍仅保存总评和潜力。

本地数据库需应用 0004_add_player_profile.sql。公开接口及目录支持不等于游戏内验收，尤其 FC 27 的新增生涯字段需结合实际编辑器版本核对。
