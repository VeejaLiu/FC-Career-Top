export default {
  LoginComponent: {
    VideoTutorial: '如何使用这个应用?通过视频了解更多！',
    welcome: '欢迎回来',
    usernameEmail: '用户名 / 邮箱',
    usernameEmailPlaceholder: '您的用户名或邮箱',
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
    emailTooltip: '请输入有效的电子邮件地址。注册后需要验证您的电子邮件地址。',
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
    title: 'Career.Top',
    switchVersion: '切换游戏版本',
    current: '当前版本',
  },
  Navbar: {
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
  NoDataComponent: {
    prefix: '暂无数据哦。请前往',
    getStartedPage: '快速开始',
    suffix: '开启您的精彩旅程',
  },
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
    EMAIL_UNVERIFIED: {
      Prefix: '您尚未验证您的电子邮件地址。请前往',
      SettingsPage: '设置页面',
      Suffix: '验证您的电子邮件地址，以便我们确认您的身份。',
    },
    Title: '快速开始',
    STEP_1: {
      Title: '1. 使用 Live Editor 打开 FC24/FC25',
      DownloadLink: '下载链接:',
    },
    STEP_2: {
      Title: '2. 进入职业模式',
      Description: '请先进入 FC24/FC25 职业模式。',
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
# 开始
## 1. 依赖
- 最新的 **[xAranaktu/FC-24-Live-Editor](https://www.patreon.com/collection/96422?view=expanded)** 或 **[xAranaktu/FC-25-Live-Editor](https://www.patreon.com/collection/779838?view=expanded)**。
- **API 密钥**。（您可以在 [设置页面](/settings) 管理它，但您实际上不需要它，因为我已经在下面的代码片段中为您放入了它）

## 2. 安装
1. 打开带有Live Editor的 FC24/FC25。
2. 进入职业模式。
3. 在实时编辑器中转到 \`Lua Engine\` 选项卡。
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

### 1. 游戏内日期可能不完全准确！

您可能注意到，我们正在跟踪球员统计数据的增长，随着游戏内时间的变化。
但这里有一个小秘密：我们很难获取确切的游戏内日期！我们曾经从您可以在实时编辑器的表格选项卡中找到的“career_table”中提取该数据。但在某个游戏更新后，该表中的数据不再准确。有趣的是，我发现了一个模式：当您第一次进入职业模式或在比赛后，表格是准确的。

因此，根据这一点，我们不得不创建一种手动时间计算方法，通过监听游戏中的 DAY_PASSED 事件，并与我们仍然可以获取的数据进行交叉引用。这有点笨拙，我不得不添加大量冗余代码来让它工作。但目前，这是我们唯一的选择。因此，在使用该脚本时，请不要过于依赖游戏内日期，因为它可能并不准确。

请您在进入职业模式后立即运行该脚本，以获取尽可能准确的数据。否则，数据只有在您进行比赛后才会变得准确。

**我们的建议：在进入职业模式后立即运行该脚本！**

### 2. 恼人的黑窗口！它可能抢走您的焦点。

让我解释一下它是如何工作的。我们的应用程序依赖于实时编辑器提供的功能。每当游戏中触发 WEEK_PASSED 事件时，我们的 Lua 脚本会运行，收集您当前队伍中所有球员的数据并将其发送到我们的服务器。但这里有个问题：实时编辑器不提供直接向外部服务器发送 API 请求的方法，因此我们使用 Windows 的 Curl 命令来做到这一点。

不幸的是，每次我们运行该命令时，都会弹出一个黑窗口，因为我们在 Windows 系统中执行 Curl。有时，这个黑窗口可能会抢走您游戏的焦点，这真的很糟糕。虽然这并不是每次都会发生，但确实可能。它远非完美，但这是我们目前能做的最好选择。

对此带来的不便，我深表歉意，但我正在不断寻找更好的解决方案。因此，在使用该应用程序时，请不要关闭那个黑窗口——它正在忙着发送 API 请求。如果您的网络不太慢，该窗口应该会迅速消失。根据我的经验，这还算可以，因为黑窗口每个游戏周只会弹出一次。嘿，为了跟踪您球员的进展，这也是个小代价，对吧？请放心，我会继续寻找更好的解决方案，并在找到后立即更新应用程序。感谢您的理解！

### 3. 仅支持一个存档槽！

在封闭测试期间，我们仅支持一个存档槽。这是因为我们的服务器资源有限，无法为每个用户提供单独的存档。此外，我怀疑没有人会频繁地切换存档文件，所以我认为这个限制是合理的。未来，我们可能会提供更多的存档槽，但谁知道呢？未来充满惊喜！

### 4. 由于文件系统权限不足导致的问题

让我解释一下为什么这个脚本需要文件系统权限。正如我们之前提到的，我们使用命令行直接执行 curl 命令来发送您的球员数据。但是，由于众多球员属性，JSON 数据字符串可能会变得非常长，导致无法在单行的 curl 中连接所有这些数据，因为超出了命令行的允许长度。

因此，我的做法是先将这些数据写入文件，然后在命令中连接文件的路径。基于此，请确保您拥有管理员权限和文件夹的写入权限。通常，我们将写入 EA FC 游戏的根目录，如果写入失败，将显示错误：“权限被拒绝。”`,
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
