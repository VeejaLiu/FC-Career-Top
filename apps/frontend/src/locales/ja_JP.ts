export default {
  LoginComponent: {
    VideoTutorial: 'このアプリの使い方は？ビデオでもっと学びましょう！',
    welcome: 'おかえりなさい',
    usernameEmail: 'メール',
    usernameEmailPlaceholder: 'メールアドレス',
    password: 'パスワード',
    passwordPlaceholder: 'あなたのパスワード',
    login: 'ログイン',
    registerPrompt: 'アカウントをお持ちでない方は登録してください',
  },
  RegisterComponent: {
    title: '素晴らしい旅の始まり',
    text: '永久に無料でご利用いただけます',
    username: 'ユーザー名',
    usernamePlaceholder: 'あなたのユーザー名',
    email: 'メール',
    emailTooltip:
      '有効なメールアドレスを入力してください。現在メール認証は不要です。',
    emailPlaceholder: 'あなたのメール',
    password: 'パスワード',
    passwordTooltip:
      'パスワードは大文字、小文字、数字、特殊文字のうち少なくとも3つを含み、6文字以上である必要があります。',
    passwordPlaceholder: 'あなたのパスワード',
    confirmPassword: 'パスワードの確認',
    confirmPasswordPlaceholder: 'パスワードを確認',
    register: '登録',
    loginPrompt: 'すでにアカウントをお持ちですか？ログイン',

    invalidUsername:
      'ユーザー名は文字で始まり、6〜20文字で、文字、数字、アンダースコア、ドットのみを含む必要があります。',

    invalidEmail: '有効なメールアドレスを入力してください。',

    passwordError:
      'パスワードは大文字、小文字、数字、特殊文字のうち少なくとも3つを含み、6文字以上である必要があります。',
    passwordMismatch:
      'パスワードが一致しません。両方の入力が同じであることを確認してください。',

    registerSuccess: '登録成功！3秒後にログインページにリダイレクトします',
  },
  WebsiteLogoComponent: {
    title: 'FCT',
    switchVersion: 'ゲームバージョンを切り替える',
    current: '現在',
  },
  Navbar: {
    Language: '言語',
    MyAccount: 'マイアカウント',
    PlayersList: '選手',
    PlayerDetail: '詳細',
    PlayersTrends: 'トレンド',
    Settings: '設定',
    GetStarted: '始める',
    VisitGithub: 'Githubを訪問',
    JoinDiscord:
      '私たちのDiscordサーバーに参加して、ヘルプ/フィードバック/バグ報告/提案を受けたり、ただおしゃべりしたりしましょう！',
    SwitchLanguage: 'English に切り替え',
    Hello: 'こんにちは、',
    Logout: 'ログアウト',
  },
  AsyncState: {
    error: 'データを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
  },
  NoDataComponent: {
    prefix: 'まだ表示するものがありません。',
    getStartedPage: '始める',
    suffix: 'ページを訪れて旅を始めましょう。',
  },
  PlayerTrendsPage: {
    FOR: 'フォワード',
    MID: 'ミッドフィールダー',
    DEF: 'ディフェンダー',
    GK: 'ゴールキーパー',
  },
  PlayerListTable: {
    name: '名前',
    age: '年齢',
    position: 'ポジション',
    overall: '総合',
    SkillMovesAndWeakFoot: 'スキル / 利き足',
    SkillMoves: 'スキル',
    SkillMovesTooltip: 'スキルムーブ',
    WeakFoot: '利き足',
    WeakFootTooltip: '弱い方の足',
    potential: '潜在能力',
    overallRankingTips:
      'この選手はポジション({position})の総合評価で{ranking}位にランクされています。',
    potentialRankingTips:
      'この選手はポジション({position})の潜在能力で{ranking}位にランクされています。',
  },
  PlayerDetailPage: {
    Profile: {
      Birthday: '生年月日',
      DoubleYellow: '警告2回',
      AverageAttribute: '能力値の平均',
      CopyNewScript:
        '追加データを記録するには、クイックスタートから最新スクリプトをコピーして実行してください。',
      Yes: 'はい',
      No: 'いいえ',
      Profile: '選手プロフィール',
      Reputation: '国際的な評価',
      BodyType: '体型',
      RealFace: '実際の顔',
      Gender: '性別',
      Male: '男性',
      Female: '女性',
      Nationality: '国籍（ゲームID）',
      SecondNationality: '第二国籍（ゲームID）',
      AccelerationType: '加速タイプ',
      DerivedNote:
        '計算ラベルには確認済みのバージョン別ルールを使用します。ダッシュはデータが提供されていないことを示します。',
      SoFIFAReference: 'SoFIFAの元データを参照',
      Roles: '役割の習熟度',
      NoRolesInVersion:
        'FC 24は攻守の運動量を使用します。FC IQの役割はFC 25から導入されました。',
      NotAvailable: '今回の記録ではエディターがデータを提供していません。',
      NoRoles: '強化された役割は記録されていません。',
      HiddenTraits: '隠れた特性とAI特性',
      NoTraits: '隠れた特性は記録されていません。',
      UnknownBits: '不明な特性ビットは取得データに保存されています。',
      Contract: 'クラブと契約',
      Joined: '加入日',
      ContractUntil: '契約満了年',
      Wage: '給与',
      ReleaseClause: '契約解除金',
      Value: '市場価値',
      Jersey: '背番号',
      Club: 'クラブ／ゲームID',
      MoneyNote:
        '金額はゲーム内の単位です。ウェブサイトの評価額でキャリアの値を置き換えません。',
      CareerState: 'キャリアの状態',
      DatabaseOverall: 'データベース総合値',
      DynamicOverall: '動的総合値',
      BaselineOverall: '基本総合値',
      GrowthProfile: '成長プロファイル（ID）',
      SquadRank: 'チーム内評価',
      Form: '調子',
      Morale: '士気',
      Fitness: '試合の体調',
      Injury: '負傷（ゲームID）',
      InjuryDays: '負傷期間',
      CareerNote:
        '新しいキャリア機能はエディターが値を提供する場合のみ表示します。データベース総合値を動的総合値として扱いません。',
      OtherCareerFields: 'その他のキャリア項目',
      SeasonStats: '今シーズンの統計',
      NoMatches: '大会の統計はまだ記録されていません。',
      Competition: '大会',
      Appearances: '出場',
      Goals: '得点',
      Assists: 'アシスト',
      Average: '評価',
      CleanSheets: '無失点',
      Saves: 'セーブ',
      Conceded: '失点',
      Yellow: '警告',
      Red: '退場',
      MOTM: '最優秀選手',
      SeasonNote:
        '統計はLive EditorのシーズンAPIから取得します。一部の項目や大会は不完全な場合があり、推定値で補いません。',
      AllCapturedData: '取得したゲームデータの全項目',
      RawNote:
        '新しい項目や不明な項目は元のゲームIDとともに保存されます。利用可能なデータの表示で取得元を確認できます。',
      GameCode: 'ゲームID',
      Lean: '細身',
      Normal: '標準',
      Stocky: 'がっしり',
      Explosive: '爆発型',
      Lengthy: '持続型',
      Controlled: 'コントロール型',
      Calculated: '計算値',
    },
    BasicInfo: {
      PlayerID: 'ID',
      Age: '年齢',
      Skills: 'スキルムーブ',
      WeakFoot: '弱い方の足',
      Foot: '利き足',
      Height: '身長',
      Weight: '体重',
      AttackingWorkRate: '攻撃作業率',
      DefensiveWorkRate: '守備作業率',
      PlayerName: '名前',
      OverallRating: '総合',
      Potential: '潜在能力',
    },
    Attributes: {
      Pace: 'スピード',
      Acceleration: '加速',
      SprintSpeed: 'スプリント速度',

      Shooting: 'シュート',
      AttackingPosition: '攻撃位置取り',
      Finishing: 'フィニッシュ',
      ShotPower: 'シュートパワー',
      LongShots: 'ロングシュート',
      Volleys: 'ボレー',
      Penalties: 'ペナルティ',

      Passing: 'パス',
      Vision: 'ビジョン',
      Crossing: 'クロス',
      FKAccuracy: 'FK精度',
      ShortPass: 'ショートパス',
      LongPass: 'ロングパス',
      Curve: 'カーブ',

      Dribbling: 'ドリブル',
      Agility: '敏捷性',
      Balance: 'バランス',
      Reactions: '反応',
      BallControl: 'ボールコントロール',
      Composure: '冷静さ',

      Defending: '守備',
      Interceptions: 'インターセプト',
      HeadingAccuracy: 'ヘディング精度',
      DefensiveAwareness: '守備意識',
      StandingTackle: 'スタンディングタックル',
      SlidingTackle: 'スライディングタックル',

      Physical: '身体能力',
      Jumping: 'ジャンプ',
      Stamina: 'スタミナ',
      Strength: '強さ',
      Aggression: '積極性',

      Goalkeeping: 'ゴールキーパー',
      GKDiving: 'GKダイビング',
      GKHandling: 'GKハンドリング',
      GKKicking: 'GKキッキング',
      GKReflexes: 'GKリフレックス',
      GKPositioning: 'GKポジショニング',
    },
  },

  SettingsPage: {
    Settings: '設定',

    APISecretKey: 'APIシークレットキー',
    ClickToCopy: 'クリックしてAPIシークレットキーをコピー',
    Copy: 'コピー',
    ClickToRefresh:
      'クリックしてAPIシークレットキーを更新（古いキーは無効になります）',
    Refresh: '更新',
    CopySuccessMessage: 'シークレットキーがクリップボードにコピーされました',
    FailedToCopyMessage:
      'シークレットキーのコピーに失敗しました、もう一度お試しください',
    DoNotShareSecretKey: '警告：シークレットキーを他人と共有しないでください！',

    Notifications: '通知',
    EnableNotifications: '通知を有効にする',
    PlayerOverallPotentialUpdate: '選手の総合/潜在能力更新',
    PlayerSkillMoveUpdate: '選手のスキルムーブ更新',
    PlayerWeakFootUpdate: '選手の弱い方の足更新',

    AccountInfo: 'アカウント情報',
    AccountUnverifiedWarningBanner:
      'メールアドレスが確認されていません。下のボタンをクリックしてメールアドレスを確認し、あなたの身元を確認できるようにしてください。',
    AccountUsername: 'ユーザー名',
    AccountEmail: 'メール',
    AccountEmailVerified: '確認済み',
    AccountEmailUnverified: '未確認',
    AccountEmailUnverifiedTooltip:
      'メールが確認されていません、クリックしてメールを送信します。メールアドレスを確認するためのリンクを含む確認メールを送信します。',
    AccountEmailSendTooFrequently:
      'メールの送信が頻繁すぎます、{waitSeconds}秒お待ちください',
    AccountEmailSendToast:
      '確認メールが送信されました、メールを確認してください。メールが届かない場合は、迷惑メールフォルダを確認するか、お問い合わせください。',
    AccountChangeEmail: '変更',

    AccountChangePassword: 'パスワードの変更',
    AccountClickToChange: 'クリックして変更',

    OldPassword: '古いパスワード',
    NewPassword: '新しいパスワード',
    ConfirmNewPassword: '新しいパスワードの確認',
    ChangePassword: '保存',
    ChangePasswordNotification: {
      ErrorTitle: 'エラー',
      INVALID_PASSWORD: 'すべてのフィールドに入力してください',
      PASSWORD_MISMATCH: '新しいパスワードと確認が一致しません',
      INCORRECT_OLD_PASSWORD: '古いパスワードが正しくありません',
      USER_NOT_FOUND: 'ユーザーが見つかりません',

      PASSWORD_SAME_AS_OLD:
        '新しいパスワードが古いパスワードと同じです。別のものを試してください。',

      SUCCESS: '成功',
      SUCCESS_MESSAGE: 'パスワードが正常に変更されました',

      UnknownErrorTitle: '不明なエラー',
      UnknownErrorDescription:
        'パスワードの変更に失敗しました。もう一度お試しください。問題が解決しない場合は、お問い合わせください。',
    },

    Logout: 'ログアウト',
    ClickToLogout: 'ここをクリックしてログアウト',

    NewEmailInputPlaceholder: '新しいメールアドレスを入力',
    ChangeEmail: 'メールの変更',
    NeedVerifyEmail: '変更後、新しいメールアドレスを確認する必要があります。',
    ChangeEmailNotification: {
      ErrorTitle: 'エラー',
      INVALID_EMAIL: '有効なメールアドレスを入力してください。',

      SUCCESS: '成功',
      SUCCESS_MESSAGE:
        'メールが正常に変更されました。メールを確認してください。',

      EMAIL_DUPLICATE:
        '新しいメールアドレスはすでに使用されています。別のものを試してください。そのメールがあなたのものである場合は、お問い合わせください。',

      EMAIL_SAME_AS_OLD:
        '新しいメールアドレスが古いものと同じです。別のものを試してください。',

      UnknownErrorTitle: '不明なエラー',
      UnknownErrorDescription:
        'メールの変更に失敗しました。もう一度お試しください。問題が解決しない場合は、お問い合わせください。',
    },
  },

  GetStartedPage: {
    NEED_HELP: 'お困りですか？',
    JOIN_DISCORD: 'Discordコミュニティに参加',
    SCRIPT_LOADING: 'スクリプトを準備しています…',
    SCRIPT_ERROR_HELP:
      '設定のゲームバージョンとログイン状態を確認して、もう一度お試しください。',
    RETRY: '再試行',
    EMAIL_UNVERIFIED: {
      Prefix: 'メールアドレスが確認されていません。',
      SettingsPage: '設定ページ',
      Suffix: 'に移動して、まずメールアドレスを確認してください。',
    },

    Title: 'クイックスタート',
    STEP_1: {
      Title: '1. ライブエディターでFC 24–27を開く。',
      DownloadLink: 'ダウンロードリンク：',
    },
    STEP_2: {
      Title: '2. キャリアモードに入る。',
      Description: 'まずFC 24–27のキャリアモードに入ってください。',
    },
    STEP_3: {
      Title: '3. Luaスクリプトを開く',
      Description:
        'キャリアモードでライブエディターを起動し、Luaスクリプト機能を開きます。',
    },
    STEP_4: {
      Title: '4. 以下のコードスニペットを貼り付ける',
      Description:
        '以下のコードをコピーし、LIVEエディターのLuaスクリプトに貼り付け、実行ボタンをクリックします。',
    },

    GET_STARTED_TEXT: `
# はじめに
ゲームの更新に対応する [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor)、[FC 25](https://github.com/xAranaktu/FC-25-Live-Editor)、[FC 26](https://github.com/xAranaktu/FC-26-Live-Editor)、または [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor) の Live Editor を使用してください。下のスクリプトには個人用 API キーが含まれています。
`,
    SUCCESS: '成功',
    SUCCESS_MESSAGE: 'クリップボードにコピーされました',
    ERROR: 'エラー',
    ERROR_MESSAGE: 'コピーに失敗しました。手動でコードをコピーしてください。',
    COPY_TO_CLIPBOARD: 'クリップボードにコピー',
    HIDE_ALL_CODE: 'すべてのコードを隠す',
    SHOW_ALL_CODE: 'すべてのコードを表示',
    CODE_NOT_SHARE_WARNING:
      '警告：これらのコードにはあなたのシークレットキーが含まれています。他の人とこれらのコードを共有しないでください。',
    IMPORTANT_TIPS: `
# 注意事項
- 対応する FC バージョンを選び、監督キャリアを読み込んでからスクリプトを実行してください。キーやバージョンを変更した場合は新しいスクリプトをコピーしてください。
- 最初に全選手のデータを送信し、その後はゲーム内で毎週送信します。選手の取得が不完全な場合は送信をスキップします。理由は Live Editor のログをご確認ください。
- 対応するエディターは直接送信します。FC 24 や古いエディターでは Windows curl と一時ファイルを使用するため、コマンドウィンドウが表示される場合があります。ゲームフォルダーへの書き込み権限は不要です。
- FC 24 は日付補正を維持します。キャリアを読み込んだ後に実行し、記録の日付を確認してください。
- アカウントとゲームバージョンごとに一つのキャリアを使用してください。異なるセーブデータは分離されません。
- 再実行時はこのスクリプトのリスナーだけを置き換えます。他のキャリアスクリプトには影響しません。
`,
    VIDEO_TUTORIAL_TITLE: `ビデオチュートリアル`,
    VIDEO_TUTORIAL_DESCRIPTION: `ビデオチュートリアルを通じてこのアプリの使い方を学ぶこともできます。`,
  },
  NotificationPopover: {
    FilterLabel: '通知を絞り込む',
    Empty: '通知はありません',
    EmptyUnread: '未読の通知はありません',

    Title: '通知',
    OnlyShowUnread: '未読のみ表示',
    SwitchOn: 'オン',
    SwitchOff: 'オフ',
    MarkAllAsRead: 'すべて既読にする',
    FilterOption: {
      All: 'すべて',
      Overall: '総合/潜在能力',
      SkillMove: 'スキルムーブ',
      WeakFoot: '弱い方の足',
    },
  },
  NotificationItem: {
    UnknownMessageType: '不明なメッセージタイプ',
    GameDate: 'ゲーム日付',
    SkillMove: 'スキルムーブ',
    WeakFoot: '弱い方の足',
    Overall: '総合',
    Potential: '潜在能力',
    MarkAsRead: '既読にする',
  },
};
