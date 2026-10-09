export default {
  LoginComponent: {
    VideoTutorial: 'このアプリの使い方は？ビデオでもっと学びましょう！',
    welcome: 'おかえりなさい',
    usernameEmail: 'ユーザー名 / メール',
    usernameEmailPlaceholder: 'ユーザー名またはメール',
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
      '有効なメールアドレスを入力してください。登録後、メールアドレスの確認が必要です。',
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
    title: 'Career.Top',
    switchVersion: 'ゲームバージョンを切り替える',
    current: '現在',
  },
  Navbar: {
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
  NoDataComponent: {
    prefix: 'まだ表示するものがありません。',
    getStartedPage: '始める',
    suffix: 'ページを訪れて旅を始めましょう。',
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
    EMAIL_UNVERIFIED: {
      Prefix: 'メールアドレスが確認されていません。',
      SettingsPage: '設定ページ',
      Suffix: 'に移動して、まずメールアドレスを確認してください。',
    },

    Title: 'クイックスタート',
    STEP_1: {
      Title: '1. ライブエディターでFC24/FC25を開く。',
      DownloadLink: 'ダウンロードリンク：',
    },
    STEP_2: {
      Title: '2. キャリアモードに入る。',
      Description: 'まずFC24/FC25のキャリアモードに入ってください。',
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
# 始めましょう
## 1. 依存関係
- 最新の**[xAranaktu/FC-24-Live-Editor](https://www.patreon.com/collection/96422?view=expanded)**または**[xArnatu/FC-25-Live-Editor](https://www.patreon.com/collection/779838?view=expanded)**。
- **シークレットAPIキー**。（[設定ページ](/settings)から管理できますが、以下のコードスニペットに含まれているのでそれを使用できます）
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
# 重要なメモとヒント

### 1. ゲーム内の日付は完全に正確ではないかもしれません！

ゲーム内の時間が変わるにつれて選手のステータス成長を追跡していることにお気づきかもしれません。
しかし、ここに小さな秘密があります：正確なゲーム内の日付を取得するのは難しいのです！以前は、テーブルタブのLiveエディターで見つかる「career_table」からそのデータを取得していました。しかし、あるゲームアップデート以降、そのテーブルのデータは正確ではなくなりました。興味深いことに、パターンを発見しました：テーブルはキャリアモードに最初に入ったときか、試合をプレイした後に正確になります。

そのため、私たちはゲーム内のDAY_PASSEDイベントを聞き、まだ取得できるデータと照らし合わせることで、手動の時間計算方法を作成する必要がありました。少し不格好で、動作させるために冗長なコードを追加する必要がありました。しかし、今のところそれが唯一の選択肢です。したがって、このスクリプトを使用する際には、ゲーム内の日付に過度に依存しないでください。正確ではないかもしれません。

そして、最も正確なデータを得るために、キャリアモードに入った直後にこのスクリプトを実行してください。そうしないと、試合をプレイした後でしかデータは正確になりません。

**私たちのヒント：キャリアモードに入った直後にこのスクリプトを実行してください！**

### 2. 煩わしい黒いウィンドウ！あなたの注意を奪うかもしれません。

これがどのように機能するか説明しましょう。私たちのアプリケーションはLiveエディターによって提供される機能に依存しています。ゲーム内でWEEK_PASSEDイベントがトリガーされるたびに、私たちのLuaスクリプトが実行され、現在のチームのすべての選手からデータを収集し、それを私たちのサーバーに送信します。しかし、ここに問題があります：Liveエディターは外部サーバーに直接APIリクエストを送信する方法を提供していないため、そのためにWindowsのCurlコマンドを使用しています。

残念ながら、そのコマンドを実行するたびに、Windowsシステムでcurlを実行するため黒いウィンドウがポップアップします。そして時々、この黒いウィンドウがあなたのゲームから注意を奪うことがあり、それは残念なことです。毎回起こるわけではありませんが、可能性はあります。完璧とは言えませんが、今のところできる限りのことです。

この不便さについては申し訳ありませんが、より良い解決策を常に探しています。そのため、このアプリケーションを使用する際には、その黒いウィンドウを閉じないでください—それはAPIリクエストを送信している最中です。ネットワークがあまり遅くなければ、ウィンドウはすぐに消えるはずです。私の経験では、黒いウィンドウはゲーム内の週に一度だけポップアップするので、耐えられます。選手の進捗を追跡するためには小さな代償ですね？より良い解決策を見つけ次第、アプリケーションを更新することをお約束します。ご理解いただきありがとうございます！

### 3. サポートされるセーブスロットは1つだけ！

クローズドベータ期間中は、1つのセーブスロットのみをサポートしています。これは、サーバーリソースが限られており、すべてのユーザーに別個のセーブを提供することができないためです。また、誰もがそれほど頻繁にセーブファイルを切り替えているとは思えないので、この制限は公平だと思います。将来的には、より多くのセーブスロットを提供するかもしれませんが、誰にもわかりません！未来は驚きに満ちています！

### 4. ファイルシステムの権限不足による問題

このスクリプトがファイルシステムの権限を必要とする理由を説明します。前述したように、選手データを送信するためにcurlコマンドを直接実行するコマンドラインを使用します。しかし、多数の選手属性のため、JSONデータ文字列が非常に長くなり、これらのデータをすべて1行のcurlに連結することができません。コマンドラインの許容長さを超えるためです。

したがって、私がしているのは、まずこのデータをファイルに書き込み、次にコマンドにファイルのパスを連結することです。これに基づいて、管理者権限とフォルダへの書き込み権限があることを確認してください。通常、EA FCゲームのルートディレクトリに書き込みますが、書き込みに失敗すると、「権限が拒否されました」というエラーが表示されます。`,
    VIDEO_TUTORIAL_TITLE: `ビデオチュートリアル`,
    VIDEO_TUTORIAL_DESCRIPTION: `ビデオチュートリアルを通じてこのアプリの使い方を学ぶこともできます。`,
  },
  NotificationPopover: {
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
