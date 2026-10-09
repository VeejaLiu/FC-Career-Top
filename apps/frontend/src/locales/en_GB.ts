export default {
  LoginComponent: {
    VideoTutorial: 'How to use this app? Learn more through the video!',
    welcome: 'Welcome to back',
    usernameEmail: 'Username / Email',
    usernameEmailPlaceholder: 'your username or email',
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
      'Please enter a valid email address. You need to verify your email address after registration.',
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
    title: 'Career.Top',
    switchVersion: 'Switch Game Version',
    current: 'Current',
  },
  Navbar: {
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
  NoDataComponent: {
    prefix: 'Nothing to display yet. Visit our',
    getStartedPage: 'Get Started',
    suffix: 'to begin your journey.',
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
    EMAIL_UNVERIFIED: {
      Prefix: 'You have not verified your email address. Please go to',
      SettingsPage: 'Settings Page',
      Suffix: 'to verify your email address first.',
    },

    Title: 'Quick Start',
    STEP_1: {
      Title: '1. Open the FC24/FC25 with Live Editor.',
      DownloadLink: 'Download link:',
    },
    STEP_2: {
      Title: '2. Enter career mode.',
      Description: 'Please enter FC24/FC25 career mode first.',
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
## 1. Dependencies
- Latest **[xAranaktu/FC-24-Live-Editor](https://www.patreon.com/collection/96422?view=expanded)** or **[xArnatu/FC-25-Live-Editor](https://www.patreon.com/collection/779838?view=expanded)**.
- **Secret API key**. (You can manage it from [Setting Page](/settings), BUT you don't really need it because I have put it in the code snippet below for you)
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
# Important Notes & Tips

### 1. In-game Date Might Not Be Perfectly Accurate!

You might have noticed that we’re tracking player stat growth as the in-game time changes.  
BUT here’s a little secret: it’s tricky for us to get the exact in-game date! We used to pull that data from the “career_table” you can find in the Live Editor under the Table tab. But after a certain game update, the data in that table isn’t accurate anymore. Interestingly, I found a pattern: the table is accurate when you first enter Career Mode or after you play a match. 

So, based on that, we had to create a manual time calculation method by listening to the DAY_PASSED event in the game and cross-referencing it with the data we can still get. It’s a bit clunky, and I had to add a bunch of redundant code to make it work. But for now, that’s our only option. So, when using this script, don’t rely too heavily on the in-game date, as it might not be spot-on.  

And please, run this script immediately after entering Career Mode to get the most accurate data possible. Otherwise, the data will only become accurate after you play a match.  

**Our Tip: Run this script right after entering Career Mode!**

### 2. The Annoying Black Window! It Might Steal Your Focus.

Let me explain how this works. Our application relies on the functions provided by Live Editor. Whenever the WEEK_PASSED event is triggered in the game, our Lua script runs, collecting data from all your current team players and sending it to our server. But here’s the catch: Live Editor doesn’t offer a way to send API requests directly to an external server, so we’re using Windows’ Curl command to do that. 

Unfortunately, every time we run that command, a black window pops up because we’re executing Curl in the Windows system. And sometimes, this black window might steal focus from your game, which is a bummer. It doesn’t happen every time, but it’s possible. It’s far from perfect, but it’s the best we can do right now. 

I’m sorry about this inconvenience, but I’m constantly searching for a better solution. So, while using this application, please don’t close that black window—it’s busy sending the API request. If your network isn’t too slow, the window should disappear quickly. In my experience, it’s bearable since the black window only pops up once per in-game week. And hey, it’s a small price to pay for keeping track of your players’ progress, right? Rest assured, I’m on the lookout for a better solution, and I’ll update the application as soon as we find one. Thanks for your understanding!

### 3. Only One Save Slot Supported!

During the closed beta, we’re only supporting one save slot. This is because our server resources are limited, and we can’t provide a separate save for every single user. Plus, I doubt anyone is switching save files back and forth that often, so I think this limitation is fair. In the future, we might offer more save slots, but who knows? The future is full of surprises!

### 4. Issues Caused by Insufficient File System Permissions

Let me explain why this script requires file system permissions. As we mentioned earlier, we use the command line to directly execute a curl command to send your player data. However, due to the numerous player attributes, the JSON data string can get very long, making it impossible to concatenate all this data in a single line of curl, as it exceeds the command line's allowed length. 

Therefore, what I do is write this data to a file first and then concatenate the file's path in the command. Based on this, please ensure you have administrative privileges and write permissions for the folder. Generally, we will write to the root directory of the EA FC game, and if writing fails, an error will be displayed: "Permission denied."`,
    VIDEO_TUTORIAL_TITLE: `Video Tutorial`,
    VIDEO_TUTORIAL_DESCRIPTION: `You can also learn how to use this app through the video tutorial.`,
  },
  NotificationPopover: {
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
