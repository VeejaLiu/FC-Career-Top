export default {
  LoginComponent: {
    VideoTutorial: '如何使用这个应用?通过视频了解更多！',
    welcome: '欢迎回来',
    usernameEmail: '邮箱',
    usernameEmailPlaceholder: '您的邮箱',
    password: '密码',
    passwordPlaceholder: '您的密码',
    login: '登录',
    registerPrompt: '没有账号？注册',
  },
  RegisterComponent: {
    title: '开始您的伟大旅程',
    text: '永久免费使用',
    username: '用户名',
    usernamePlaceholder: '您的用户名',
    email: '电子邮件',
    emailTooltip: '请输入有效的邮箱地址，暂时无需邮箱验证。',
    emailPlaceholder: '您的电子邮件',
    password: '密码',
    passwordTooltip:
      '密码必须包含大小写字母、数字或特殊符号中的三种，并且不少于6位。',
    passwordPlaceholder: '您的密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '确认您的密码',
    register: '注册',
    loginPrompt: '已经有账号？ 登录',

    invalidUsername:
      '用户名必须以字母开头，长度为6到20位，仅允许字母、数字、下划线和点。',

    invalidEmail: '请输入有效的电子邮件地址。',

    passwordError:
      '密码必须包含大小写字母、数字或特殊符号中的三种，并且不少于6位。',
    passwordMismatch: '密码不匹配。请确保两次输入的密码一致。',

    registerSuccess: '注册成功！将在3秒后重定向到登录页面',
  },
  WebsiteLogoComponent: {
    title: 'FCT',
    switchVersion: '切换游戏版本',
    current: '当前版本',
  },
  Navbar: {
    Language: '语言',
    MyAccount: '我的',
    PlayersList: '球员',
    PlayerDetail: '详情',
    PlayersTrends: '成长',
    Settings: '设置',
    GetStarted: '快速开始',
    VisitGithub: '访问 Github',
    JoinDiscord:
      '加入我们的 Discord 服务器以获取帮助/反馈/报告错误/建议，或与我们聊天！',
    SwitchLanguage: 'Switch to English',
    Hello: '你好， ',
    Logout: '退出登录',
  },
  AsyncState: { error: '无法加载数据，请检查网络连接后重试。', retry: '重试' },
  NoDataComponent: {
    prefix: '暂无数据哦。请前往',
    getStartedPage: '快速开始',
    suffix: '开启您的精彩旅程',
  },
  PlayerTrendsPage: { FOR: '前锋', MID: '中场', DEF: '后卫', GK: '门将' },
  PlayerListTable: {
    name: '名字',
    age: '年龄',
    position: '位置',
    SkillMovesAndWeakFoot: '花式/逆足',
    SkillMoves: '花式',
    SkillMovesTooltip: '花式能力 SM',
    WeakFoot: '逆足',
    WeakFootTooltip: '逆足能力 WF',
    overall: '总评',
    potential: '潜力',
    overallRankingTips: '该球员在同位置({position})的总评排名为第 {ranking}。',
    potentialRankingTips:
      '该球员在同位置({position})的潜力排名为第 {ranking}。',
  },
  PlayerDetailPage: {
    Profile: {
      Birthday: '出生日期',
      DoubleYellow: '双黄变红',
      AverageAttribute: '属性平均值',
      CopyNewScript: '请从「快速上手」复制并运行最新脚本，以采集新增球员资料。',
      Yes: '是',
      No: '否',
      Profile: '球员档案',
      Reputation: '国际声望',
      BodyType: '体型',
      RealFace: '真实脸型',
      Gender: '性别',
      Male: '男',
      Female: '女',
      Nationality: '国籍（游戏编号）',
      SecondNationality: '第二国籍（游戏编号）',
      AccelerationType: '加速类型',
      DerivedNote:
        '计算标签只使用已确认的对应版本规则。「—」表示编辑器没有提供数据。',
      SoFIFAReference: '查看 SoFIFA 原始参考资料',
      Roles: '角色熟练度',
      NoRolesInVersion: 'FC 24 使用攻防积极性，FC IQ 角色从 FC 25 开始引入。',
      NotAvailable: '本次快照中，编辑器未提供这部分数据。',
      NoRoles: '未记录到增强角色。',
      HiddenTraits: '隐藏与 AI 特性',
      NoTraits: '未记录到隐藏特性。',
      UnknownBits: '无法识别的特性位已保留在完整采集资料中。',
      Contract: '俱乐部与合同',
      Joined: '加入日期',
      ContractUntil: '合同到期年份',
      Wage: '工资',
      ReleaseClause: '解约金',
      Value: '市场价值',
      Jersey: '球衣号码',
      Club: '俱乐部／游戏编号',
      MoneyNote: '金额使用游戏自身的单位，不会用网站估值替换生涯中的真实数据。',
      CareerState: '生涯状态',
      DatabaseOverall: '数据库总评',
      DynamicOverall: '动态总评',
      BaselineOverall: '基础总评',
      GrowthProfile: '成长曲线（游戏编号）',
      SquadRank: '阵容评级',
      Form: '状态',
      Morale: '士气',
      Fitness: '比赛体能',
      Injury: '伤病（游戏编号）',
      InjuryDays: '伤病持续时间',
      CareerNote:
        '新增生涯机制仅在编辑器提供值时展示；数据库总评不会被默认当成动态总评。',
      OtherCareerFields: '其他已记录的生涯字段',
      SeasonStats: '当前赛季统计',
      NoMatches: '尚未记录到赛事统计。',
      Competition: '赛事',
      Appearances: '出场',
      Goals: '进球',
      Assists: '助攻',
      Average: '评分',
      CleanSheets: '零封',
      Saves: '扑救',
      Conceded: '失球',
      Yellow: '黄牌',
      Red: '红牌',
      MOTM: '全场最佳',
      SeasonNote:
        '统计来自 Live Editor 的当前赛季接口；部分字段和赛事可能不完整，不会用估算值补齐。',
      AllCapturedData: '完整游戏采集资料',
      RawNote:
        '新字段与尚未确认含义的字段以原始游戏编号保留。可用状态标明编辑器实际返回了哪些数据。',
      GameCode: '游戏编号',
      Lean: '偏瘦',
      Normal: '标准',
      Stocky: '壮硕',
      Explosive: '爆发型',
      Lengthy: '长距型',
      Controlled: '受控型',
      Calculated: '按规则计算',
    },
    BasicInfo: {
      PlayerID: '球员ID',
      Age: '年龄',
      Skills: '技能',
      WeakFoot: '逆足',
      Foot: '脚',
      Height: '身高',
      Weight: '体重',
      AttackingWorkRate: '进攻效率',
      DefensiveWorkRate: '防守效率',
    },
    Attributes: {
      Pace: '速度',
      Acceleration: '加速',
      SprintSpeed: '冲刺',

      Shooting: '射门',
      AttackingPosition: '进攻位置',
      Finishing: '终结',
      ShotPower: '射门力量',
      LongShots: '远射',
      Volleys: '凌空抽射',
      Penalties: '点球',

      Passing: '传球',
      Vision: '视野',
      Crossing: '传中',
      FKAccuracy: '任意球精度',
      ShortPass: '短传',
      LongPass: '长传',
      Curve: '弧线球',

      Dribbling: '盘带',
      Agility: '敏捷',
      Balance: '平衡',
      Reactions: '反应',
      BallControl: '控球',
      Composure: '冷静',

      Defending: '防守',
      Interceptions: '拦截',
      HeadingAccuracy: '头球精度',
      DefensiveAwareness: '防守意识',
      StandingTackle: '站立铲球',
      SlidingTackle: '滑铲',

      Physical: '身体素质',
      Jumping: '跳跃',
      Stamina: '耐力',
      Strength: '力量',
      Aggression: '侵略性',

      Goalkeeping: '守门',
      GKDiving: '扑救',
      GKHandling: '处理球',
      GKKicking: '踢球',
      GKReflexes: '反应',
      GKPositioning: '站位',
    },
  },
  SettingsPage: {
    Settings: '设置',

    APISecretKey: 'API 秘钥',
    ClickToCopy: '点击复制你的API秘钥',
    Copy: '复制',
    ClickToRefresh: '点击刷新你的API秘钥，这将会使你的旧秘钥失效',
    Refresh: '刷新',
    CopySuccessMessage: '秘钥已复制到剪贴板',
    FailedToCopyMessage: '无法复制秘钥到剪贴板，请重试',
    DoNotShareSecretKey: '警告: 不要与任何人分享您的秘钥！',

    Notifications: '通知',
    EnableNotifications: '启用通知',
    PlayerOverallPotentialUpdate: '球员 总评/潜力 更新',
    PlayerSkillMoveUpdate: '球员 花式 能力更新',
    PlayerWeakFootUpdate: '球员 逆足 能力更新',

    AccountInfo: '账户信息',
    AccountUnverifiedWarningBanner:
      '您的电子邮件地址尚未验证。请点击下方按钮验证您的电子邮件地址，以便我们确认您的身份。',
    AccountUsername: '用户名',
    AccountEmail: '邮箱',
    AccountEmailVerified: '已验证',
    AccountEmailUnverified: '未验证',
    AccountEmailUnverifiedTooltip:
      '邮箱未验证，点击发送验证邮件。我们将发送一封验证邮件，其中包含验证您电子邮件地址的链接。',
    AccountEmailSendTooFrequently: '邮件发送太频繁，请等待 {waitSeconds} 秒',
    AccountEmailSendToast:
      '验证邮件已发送，请检查您的邮箱。如果您没有收到邮件，请检查您的垃圾邮件文件夹或联系我们。',
    AccountChangeEmail: '修改',

    AccountChangePassword: '修改密码',
    AccountClickToChange: '点击修改',

    OldPassword: '旧密码',
    NewPassword: '新密码',
    ConfirmNewPassword: '确认新密码',
    ChangePassword: '保存',

    ChangePasswordNotification: {
      ErrorTitle: '错误',
      INVALID_PASSWORD: '请填写所有字段',
      PASSWORD_MISMATCH: '新密码与确认密码不匹配',
      INCORRECT_OLD_PASSWORD: '旧密码不正确',
      USER_NOT_FOUND: '用户不存在',

      PASSWORD_SAME_AS_OLD: '新密码与旧密码相同，请尝试另一个密码。',

      SUCCESS: '成功',
      SUCCESS_MESSAGE: '密码修改成功',

      UnknownErrorTitle: '未知错误',
      UnknownErrorDescription:
        '修改密码失败，请重试。如果问题仍然存在，请联系我们。',
    },

    Logout: '登出',
    ClickToLogout: '点击登出',

    NewEmailInputPlaceholder: '输入你的新邮箱地址',
    ChangeEmail: '修改邮箱',
    NeedVerifyEmail: '在更新完你的邮箱之后，你需要重新验证你的邮箱地址。',
    ChangeEmailNotification: {
      ErrorTitle: '错误',
      INVALID_EMAIL: '请输入有效的电子邮件地址。',

      SUCCESS: '成功',
      SUCCESS_MESSAGE: '邮箱地址已成功更改, 请验证您的邮箱。',

      EMAIL_DUPLICATE:
        '新邮箱地址已被使用, 请重新输入。如果这个邮箱地址是您的，请联系我们。',

      EMAIL_SAME_AS_OLD: '新邮箱地址与旧邮箱地址相同, 请重新输入。',

      UnknownErrorTitle: '未知错误',
      UnknownErrorDescription:
        '更改邮箱失败，请重试。如果问题仍然存在，请联系我们。',
    },
  },
  GetStartedPage: {
    NEED_HELP: '遇到问题？',
    JOIN_DISCORD: '加入 Discord 社区',
    SCRIPT_LOADING: '正在准备你的脚本…',
    SCRIPT_ERROR_HELP: '请检查设置中的游戏版本和登录状态，然后重试。',
    RETRY: '重试',
    EMAIL_UNVERIFIED: {
      Prefix: '您尚未验证您的电子邮件地址。请前往',
      SettingsPage: '设置页面',
      Suffix: '验证您的电子邮件地址，以便我们确认您的身份。',
    },
    Title: '快速开始',
    STEP_1: {
      Title: '1. 使用 Live Editor 打开 FC 24–27',
      DownloadLink: '下载链接:',
    },
    STEP_2: {
      Title: '2. 进入职业模式',
      Description: '请先进入 FC 24–27 职业模式。',
    },
    STEP_3: {
      Title: '3. 打开 Lua 脚本',
      Description: '在职业模式中唤醒 Live Editor 并进入 Lua 脚本功能。',
    },
    STEP_4: {
      Title: '4. 粘贴以下代码片段',
      Description:
        '复制下面的代码，将其粘贴到 LIVE Editor 的 Lua 脚本中，然后点击执行按钮。',
    },

    GET_STARTED_TEXT: `
# 开始使用
按游戏版本选择对应的 [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor)、[FC 25](https://github.com/xAranaktu/FC-25-Live-Editor)、[FC 26](https://github.com/xAranaktu/FC-26-Live-Editor) 或 [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor) Live Editor，并确认它兼容当前游戏更新。下方脚本已包含您的个人 API 密钥。
\`Lua Engine\` 选项卡。
4. 粘贴下面的代码片段。`,
    SUCCESS: '成功',
    SUCCESS_MESSAGE: '已复制到剪贴板',
    ERROR: '错误',
    ERROR_MESSAGE: '复制失败。请手动复制代码。',
    COPY_TO_CLIPBOARD: '复制到剪贴板',
    HIDE_ALL_CODE: '隐藏所有代码',
    SHOW_ALL_CODE: '显示所有代码',
    CODE_NOT_SHARE_WARNING:
      '这些代码包含您的秘钥。请不要与任何人分享这些代码哦~',
    IMPORTANT_TIPS: `
# 重要提示
- 选择对应的 FC 版本，载入经理职业模式后再运行脚本。更换密钥或游戏版本后，请重新复制脚本。
- 脚本立即上传一次完整阵容，此后每个游戏周上传一次。阵容采集不完整时会跳过上传，请查看 Live Editor 日志中的原因。
- 支持内置上传的编辑器会直接发送数据；FC 24 和旧版编辑器会使用 Windows curl 和临时文件，可能出现命令窗口，无需向游戏目录写入文件。
- FC 24 保留日期补偿逻辑，请在读档后运行脚本，并留意记录中的日期。
- 每个账号的每个游戏版本请只跟踪一个生涯存档，不同存档的数据尚未分开。
- 重复执行只替换本脚本自己的监听器，其他职业模式脚本的监听器会保留。
`,
    VIDEO_TUTORIAL_TITLE: `视频教程`,
    VIDEO_TUTORIAL_DESCRIPTION: `您也可以通过视频教程了解如何使用此应用程序。`,
  },
  NotificationPopover: {
    Title: '通知',
    OnlyShowUnread: '只显示未读',
    SwitchOn: '开',
    SwitchOff: '关',
    MarkAllAsRead: '全部标记为已读',
    FilterOption: {
      All: '全部',
      Overall: '总评/潜力',
      SkillMove: '花式',
      WeakFoot: '逆足',
    },
  },
  NotificationItem: {
    UnknownMessageType: '未知消息类型',
    GameDate: '游戏日期',
    SkillMove: '花式',
    WeakFoot: '逆足',
    Overall: '总评',
    Potential: '潜力',
    MarkAsRead: '标记为已读',
  },
};
