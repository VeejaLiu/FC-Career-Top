export default {
  LoginComponent: {
    VideoTutorial: 'Wie nutzt man diese App? Erfahre mehr durch das Video!',
    welcome: 'Willkommen zurück',
    usernameEmail: 'E-Mail',
    usernameEmailPlaceholder: 'Deine E-Mail',
    password: 'Passwort',
    passwordPlaceholder: 'dein Passwort',
    login: 'Anmelden',
    registerPrompt: 'Noch kein Konto? Registrieren',
  },
  RegisterComponent: {
    title: 'Beginne deine große Reise',
    text: 'Für immer kostenlos',
    username: 'Benutzername',
    usernamePlaceholder: 'dein Benutzername',
    email: 'E-Mail',
    emailTooltip:
      'Gib eine gültige E-Mail-Adresse ein. Eine Bestätigung ist derzeit nicht erforderlich.',
    emailPlaceholder: 'deine E-Mail',
    password: 'Passwort',
    passwordTooltip:
      'Das Passwort muss mindestens drei der folgenden Elemente enthalten: Großbuchstaben, Kleinbuchstaben, Zahlen oder Sonderzeichen und muss mindestens 6 Zeichen lang sein.',
    passwordPlaceholder: 'dein Passwort',
    confirmPassword: 'Passwort bestätigen',
    confirmPasswordPlaceholder: 'bestätige dein Passwort',
    register: 'Registrieren',
    loginPrompt: 'Bereits ein Konto? Anmelden',

    invalidUsername:
      'Der Benutzername muss mit einem Buchstaben beginnen, 6 bis 20 Zeichen lang sein und darf nur Buchstaben, Zahlen, Unterstriche und Punkte enthalten.',

    invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',

    passwordError:
      'Das Passwort muss mindestens drei der folgenden Elemente enthalten: Großbuchstaben, Kleinbuchstaben, Zahlen oder Sonderzeichen und muss mindestens 6 Zeichen lang sein.',
    passwordMismatch:
      'Die Passwörter stimmen nicht überein. Bitte stelle sicher, dass beide Eingaben identisch sind.',

    registerSuccess:
      'Registrierung erfolgreich! Du wirst in 3 Sekunden zur Anmeldeseite weitergeleitet',
  },
  WebsiteLogoComponent: {
    title: 'FCT',
    switchVersion: 'Spielversion wechseln',
    current: 'Aktuell',
  },
  Navbar: {
    Language: 'Sprache',
    MyAccount: 'Mein Konto',
    PlayersList: 'Spieler',
    PlayerDetail: 'Detail',
    PlayersTrends: 'Trends',
    Settings: 'Einstellungen',
    GetStarted: 'Loslegen',
    VisitGithub: 'Github besuchen',
    JoinDiscord:
      'Tritt unserem Discord-Server bei, um Hilfe zu erhalten, Feedback zu geben, Fehler zu melden, Vorschläge zu machen oder einfach nur mit uns zu plaudern!',
    SwitchLanguage: 'Switch to English',
    Hello: 'Hallo, ',
    Logout: 'Abmelden',
  },
  AsyncState: {
    error:
      'Daten konnten nicht geladen werden. Prüfe deine Verbindung und versuche es erneut.',
    retry: 'Erneut versuchen',
  },
  NoDataComponent: {
    prefix: 'Noch nichts anzuzeigen. Besuche unsere',
    getStartedPage: 'Loslegen',
    suffix: 'Seite, um deine Reise zu beginnen.',
  },
  PlayerTrendsPage: {
    FOR: 'Stürmer',
    MID: 'Mittelfeldspieler',
    DEF: 'Verteidiger',
    GK: 'Torhüter',
  },
  PlayerListTable: {
    name: 'Name',
    age: 'Alter',
    position: 'Pos',
    overall: 'Ges',
    SkillMovesAndWeakFoot: 'SM / SF',
    SkillMoves: 'SM',
    SkillMovesTooltip: 'Spezialbewegungen',
    WeakFoot: 'SF',
    WeakFootTooltip: 'Schwacher Fuß',
    potential: 'Pot',
    overallRankingTips:
      'Der Spieler belegt Rang {ranking} im Gesamtwert für seine Position ({position}).',
    potentialRankingTips:
      'Der Spieler belegt Rang {ranking} im Potenzial für seine Position ({position}).',
  },
  PlayerDetailPage: {
    Profile: {
      Birthday: 'Geburtsdatum',
      DoubleYellow: 'Zweimal Gelb',
      AverageAttribute: 'Attributdurchschnitt',
      CopyNewScript:
        'Kopiere und starte das aktuelle Skript im Schnellstart, um die zusätzlichen Spielerdaten zu erfassen.',
      Yes: 'Ja',
      No: 'Nein',
      Profile: 'Spielerprofil',
      Reputation: 'Internationales Ansehen',
      BodyType: 'Körperbau',
      RealFace: 'Echtes Gesicht',
      Gender: 'Geschlecht',
      Male: 'Männlich',
      Female: 'Weiblich',
      Nationality: 'Nationalität (Spiel-ID)',
      SecondNationality: 'Zweite Nationalität (Spiel-ID)',
      AccelerationType: 'Beschleunigungstyp',
      DerivedNote:
        'Berechnete Kategorien verwenden bestätigte Regeln dieser Spielversion. Ein Strich bedeutet, dass keine Daten geliefert wurden.',
      SoFIFAReference: 'Originaldaten bei SoFIFA ansehen',
      Roles: 'Rollenvertrautheit',
      NoRolesInVersion:
        'FC 24 verwendet Arbeitsraten; FC-IQ-Rollen gibt es ab FC 25.',
      NotAvailable:
        'Der Editor hat diese Daten im aktuellen Datensatz nicht geliefert.',
      NoRoles: 'Keine verbesserten Rollen erfasst.',
      HiddenTraits: 'Verborgene und KI-Eigenschaften',
      NoTraits: 'Keine verborgenen Eigenschaften erfasst.',
      UnknownBits:
        'Unbekannte Eigenschaftsbits bleiben in den vollständigen Daten erhalten.',
      Contract: 'Verein und Vertrag',
      Joined: 'Beitritt',
      ContractUntil: 'Vertragsende',
      Wage: 'Gehalt',
      ReleaseClause: 'Ausstiegsklausel',
      Value: 'Marktwert',
      Jersey: 'Trikotnummer',
      Club: 'Verein / Spiel-ID',
      MoneyNote:
        'Beträge verwenden die Einheiten des Spiels. Website-Schätzungen ersetzen keine Karrierewerte.',
      CareerState: 'Karrierestatus',
      DatabaseOverall: 'Datenbank-Gesamtwert',
      DynamicOverall: 'Dynamischer Gesamtwert',
      BaselineOverall: 'Basis-Gesamtwert',
      GrowthProfile: 'Wachstumsprofil (Spiel-ID)',
      SquadRank: 'Kaderbewertung',
      Form: 'Form',
      Morale: 'Moral',
      Fitness: 'Spielfitness',
      Injury: 'Verletzung (Spiel-ID)',
      InjuryDays: 'Verletzungsdauer',
      CareerNote:
        'Neue Karrieresysteme werden nur mit Daten des Editors angezeigt. Der Datenbankwert gilt nicht automatisch als dynamischer Gesamtwert.',
      OtherCareerFields: 'Weitere Karrierefelder',
      SeasonStats: 'Aktuelle Saisonstatistik',
      NoMatches: 'Noch keine Wettbewerbsstatistik erfasst.',
      Competition: 'Wettbewerb',
      Appearances: 'Spiele',
      Goals: 'Tore',
      Assists: 'Vorlagen',
      Average: 'Note',
      CleanSheets: 'Zu null',
      Saves: 'Paraden',
      Conceded: 'Gegentore',
      Yellow: 'Gelb',
      Red: 'Rot',
      MOTM: 'Spieler des Spiels',
      SeasonNote:
        'Die Statistiken stammen aus der Saison-API von Live Editor. Einige Felder oder Wettbewerbe können unvollständig sein; Werte werden nicht geschätzt.',
      AllCapturedData: 'Alle erfassten Spieldaten',
      RawNote:
        'Neue oder unbekannte Felder bleiben mit ihren Spiel-IDs erhalten. Verfügbarkeitsangaben zeigen die vom Editor gelieferten Quellen.',
      GameCode: 'Spiel-ID',
      Lean: 'Schlank',
      Normal: 'Normal',
      Stocky: 'Kräftig',
      Explosive: 'Explosiv',
      Lengthy: 'Langanhaltend',
      Controlled: 'Kontrolliert',
      Calculated: 'Berechnet',
    },
    BasicInfo: {
      PlayerID: 'ID',
      Age: 'Alter',
      Skills: 'Spezialbewegungen',
      WeakFoot: 'Schwacher Fuß',
      Foot: 'Fuß',
      Height: 'Größe',
      Weight: 'Gewicht',
      AttackingWorkRate: 'Ang. Arbeitsrate',
      DefensiveWorkRate: 'Def. Arbeitsrate',
      PlayerName: 'Name',
      OverallRating: 'Ges',
      Potential: 'Pot',
    },
    Attributes: {
      Pace: 'Tempo',
      Acceleration: 'Beschleunigung',
      SprintSpeed: 'Sprintgeschw.',

      Shooting: 'Schießen',
      AttackingPosition: 'Ang. Position',
      Finishing: 'Abschluss',
      ShotPower: 'Schussstärke',
      LongShots: 'Distanzschüsse',
      Volleys: 'Volley',
      Penalties: 'Elfmeter',

      Passing: 'Passen',
      Vision: 'Übersicht',
      Crossing: 'Flanken',
      FKAccuracy: 'FK-Genauigkeit',
      ShortPass: 'Kurzpass',
      LongPass: 'Langpass',
      Curve: 'Effet',

      Dribbling: 'Dribbeln',
      Agility: 'Agilität',
      Balance: 'Balance',
      Reactions: 'Reaktion',
      BallControl: 'Ballkontrolle',
      Composure: 'Gelassenheit',

      Defending: 'Verteidigen',
      Interceptions: 'Abfangen',
      HeadingAccuracy: 'Kopfballpräz.',
      DefensiveAwareness: 'Def. Bewusstsein',
      StandingTackle: 'Stehend Tackling',
      SlidingTackle: 'Grätsche',

      Physical: 'Physis',
      Jumping: 'Sprungkraft',
      Stamina: 'Ausdauer',
      Strength: 'Stärke',
      Aggression: 'Aggressivität',

      Goalkeeping: 'Torwart',
      GKDiving: 'TW Hechten',
      GKHandling: 'TW Fangen',
      GKKicking: 'TW Abschlag',
      GKReflexes: 'TW Reflexe',
      GKPositioning: 'TW Stellungsspiel',
    },
  },

  SettingsPage: {
    Settings: 'Einstellungen',

    APISecretKey: 'API-Geheimschlüssel',
    ClickToCopy: 'Klicke, um deinen API-Geheimschlüssel zu kopieren',
    Copy: 'Kopieren',
    ClickToRefresh:
      'Klicke, um deinen API-Geheimschlüssel zu aktualisieren, dies macht deinen alten Schlüssel ungültig',
    Refresh: 'Aktualisieren',
    CopySuccessMessage: 'Geheimschlüssel in die Zwischenablage kopiert',
    FailedToCopyMessage:
      'Fehler beim Kopieren des Geheimschlüssels in die Zwischenablage, bitte versuche es erneut',
    DoNotShareSecretKey: 'Warnung: Teile deinen Geheimschlüssel mit niemandem!',

    Notifications: 'Benachrichtigungen',
    EnableNotifications: 'Benachrichtigungen aktivieren',
    PlayerOverallPotentialUpdate: 'Spieler Ges/Pot Aktualisierung',
    PlayerSkillMoveUpdate: 'Spieler Spezialbewegungen Aktualisierung',
    PlayerWeakFootUpdate: 'Spieler Schwacher Fuß Aktualisierung',

    AccountInfo: 'Kontoinformationen',
    AccountUnverifiedWarningBanner:
      'Deine E-Mail-Adresse ist nicht bestätigt. Bitte klicke auf den Button unten, um deine E-Mail-Adresse zu bestätigen, damit wir deine Identität überprüfen können.',
    AccountUsername: 'Benutzername',
    AccountEmail: 'E-Mail',
    AccountEmailVerified: 'Bestätigt',
    AccountEmailUnverified: 'Unbestätigt',
    AccountEmailUnverifiedTooltip:
      'E-Mail ist nicht bestätigt, klicke zum Senden einer E-Mail. Wir senden dir eine Bestätigungs-E-Mail mit einem Link zur Bestätigung deiner E-Mail-Adresse.',
    AccountEmailSendTooFrequently:
      'E-Mail wurde zu häufig gesendet, bitte warte {waitSeconds} Sekunden',
    AccountEmailSendToast:
      'Bestätigungs-E-Mail gesendet, bitte überprüfe deine E-Mail. Wenn du die E-Mail nicht erhältst, überprüfe bitte deinen Spam-Ordner oder kontaktiere uns.',
    AccountChangeEmail: 'Ändern',

    AccountChangePassword: 'Passwort ändern',
    AccountClickToChange: 'Klicke zum Ändern',

    OldPassword: 'Altes Passwort',
    NewPassword: 'Neues Passwort',
    ConfirmNewPassword: 'Neues Passwort bestätigen',
    ChangePassword: 'Speichern',
    ChangePasswordNotification: {
      ErrorTitle: 'Fehler',
      INVALID_PASSWORD: 'Bitte fülle alle Felder aus',
      PASSWORD_MISMATCH: 'Neues Passwort und Bestätigung stimmen nicht überein',
      INCORRECT_OLD_PASSWORD: 'Das alte Passwort ist falsch',
      USER_NOT_FOUND: 'Benutzer nicht gefunden',

      PASSWORD_SAME_AS_OLD:
        'Das neue Passwort ist identisch mit dem alten. Bitte versuche ein anderes.',

      SUCCESS: 'Erfolg',
      SUCCESS_MESSAGE: 'Passwort erfolgreich geändert',

      UnknownErrorTitle: 'Unbekannter Fehler',
      UnknownErrorDescription:
        'Fehler beim Ändern des Passworts. Bitte versuche es erneut. Falls das Problem weiterhin besteht, kontaktiere uns bitte.',
    },

    Logout: 'Abmelden',
    ClickToLogout: 'Hier klicken, um dich abzumelden',

    NewEmailInputPlaceholder: 'Gib deine neue E-Mail-Adresse ein',
    ChangeEmail: 'E-Mail ändern',
    NeedVerifyEmail:
      'Du musst deine neue E-Mail-Adresse nach der Änderung bestätigen.',
    ChangeEmailNotification: {
      ErrorTitle: 'Fehler',
      INVALID_EMAIL: 'Bitte gib eine gültige E-Mail-Adresse ein.',

      SUCCESS: 'Erfolg',
      SUCCESS_MESSAGE:
        'E-Mail erfolgreich geändert. Bitte bestätige deine E-Mail.',

      EMAIL_DUPLICATE:
        'Die neue E-Mail-Adresse wird bereits verwendet. Bitte versuche eine andere. Falls die E-Mail dir gehört, kontaktiere uns bitte.',

      EMAIL_SAME_AS_OLD:
        'Die neue E-Mail-Adresse ist identisch mit der alten. Bitte versuche eine andere.',

      UnknownErrorTitle: 'Unbekannter Fehler',
      UnknownErrorDescription:
        'Fehler beim Ändern der E-Mail. Bitte versuche es erneut. Falls das Problem weiterhin besteht, kontaktiere uns bitte.',
    },
  },

  GetStartedPage: {
    NEED_HELP: 'Brauchst du Hilfe?',
    JOIN_DISCORD: 'Der Discord-Community beitreten',
    SCRIPT_LOADING: 'Dein Skript wird vorbereitet…',
    SCRIPT_ERROR_HELP:
      'Prüfe deine Spielversion in den Einstellungen und deinen Anmeldestatus. Versuche es dann erneut.',
    RETRY: 'Erneut versuchen',
    EMAIL_UNVERIFIED: {
      Prefix: 'Du hast deine E-Mail-Adresse nicht bestätigt. Bitte gehe zu',
      SettingsPage: 'Einstellungen',
      Suffix: 'um zuerst deine E-Mail-Adresse zu bestätigen.',
    },

    Title: 'Schnellstart',
    STEP_1: {
      Title: '1. Öffne FC 24–27 mit dem Live Editor.',
      DownloadLink: 'Download-Link:',
    },
    STEP_2: {
      Title: '2. Gehe in den Karrieremodus.',
      Description: 'Bitte öffne zuerst den FC 24–27 Karrieremodus.',
    },
    STEP_3: {
      Title: '3. Öffne das Lua-Skript',
      Description:
        'Aktiviere den Live-Editor im Karrieremodus und öffne die Lua-Skript-Funktion.',
    },
    STEP_4: {
      Title: '4. Füge den folgenden Code-Snippet ein',
      Description:
        'Kopiere den folgenden Code, füge ihn in das Lua-Skript des LIVE-Editors ein und klicke auf die Ausführen-Schaltfläche.',
    },

    GET_STARTED_TEXT: `
# Los geht’s
Verwende den passenden Live Editor für [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor), [FC 25](https://github.com/xAranaktu/FC-25-Live-Editor), [FC 26](https://github.com/xAranaktu/FC-26-Live-Editor) oder [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor), der mit deinem Spielstand kompatibel ist. Dein persönlicher API-Schlüssel ist im Skript enthalten.
`,
    SUCCESS: 'Erfolg',
    SUCCESS_MESSAGE: 'In die Zwischenablage kopiert',
    ERROR: 'Fehler',
    ERROR_MESSAGE: 'Kopieren fehlgeschlagen. Bitte kopiere den Code manuell.',
    COPY_TO_CLIPBOARD: 'In die Zwischenablage kopieren',
    HIDE_ALL_CODE: 'Gesamten Code ausblenden',
    SHOW_ALL_CODE: 'Gesamten Code anzeigen',
    CODE_NOT_SHARE_WARNING:
      'Warnung: Diese Codes enthalten deinen geheimen Schlüssel. Teile diese Codes nicht mit anderen.',
    IMPORTANT_TIPS: `
# Wichtige Hinweise
- Wähle die passende FC-Version und lade die Managerkarriere, bevor du das Skript ausführst. Kopiere nach einem Schlüssel- oder Versionswechsel ein neues Skript.
- Der gesamte Kader wird sofort und danach jede Spielwoche hochgeladen. Unvollständige Kader werden übersprungen; Einzelheiten stehen im Live-Editor-Protokoll.
- Unterstützte Editoren laden direkt hoch. FC 24 und ältere Editoren verwenden Windows curl und temporäre Dateien; dabei kann ein Befehlsfenster erscheinen. Schreibrechte im Spielordner sind nicht nötig.
- FC 24 behält die Datumskorrektur. Führe das Skript nach dem Laden aus und prüfe die angezeigten Daten.
- Verwende pro Konto und Spielversion nur eine Karriere. Verschiedene Spielstände werden nicht getrennt.
- Erneutes Ausführen ersetzt nur den eigenen Ereignis-Listener. Andere Karriereskripte behalten ihre Listener.
`,
    VIDEO_TUTORIAL_TITLE: `Video-Tutorial`,
    VIDEO_TUTORIAL_DESCRIPTION: `Du kannst auch durch das Video-Tutorial lernen, wie man diese App benutzt.`,
  },
  NotificationPopover: {
    Title: 'Benachrichtigungen',
    OnlyShowUnread: 'nur ungelesene anzeigen',
    SwitchOn: 'An',
    SwitchOff: 'Aus',
    MarkAllAsRead: 'Alle als gelesen markieren',
    FilterOption: {
      All: 'Alle',
      Overall: 'Ges/Pot',
      SkillMove: 'Spezialbewegung',
      WeakFoot: 'Schwacher Fuß',
    },
  },
  NotificationItem: {
    UnknownMessageType: 'Unbekannter Nachrichtentyp',
    GameDate: 'Spieldatum',
    SkillMove: 'Spezialbewegung',
    WeakFoot: 'Schwacher Fuß',
    Overall: 'Ges',
    Potential: 'Pot',
    MarkAsRead: 'Als gelesen markieren',
  },
};
