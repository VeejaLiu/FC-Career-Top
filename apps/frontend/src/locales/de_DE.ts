export default {
  LoginComponent: {
    VideoTutorial: 'Wie nutzt man diese App? Erfahre mehr durch das Video!',
    welcome: 'Willkommen zurück',
    usernameEmail: 'Benutzername / E-Mail',
    usernameEmailPlaceholder: 'dein Benutzername oder E-Mail',
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
      'Bitte gib eine gültige E-Mail-Adresse ein. Du musst deine E-Mail-Adresse nach der Registrierung bestätigen.',
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
    title: 'Career.Top',
    switchVersion: 'Spielversion wechseln',
    current: 'Aktuell',
  },
  Navbar: {
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
  NoDataComponent: {
    prefix: 'Noch nichts anzuzeigen. Besuche unsere',
    getStartedPage: 'Loslegen',
    suffix: 'Seite, um deine Reise zu beginnen.',
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
    EMAIL_UNVERIFIED: {
      Prefix: 'Du hast deine E-Mail-Adresse nicht bestätigt. Bitte gehe zu',
      SettingsPage: 'Einstellungen',
      Suffix: 'um zuerst deine E-Mail-Adresse zu bestätigen.',
    },

    Title: 'Schnellstart',
    STEP_1: {
      Title: '1. Öffne FC24/FC25 mit dem Live Editor.',
      DownloadLink: 'Download-Link:',
    },
    STEP_2: {
      Title: '2. Gehe in den Karrieremodus.',
      Description: 'Bitte öffne zuerst den FC24/FC25 Karrieremodus.',
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
# Los geht's
## 1. Abhängigkeiten
- Neuester **[xAranaktu/FC-24-Live-Editor](https://www.patreon.com/collection/96422?view=expanded)** oder **[xArnatu/FC-25-Live-Editor](https://www.patreon.com/collection/779838?view=expanded)**.
- **API-Geheimschlüssel**. (Du kannst ihn auf der [Einstellungsseite](/settings) verwalten, ABER du brauchst ihn nicht wirklich, da ich ihn bereits in den folgenden Code-Snippet für dich eingefügt habe)
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
# Wichtige Hinweise & Tipps

### 1. Das Spieldatum ist möglicherweise nicht perfekt genau!

Du hast vielleicht bemerkt, dass wir die Wachstumsstatistiken der Spieler verfolgen, während sich die Spielzeit ändert.  
ABER hier ist ein kleines Geheimnis: Es ist für uns schwierig, das genaue Spieldatum zu erhalten! Wir haben diese Daten früher aus der "career_table" gezogen, die du im Live-Editor unter dem Tab "Tabelle" finden kannst. Aber nach einem bestimmten Spiel-Update sind die Daten in dieser Tabelle nicht mehr genau. Interessanterweise habe ich ein Muster gefunden: Die Tabelle ist genau, wenn du zum ersten Mal den Karrieremodus betrittst oder nachdem du ein Spiel gespielt hast.

Auf dieser Grundlage mussten wir eine manuelle Zeitberechnungsmethode erstellen, indem wir auf das DAY_PASSED-Ereignis im Spiel hören und es mit den Daten abgleichen, die wir noch erhalten können. Es ist etwas umständlich, und ich musste eine Menge redundanten Code hinzufügen, um es zum Laufen zu bringen. Aber im Moment ist das unsere einzige Option. Also, wenn du dieses Skript verwendest, verlass dich nicht zu sehr auf das Spieldatum, da es möglicherweise nicht punktgenau ist.

Und bitte führe dieses Skript sofort nach dem Betreten des Karrieremodus aus, um die genauesten Daten zu erhalten. Andernfalls werden die Daten erst genau, nachdem du ein Spiel gespielt hast.

**Unser Tipp: Führe dieses Skript direkt nach dem Betreten des Karrieremodus aus!**

### 2. Das lästige schwarze Fenster! Es könnte deine Aufmerksamkeit stehlen.

Lass mich erklären, wie das funktioniert. Unsere Anwendung nutzt die vom Live-Editor bereitgestellten Funktionen. Immer wenn das WEEK_PASSED-Ereignis im Spiel ausgelöst wird, läuft unser Lua-Skript, sammelt Daten von allen Spielern deines aktuellen Teams und sendet sie an unseren Server. Aber hier ist der Haken: Der Live-Editor bietet keine Möglichkeit, API-Anfragen direkt an einen externen Server zu senden, also verwenden wir den Curl-Befehl von Windows dafür.

Leider erscheint jedes Mal, wenn wir diesen Befehl ausführen, ein schwarzes Fenster, weil wir Curl im Windows-System ausführen. Und manchmal könnte dieses schwarze Fenster den Fokus von deinem Spiel stehlen, was ärgerlich ist. Es passiert nicht jedes Mal, aber es ist möglich. Es ist weit von perfekt entfernt, aber es ist das Beste, was wir im Moment tun können.

Es tut mir leid für diese Unannehmlichkeit, aber ich suche ständig nach einer besseren Lösung. Während du diese Anwendung benutzt, bitte schließe dieses schwarze Fenster nicht—es ist damit beschäftigt, die API-Anfrage zu senden. Wenn dein Netzwerk nicht zu langsam ist, sollte das Fenster schnell verschwinden. Nach meiner Erfahrung ist es erträglich, da das schwarze Fenster nur einmal pro Spielwoche erscheint. Und hey, es ist ein kleiner Preis, um den Fortschritt deiner Spieler zu verfolgen, oder? Sei versichert, ich bin auf der Suche nach einer besseren Lösung und werde die Anwendung aktualisieren, sobald wir eine finden. Danke für dein Verständnis!

### 3. Nur ein Speicherplatz unterstützt!

Während der geschlossenen Beta unterstützen wir nur einen Speicherplatz. Das liegt daran, dass unsere Serverressourcen begrenzt sind und wir nicht für jeden einzelnen Benutzer einen separaten Speicherstand bereitstellen können. Außerdem bezweifle ich, dass jemand so oft zwischen Speicherdateien hin und her wechselt, also denke ich, dass diese Einschränkung fair ist. In Zukunft könnten wir mehr Speicherplätze anbieten, aber wer weiß? Die Zukunft ist voller Überraschungen!

### 4. Probleme durch unzureichende Dateisystem-Berechtigungen

Lass mich erklären, warum dieses Skript Dateisystem-Berechtigungen benötigt. Wie bereits erwähnt, verwenden wir die Kommandozeile, um direkt einen Curl-Befehl auszuführen, um deine Spielerdaten zu senden. Aufgrund der zahlreichen Spielerattribute kann die JSON-Datenzeichenfolge jedoch sehr lang werden, was es unmöglich macht, all diese Daten in einer einzigen Zeile von Curl zu verketten, da sie die erlaubte Länge der Kommandozeile überschreitet.

Daher schreibe ich diese Daten zuerst in eine Datei und verkette dann den Pfad der Datei in den Befehl. Auf dieser Grundlage stelle bitte sicher, dass du über Administratorrechte und Schreibberechtigungen für den Ordner verfügst. In der Regel schreiben wir in das Stammverzeichnis des EA FC-Spiels, und wenn das Schreiben fehlschlägt, wird ein Fehler angezeigt: "Zugriff verweigert."`,
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
