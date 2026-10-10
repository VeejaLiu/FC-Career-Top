export default {
  LoginComponent: {
    VideoTutorial: 'How to use this app? Learn more through the video!',
    welcome: 'Welcome to back',
    usernameEmail: 'Email',
    usernameEmailPlaceholder: 'Your email',
    password: 'Password',
    passwordPlaceholder: 'your password',
    login: 'Login',
    registerPrompt: "Don't have an account? Register",
  },
  RegisterComponent: {
    title: 'Start your great journey',
    text: 'Free to use, forever',
    username: 'Username',
    usernamePlaceholder: 'your username',
    email: 'Email',
    emailTooltip:
      'Enter a valid email address. Email verification is currently disabled.',
    emailPlaceholder: 'your email',
    password: 'Password',
    passwordTooltip:
      'Password must contain at least three of the following: uppercase letters, lowercase letters, numbers, or special characters, and must be at least 6 characters long.',
    passwordPlaceholder: 'your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'confirm your password',
    register: 'Register',
    loginPrompt: 'Already have an account? Login',

    invalidUsername:
      'Username must start with a letter, be 6 to 20 characters long, and only allow letters, numbers, underscores, and dots.',

    invalidEmail: 'Please enter a valid email address.',

    passwordError:
      'Password must contain at least three of the following: uppercase letters, lowercase letters, numbers, or special characters, and must be at least 6 characters long.',
    passwordMismatch:
      'The passwords do not match. Please make sure both entries are the same.',

    registerSuccess:
      'Register success! Will redirect to login page in 3 seconds',
  },
  WebsiteLogoComponent: {
    title: 'FCT',
    switchVersion: 'Switch Game Version',
    current: 'Current',
  },
  Navbar: {
    Language: 'Language',
    MyAccount: 'My account',
    PlayersList: 'Players',
    PlayerDetail: 'Detail',
    PlayersTrends: 'Trends',
    Settings: 'Settings',
    GetStarted: 'Get Started',
    VisitGithub: 'Visit Github',
    JoinDiscord:
      'Join Our Discord Server to Get Help / Feedback / Report Bugs / Suggestions, or Just Chat with Us!',
    SwitchLanguage: '切换为中文',
    Hello: 'Hi, ',
    Logout: 'Sign out',
  },
  AsyncState: {
    error: 'Could not load data. Check your connection and try again.',
    retry: 'Retry',
  },
  NoDataComponent: {
    prefix: 'Nothing to display yet. Visit our',
    getStartedPage: 'Get Started',
    suffix: 'to begin your journey.',
  },
  PlayerTrendsPage: {
    FOR: 'Forwards',
    MID: 'Midfielders',
    DEF: 'Defenders',
    GK: 'Goalkeepers',
  },
  PlayerListTable: {
    name: 'Name',
    age: 'Age',
    position: 'Pos',
    overall: 'Ovr',
    SkillMovesAndWeakFoot: 'SM / WF',
    SkillMoves: 'SM',
    SkillMovesTooltip: 'Skill Moves',
    WeakFoot: 'WF',
    WeakFootTooltip: 'Weak Foot',
    potential: 'Pot',
    overallRankingTips:
      'The player ranks {ranking} in overall for his position({position}).',
    potentialRankingTips:
      'The player ranks {ranking} in potential for his position({position}).',
  },
  PlayerDetailPage: {
    Profile: {
      Birthday: 'Date of birth',
      DoubleYellow: 'Two yellows',
      AverageAttribute: 'Attribute average',
      CopyNewScript:
        'Copy and run the latest script from Get Started to collect the additional player data.',
      Yes: 'Yes',
      No: 'No',
      Profile: 'Player profile',
      Reputation: 'International reputation',
      BodyType: 'Body type',
      RealFace: 'Real face',
      Gender: 'Gender',
      Male: 'Male',
      Female: 'Female',
      Nationality: 'Nationality (game ID)',
      SecondNationality: 'Second nationality (game ID)',
      AccelerationType: 'Acceleration type',
      DerivedNote:
        'Calculated labels use verified rules for this game version. A dash means the editor did not supply the data.',
      SoFIFAReference: 'View the original SoFIFA reference',
      Roles: 'Role familiarity',
      NoRolesInVersion: 'FC 24 uses work rates; FC IQ roles start with FC 25.',
      NotAvailable:
        'This editor did not provide the data in the latest snapshot.',
      NoRoles: 'No enhanced roles recorded.',
      HiddenTraits: 'Hidden and AI traits',
      NoTraits: 'No hidden traits recorded.',
      UnknownBits:
        'Unrecognized trait bits have been preserved in the captured data.',
      Contract: 'Club and contract',
      Joined: 'Joined',
      ContractUntil: 'Contract valid until',
      Wage: 'Wage',
      ReleaseClause: 'Release clause',
      Value: 'Market value',
      Jersey: 'Kit number',
      Club: 'Club / game ID',
      MoneyNote:
        'Amounts use the game’s own units. Website valuations are not used to replace career values.',
      CareerState: 'Career status',
      DatabaseOverall: 'Database OVR',
      DynamicOverall: 'Dynamic OVR',
      BaselineOverall: 'Baseline OVR',
      GrowthProfile: 'Growth profile (game ID)',
      SquadRank: 'Squad rank',
      Form: 'Form',
      Morale: 'Morale',
      Fitness: 'Match fitness',
      Injury: 'Injury (game ID)',
      InjuryDays: 'Injury duration',
      CareerNote:
        'New career systems are shown only when the editor exposes their values. Database OVR is not assumed to be Dynamic OVR.',
      OtherCareerFields: 'Other recorded career fields',
      SeasonStats: 'Current-season statistics',
      NoMatches: 'No competition statistics recorded yet.',
      Competition: 'Competition',
      Appearances: 'Apps',
      Goals: 'Goals',
      Assists: 'Assists',
      Average: 'Rating',
      CleanSheets: 'Clean sheets',
      Saves: 'Saves',
      Conceded: 'Conceded',
      Yellow: 'Yellow',
      Red: 'Red',
      MOTM: 'MOTM',
      SeasonNote:
        'Statistics come from Live Editor’s current-season API. Some fields and competitions may be incomplete; values are not estimated.',
      AllCapturedData: 'All recorded game data',
      RawNote:
        'New or unfamiliar fields are preserved here with their original game IDs. Availability flags show which sources the editor supplied.',
      GameCode: 'Game ID',
      Lean: 'Lean',
      Normal: 'Normal',
      Stocky: 'Stocky',
      Explosive: 'Explosive',
      Lengthy: 'Lengthy',
      Controlled: 'Controlled',
      Calculated: 'Calculated',
    },
    BasicInfo: {
      PlayerID: 'ID',
      Age: 'Age',
      Skills: 'Skill moves',
      WeakFoot: 'Weak Foot',
      Foot: 'Foot',
      Height: 'Height',
      Weight: 'Weight',
      AttackingWorkRate: 'Att. WR',
      DefensiveWorkRate: 'Def. WR',
      PlayerName: 'Name',
      OverallRating: 'Ovr',
      Potential: 'Pot',
    },
    Attributes: {
      Pace: 'Pace',
      Acceleration: 'Acceleration',
      SprintSpeed: 'Sprint Speed',

      Shooting: 'Shooting',
      AttackingPosition: 'Att. Position',
      Finishing: 'Finishing',
      ShotPower: 'Shot Power',
      LongShots: 'Long Shots',
      Volleys: 'Volleys',
      Penalties: 'Penalties',

      Passing: 'Passing',
      Vision: 'Vision',
      Crossing: 'Crossing',
      FKAccuracy: 'FK Acc.',
      ShortPass: 'Short Pass',
      LongPass: 'Long Pass',
      Curve: 'Curve',

      Dribbling: 'Dribbling',
      Agility: 'Agility',
      Balance: 'Balance',
      Reactions: 'Reactions',
      BallControl: 'Ball Control',
      Composure: 'Composure',

      Defending: 'Defending',
      Interceptions: 'Interceptions',
      HeadingAccuracy: 'Heading Acc.',
      DefensiveAwareness: 'Def. Aware',
      StandingTackle: 'Stand Tackle',
      SlidingTackle: 'Slide Tackle',

      Physical: 'Physical',
      Jumping: 'Jumping',
      Stamina: 'Stamina',
      Strength: 'Strength',
      Aggression: 'Aggression',

      Goalkeeping: 'Goalkeeping',
      GKDiving: 'GK Diving',
      GKHandling: 'GK Handling',
      GKKicking: 'GK Kicking',
      GKReflexes: 'GK Reflexes',
      GKPositioning: 'GK Positioning',
    },
  },

  SettingsPage: {
    Settings: 'Settings',

    APISecretKey: 'API Secret Key',
    ClickToCopy: 'Click to copy your API secret key',
    Copy: 'Copy',
    ClickToRefresh:
      'Click to refresh your API secret key, this will invalidate your old key',
    Refresh: 'Refresh',
    CopySuccessMessage: 'Secret key copied to clipboard',
    FailedToCopyMessage:
      'Failed to copy secret key to clipboard, please try again',
    DoNotShareSecretKey: 'Warning: Do not share your secret key with anyone!',

    Notifications: 'Notifications',
    EnableNotifications: 'Enable Notifications',
    PlayerOverallPotentialUpdate: 'Player Ovr/Pot Update',
    PlayerSkillMoveUpdate: 'Player Skill Move Update',
    PlayerWeakFootUpdate: 'Player Weak Foot Update',

    AccountInfo: 'Account Info',
    AccountUnverifiedWarningBanner:
      'Your email address is not verified. Please click the button below to verify your email address so we can confirm your identity.',
    AccountUsername: 'Username',
    AccountEmail: 'Email',
    AccountEmailVerified: 'Verified',
    AccountEmailUnverified: 'Unverified',
    AccountEmailUnverifiedTooltip:
      'Email is not verified, Click to send an email. We will send you a verification email including a link to verify your email address.',
    AccountEmailSendTooFrequently:
      'Email sent too frequently, please wait {waitSeconds} seconds',
    AccountEmailSendToast:
      'Verification email sent, please check your email. If you do not receive the email, please check your spam folder or contact us.',
    AccountChangeEmail: 'Change',

    AccountChangePassword: 'Change Password',
    AccountClickToChange: 'Click to change',

    OldPassword: 'Old Password',
    NewPassword: 'New Password',
    ConfirmNewPassword: 'Confirm New Password',
    ChangePassword: 'Save',
    ChangePasswordNotification: {
      ErrorTitle: 'Error',
      INVALID_PASSWORD: 'Please fill in all fields',
      PASSWORD_MISMATCH: 'New password and confirm password do not match',
      INCORRECT_OLD_PASSWORD: 'The old password is incorrect',
      USER_NOT_FOUND: 'User not found',

      PASSWORD_SAME_AS_OLD:
        'The new password is the same as the old one. Please try another one.',

      SUCCESS: 'Success',
      SUCCESS_MESSAGE: 'Password changed successfully',

      UnknownErrorTitle: 'Unknown Error',
      UnknownErrorDescription:
        'Failed to change password. Please try again. If the problem persists, please contact us.',
    },

    Logout: 'Logout',
    ClickToLogout: 'Click here to logout',

    NewEmailInputPlaceholder: 'Enter your new email',
    ChangeEmail: 'Change Email',
    NeedVerifyEmail:
      'You need to verify your new email address after changing it.',
    ChangeEmailNotification: {
      ErrorTitle: 'Error',
      INVALID_EMAIL: 'Please enter a valid email address.',

      SUCCESS: 'Success',
      SUCCESS_MESSAGE: 'Email changed successfully. Please verify your email.',

      EMAIL_DUPLICATE:
        'The new email address is already in use. Please try another one. If the email belongs to you, please contact us.',

      EMAIL_SAME_AS_OLD:
        'The new email address is the same as the old one. Please try another one.',

      UnknownErrorTitle: 'Unknown Error',
      UnknownErrorDescription:
        'Failed to change email. Please try again. If the problem persists, please contact us.',
    },
  },

  GetStartedPage: {
    NEED_HELP: 'Need a hand?',
    JOIN_DISCORD: 'Join the Discord community',
    SCRIPT_LOADING: 'Preparing your script…',
    SCRIPT_ERROR_HELP:
      'Check your game version in Settings and your login status, then try again.',
    RETRY: 'Try again',
    EMAIL_UNVERIFIED: {
      Prefix: 'You have not verified your email address. Please go to',
      SettingsPage: 'Settings Page',
      Suffix: 'to verify your email address first.',
    },

    Title: 'Quick Start',
    STEP_1: {
      Title: '1. Open the FC 24–27 with Live Editor.',
      DownloadLink: 'Download link:',
    },
    STEP_2: {
      Title: '2. Enter career mode.',
      Description: 'Please enter FC 24–27 career mode first.',
    },
    STEP_3: {
      Title: '3. Open Lua script',
      Description:
        'Wake up the Live editor in career mode and enter the Lua script function.',
    },
    STEP_4: {
      Title: '4. Paste the code snippet below',
      Description:
        'Copy the code below, paste it into the Lua script of the LIVE Editor, and click the execute button.',
    },

    GET_STARTED_TEXT: `
# Get Started
Use the matching [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor), [FC 25](https://github.com/xAranaktu/FC-25-Live-Editor), [FC 26](https://github.com/xAranaktu/FC-26-Live-Editor) or [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor) Live Editor for your game build. Your personal API key is already included in the script below.
`,
    SUCCESS: 'Success',
    SUCCESS_MESSAGE: 'Copied to clipboard',
    ERROR: 'Error',
    ERROR_MESSAGE: 'Failed to copy. Please manually copy the code.',
    COPY_TO_CLIPBOARD: 'Copy to clipboard',
    HIDE_ALL_CODE: 'Hide all code',
    SHOW_ALL_CODE: 'Show all code',
    CODE_NOT_SHARE_WARNING:
      'Warning: These codes contain your secret key. Do not share these codes with others.',
    IMPORTANT_TIPS: `
# Important notes
- Select the matching FC version and load Manager Career Mode before running the script. Copy a new script after changing your API key or game version.
- An initial squad snapshot is uploaded immediately, followed by snapshots each in-game week. Incomplete squads are skipped; check the Live Editor log if an upload is missing.
- Supported editors upload directly. FC 24 and older editors use Windows curl and temporary files; a command window may appear. The game folder does not need write permission.
- FC 24 retains its date workaround. Run the script after loading your career, and check the displayed dates.
- Use one career per account and game version. Different saves are not separated.
- Running this script again replaces only its own listener. Other career-mode scripts keep their listeners.
`,
    VIDEO_TUTORIAL_TITLE: `Video Tutorial`,
    VIDEO_TUTORIAL_DESCRIPTION: `You can also learn how to use this app through the video tutorial.`,
  },
  NotificationPopover: {
    FilterLabel: 'Filter notifications',
    Empty: 'No notifications yet',
    EmptyUnread: 'No unread notifications',

    Title: 'Notifications',
    OnlyShowUnread: 'only show unread',
    SwitchOn: 'On',
    SwitchOff: 'Off',
    MarkAllAsRead: 'Mark all as read',
    FilterOption: {
      All: 'All',
      Overall: 'Ovr/Pot',
      SkillMove: 'Skill Move',
      WeakFoot: 'Weak Foot',
    },
  },
  NotificationItem: {
    UnknownMessageType: 'Unknown message type',
    GameDate: 'Game Date',
    SkillMove: 'Skill Move',
    WeakFoot: 'Weak Foot',
    Overall: 'Ovr',
    Potential: 'Pot',
    MarkAsRead: 'Mark as read',
  },
};
