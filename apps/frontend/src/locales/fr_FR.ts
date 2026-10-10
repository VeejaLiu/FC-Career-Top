export default {
  LoginComponent: {
    VideoTutorial:
      'Comment utiliser cette application ? Apprenez-en plus grâce à la vidéo !',
    welcome: 'Bon retour',
    usernameEmail: 'Email',
    usernameEmailPlaceholder: 'Votre email',
    password: 'Mot de passe',
    passwordPlaceholder: 'votre mot de passe',
    login: 'Connexion',
    registerPrompt: 'Pas encore de compte ? Inscrivez-vous',
  },
  RegisterComponent: {
    title: 'Commencez votre formidable aventure',
    text: 'Gratuit à vie',
    username: "Nom d'utilisateur",
    usernamePlaceholder: "votre nom d'utilisateur",
    email: 'Email',
    emailTooltip:
      "Veuillez entrer une adresse email valide. Vous devrez vérifier votre adresse email après l'inscription.",
    emailPlaceholder: 'votre email',
    password: 'Mot de passe',
    passwordTooltip:
      'Le mot de passe doit contenir au moins trois des éléments suivants : lettres majuscules, lettres minuscules, chiffres ou caractères spéciaux, et doit comporter au moins 6 caractères.',
    passwordPlaceholder: 'votre mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    confirmPasswordPlaceholder: 'confirmez votre mot de passe',
    register: "S'inscrire",
    loginPrompt: 'Vous avez déjà un compte ? Connectez-vous',

    invalidUsername:
      "Le nom d'utilisateur doit commencer par une lettre, comporter entre 6 et 20 caractères, et ne contenir que des lettres, des chiffres, des tirets bas et des points.",

    invalidEmail: 'Veuillez entrer une adresse email valide.',

    passwordError:
      'Le mot de passe doit contenir au moins trois des éléments suivants : lettres majuscules, lettres minuscules, chiffres ou caractères spéciaux, et doit comporter au moins 6 caractères.',
    passwordMismatch:
      'Les mots de passe ne correspondent pas. Assurez-vous que les deux saisies sont identiques.',

    registerSuccess:
      'Inscription réussie ! Vous serez redirigé vers la page de connexion dans 3 secondes',
  },
  WebsiteLogoComponent: {
    title: 'FCT',
    switchVersion: 'Changer de version du jeu',
    current: 'Actuel',
  },
  Navbar: {
    Language: 'Langue',
    MyAccount: 'Mon compte',
    PlayersList: 'Joueurs',
    PlayerDetail: 'Détail',
    PlayersTrends: 'Tendances',
    Settings: 'Paramètres',
    GetStarted: 'Commencer',
    VisitGithub: 'Visiter Github',
    JoinDiscord:
      "Rejoignez notre serveur Discord pour obtenir de l'aide / des retours / signaler des bugs / suggestions, ou juste discuter avec nous !",
    SwitchLanguage: 'Switch to English',
    Hello: 'Bonjour, ',
    Logout: 'Déconnexion',
  },
  AsyncState: {
    error:
      'Impossible de charger les données. Vérifiez votre connexion et réessayez.',
    retry: 'Réessayer',
  },
  NoDataComponent: {
    prefix: 'Rien à afficher pour le moment. Visitez notre page',
    getStartedPage: 'Commencer',
    suffix: 'pour débuter votre aventure.',
  },
  PlayerTrendsPage: {
    FOR: 'Attaquants',
    MID: 'Milieux',
    DEF: 'Défenseurs',
    GK: 'Gardiens',
  },
  PlayerListTable: {
    name: 'Nom',
    age: 'Âge',
    position: 'Pos',
    overall: 'Gén',
    SkillMovesAndWeakFoot: 'GT / PF',
    SkillMoves: 'GT',
    SkillMovesTooltip: 'Gestes Techniques',
    WeakFoot: 'PF',
    WeakFootTooltip: 'Pied Faible',
    potential: 'Pot',
    overallRankingTips:
      'Le joueur est classé {ranking} en général pour sa position ({position}).',
    potentialRankingTips:
      'Le joueur est classé {ranking} en potentiel pour sa position ({position}).',
  },
  PlayerDetailPage: {
    Profile: {
      Birthday: 'Date de naissance',
      DoubleYellow: 'Deux jaunes',
      AverageAttribute: 'Moyenne des attributs',
      CopyNewScript:
        'Copiez et exécutez le nouveau script depuis Démarrage rapide pour collecter les données supplémentaires.',
      Yes: 'Oui',
      No: 'Non',
      Profile: 'Profil du joueur',
      Reputation: 'Réputation internationale',
      BodyType: 'Morphologie',
      RealFace: 'Visage réel',
      Gender: 'Genre',
      Male: 'Homme',
      Female: 'Femme',
      Nationality: 'Nationalité (ID du jeu)',
      SecondNationality: 'Deuxième nationalité (ID)',
      AccelerationType: 'Type d’accélération',
      DerivedNote:
        'Les catégories calculées utilisent les règles confirmées de cette version. Un tiret indique une donnée non fournie.',
      SoFIFAReference: 'Voir la référence originale sur SoFIFA',
      Roles: 'Maîtrise des rôles',
      NoRolesInVersion:
        'FC 24 utilise les contributions offensives et défensives ; les rôles FC IQ commencent avec FC 25.',
      NotAvailable:
        'L’éditeur n’a pas fourni ces données dans le dernier relevé.',
      NoRoles: 'Aucun rôle amélioré enregistré.',
      HiddenTraits: 'Traits cachés et IA',
      NoTraits: 'Aucun trait caché enregistré.',
      UnknownBits:
        'Les bits de traits inconnus sont conservés dans les données complètes.',
      Contract: 'Club et contrat',
      Joined: 'Arrivée',
      ContractUntil: 'Fin du contrat',
      Wage: 'Salaire',
      ReleaseClause: 'Clause libératoire',
      Value: 'Valeur marchande',
      Jersey: 'Numéro de maillot',
      Club: 'Club / ID du jeu',
      MoneyNote:
        'Les montants utilisent les unités du jeu. Les estimations du site ne remplacent pas les valeurs de carrière.',
      CareerState: 'État de carrière',
      DatabaseOverall: 'Note de la base du jeu',
      DynamicOverall: 'Note dynamique',
      BaselineOverall: 'Note de base',
      GrowthProfile: 'Profil de progression (ID)',
      SquadRank: 'Évaluation dans l’effectif',
      Form: 'Forme',
      Morale: 'Moral',
      Fitness: 'Condition de match',
      Injury: 'Blessure (ID)',
      InjuryDays: 'Durée de la blessure',
      CareerNote:
        'Les nouvelles mécaniques sont affichées uniquement si l’éditeur fournit leurs valeurs. La note de la base n’est pas assimilée à la note dynamique.',
      OtherCareerFields: 'Autres champs de carrière',
      SeasonStats: 'Statistiques de la saison',
      NoMatches: 'Aucune statistique de compétition enregistrée.',
      Competition: 'Compétition',
      Appearances: 'Matchs',
      Goals: 'Buts',
      Assists: 'Passes déc.',
      Average: 'Note',
      CleanSheets: 'Sans encaisser',
      Saves: 'Arrêts',
      Conceded: 'Encaissés',
      Yellow: 'Jaunes',
      Red: 'Rouges',
      MOTM: 'Joueur du match',
      SeasonNote:
        'Les statistiques proviennent de l’API de saison de Live Editor. Certains champs ou compétitions peuvent être incomplets ; aucune valeur n’est estimée.',
      AllCapturedData: 'Toutes les données enregistrées',
      RawNote:
        'Les champs nouveaux ou inconnus sont conservés avec leurs identifiants du jeu. Les indicateurs précisent les sources disponibles.',
      GameCode: 'ID du jeu',
      Lean: 'Mince',
      Normal: 'Normale',
      Stocky: 'Trapu',
      Explosive: 'Explosif',
      Lengthy: 'Longue',
      Controlled: 'Contrôlé',
      Calculated: 'Calculé',
    },
    BasicInfo: {
      PlayerID: 'ID',
      Age: 'Âge',
      Skills: 'Gestes techniques',
      WeakFoot: 'Pied faible',
      Foot: 'Pied',
      Height: 'Taille',
      Weight: 'Poids',
      AttackingWorkRate: 'Taux Att.',
      DefensiveWorkRate: 'Taux Déf.',
      PlayerName: 'Nom',
      OverallRating: 'Gén',
      Potential: 'Pot',
    },
    Attributes: {
      Pace: 'Vitesse',
      Acceleration: 'Accélération',
      SprintSpeed: 'Vitesse Sprint',

      Shooting: 'Tir',
      AttackingPosition: 'Placement Off.',
      Finishing: 'Finition',
      ShotPower: 'Puissance Tir',
      LongShots: 'Tirs Lointains',
      Volleys: 'Vollées',
      Penalties: 'Penalties',

      Passing: 'Passe',
      Vision: 'Vision',
      Crossing: 'Centre',
      FKAccuracy: 'Précision CF',
      ShortPass: 'Passe Courte',
      LongPass: 'Passe Longue',
      Curve: 'Effet',

      Dribbling: 'Dribble',
      Agility: 'Agilité',
      Balance: 'Équilibre',
      Reactions: 'Réactivité',
      BallControl: 'Contrôle Ballon',
      Composure: 'Sang-froid',

      Defending: 'Défense',
      Interceptions: 'Interceptions',
      HeadingAccuracy: 'Précision Tête',
      DefensiveAwareness: 'Conscience Déf.',
      StandingTackle: 'Tacle Debout',
      SlidingTackle: 'Tacle Glissé',

      Physical: 'Physique',
      Jumping: 'Détente',
      Stamina: 'Endurance',
      Strength: 'Force',
      Aggression: 'Agressivité',

      Goalkeeping: 'Gardien',
      GKDiving: 'GB Plongeon',
      GKHandling: 'GB Manipulation',
      GKKicking: 'GB Jeu au pied',
      GKReflexes: 'GB Réflexes',
      GKPositioning: 'GB Placement',
    },
  },

  SettingsPage: {
    Settings: 'Paramètres',

    APISecretKey: 'Clé secrète API',
    ClickToCopy: 'Cliquez pour copier votre clé secrète API',
    Copy: 'Copier',
    ClickToRefresh:
      'Cliquez pour renouveler votre clé secrète API, cela invalidera votre ancienne clé',
    Refresh: 'Rafraîchir',
    CopySuccessMessage: 'Clé secrète copiée dans le presse-papiers',
    FailedToCopyMessage:
      'Échec de la copie de la clé secrète dans le presse-papiers, veuillez réessayer',
    DoNotShareSecretKey:
      'Attention : Ne partagez votre clé secrète avec personne !',

    Notifications: 'Notifications',
    EnableNotifications: 'Activer les notifications',
    PlayerOverallPotentialUpdate: 'Mise à jour Gén/Pot du joueur',
    PlayerSkillMoveUpdate: 'Mise à jour des gestes techniques',
    PlayerWeakFootUpdate: 'Mise à jour du pied faible',

    AccountInfo: 'Informations du compte',
    AccountUnverifiedWarningBanner:
      "Votre adresse email n'est pas vérifiée. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email afin que nous puissions confirmer votre identité.",
    AccountUsername: "Nom d'utilisateur",
    AccountEmail: 'Email',
    AccountEmailVerified: 'Vérifié',
    AccountEmailUnverified: 'Non vérifié',
    AccountEmailUnverifiedTooltip:
      "L'email n'est pas vérifié, cliquez pour envoyer un email. Nous vous enverrons un email de vérification contenant un lien pour vérifier votre adresse email.",
    AccountEmailSendTooFrequently:
      'Email envoyé trop fréquemment, veuillez attendre {waitSeconds} secondes',
    AccountEmailSendToast:
      "Email de vérification envoyé, veuillez vérifier votre email. Si vous ne recevez pas l'email, veuillez vérifier votre dossier spam ou nous contacter.",
    AccountChangeEmail: 'Modifier',

    AccountChangePassword: 'Changer de mot de passe',
    AccountClickToChange: 'Cliquez pour modifier',

    OldPassword: 'Ancien mot de passe',
    NewPassword: 'Nouveau mot de passe',
    ConfirmNewPassword: 'Confirmer le nouveau mot de passe',
    ChangePassword: 'Enregistrer',
    ChangePasswordNotification: {
      ErrorTitle: 'Erreur',
      INVALID_PASSWORD: 'Veuillez remplir tous les champs',
      PASSWORD_MISMATCH:
        'Le nouveau mot de passe et la confirmation ne correspondent pas',
      INCORRECT_OLD_PASSWORD: "L'ancien mot de passe est incorrect",
      USER_NOT_FOUND: 'Utilisateur non trouvé',

      PASSWORD_SAME_AS_OLD:
        "Le nouveau mot de passe est identique à l'ancien. Veuillez en essayer un autre.",

      SUCCESS: 'Succès',
      SUCCESS_MESSAGE: 'Mot de passe modifié avec succès',

      UnknownErrorTitle: 'Erreur inconnue',
      UnknownErrorDescription:
        'Échec de la modification du mot de passe. Veuillez réessayer. Si le problème persiste, veuillez nous contacter.',
    },

    Logout: 'Déconnexion',
    ClickToLogout: 'Cliquez ici pour vous déconnecter',

    NewEmailInputPlaceholder: 'Entrez votre nouvel email',
    ChangeEmail: "Changer d'email",
    NeedVerifyEmail:
      "Vous devrez vérifier votre nouvelle adresse email après l'avoir modifiée.",
    ChangeEmailNotification: {
      ErrorTitle: 'Erreur',
      INVALID_EMAIL: 'Veuillez entrer une adresse email valide.',

      SUCCESS: 'Succès',
      SUCCESS_MESSAGE:
        'Email modifié avec succès. Veuillez vérifier votre email.',

      EMAIL_DUPLICATE:
        "La nouvelle adresse email est déjà utilisée. Veuillez en essayer une autre. Si l'email vous appartient, veuillez nous contacter.",

      EMAIL_SAME_AS_OLD:
        "La nouvelle adresse email est identique à l'ancienne. Veuillez en essayer une autre.",

      UnknownErrorTitle: 'Erreur inconnue',
      UnknownErrorDescription:
        "Échec de la modification de l'email. Veuillez réessayer. Si le problème persiste, veuillez nous contacter.",
    },
  },

  GetStartedPage: {
    NEED_HELP: 'Besoin d’aide ?',
    JOIN_DISCORD: 'Rejoindre la communauté Discord',
    SCRIPT_LOADING: 'Préparation de votre script…',
    SCRIPT_ERROR_HELP:
      'Vérifiez la version du jeu dans les paramètres et votre connexion, puis réessayez.',
    RETRY: 'Réessayer',
    EMAIL_UNVERIFIED: {
      Prefix:
        "Vous n'avez pas vérifié votre adresse email. Veuillez vous rendre sur la",
      SettingsPage: 'Page des paramètres',
      Suffix: "pour vérifier votre adresse email d'abord.",
    },

    Title: 'Démarrage rapide',
    STEP_1: {
      Title: "1. Ouvrez FC 24–27 avec l'éditeur Live.",
      DownloadLink: 'Lien de téléchargement :',
    },
    STEP_2: {
      Title: '2. Entrez dans le mode carrière.',
      Description: "Veuillez d'abord entrer dans le mode carrière de FC 24–27.",
    },
    STEP_3: {
      Title: '3. Ouvrez le script Lua',
      Description:
        "Activez l'éditeur Live en mode carrière et accédez à la fonction de script Lua.",
    },
    STEP_4: {
      Title: "4. Collez l'extrait de code ci-dessous",
      Description:
        "Copiez le code ci-dessous, collez-le dans le script Lua de l'éditeur LIVE, et cliquez sur le bouton d'exécution.",
    },

    GET_STARTED_TEXT: `
# Pour commencer
Utilisez le Live Editor correspondant à [FC 24](https://github.com/xAranaktu/FC-24-Live-Editor), [FC 25](https://github.com/xAranaktu/FC-25-Live-Editor), [FC 26](https://github.com/xAranaktu/FC-26-Live-Editor) ou [FC 27](https://github.com/xAranaktu/FC-27-Live-Editor), compatible avec votre version du jeu. Votre clé API personnelle figure déjà dans le script.
`,
    SUCCESS: 'Succès',
    SUCCESS_MESSAGE: 'Copié dans le presse-papiers',
    ERROR: 'Erreur',
    ERROR_MESSAGE: 'Échec de la copie. Veuillez copier le code manuellement.',
    COPY_TO_CLIPBOARD: 'Copier dans le presse-papiers',
    HIDE_ALL_CODE: 'Masquer tout le code',
    SHOW_ALL_CODE: 'Afficher tout le code',
    CODE_NOT_SHARE_WARNING:
      "Attention : Ces codes contiennent votre clé secrète. Ne partagez pas ces codes avec d'autres personnes.",
    IMPORTANT_TIPS: `
# Conseils importants
- Sélectionnez la bonne version de FC et chargez votre carrière de manager avant d’exécuter le script. Copiez un nouveau script après un changement de clé ou de version.
- L’effectif complet est envoyé immédiatement, puis chaque semaine du jeu. Les effectifs incomplets ne sont pas envoyés ; consultez le journal de Live Editor.
- Les éditeurs compatibles envoient directement les données. FC 24 et les anciens éditeurs utilisent Windows curl et des fichiers temporaires ; une fenêtre de commande peut apparaître. Le dossier du jeu ne nécessite pas de droit d’écriture.
- FC 24 conserve la correction de date. Exécutez le script après le chargement et contrôlez les dates affichées.
- Utilisez une seule carrière par compte et par version du jeu. Les sauvegardes différentes ne sont pas séparées.
- Relancer le script remplace uniquement son propre écouteur. Les écouteurs des autres scripts restent actifs.
`,
    VIDEO_TUTORIAL_TITLE: `Tutoriel vidéo`,
    VIDEO_TUTORIAL_DESCRIPTION: `Vous pouvez également apprendre à utiliser cette application grâce au tutoriel vidéo.`,
  },
  NotificationPopover: {
    Title: 'Notifications',
    OnlyShowUnread: 'afficher uniquement non lues',
    SwitchOn: 'Activé',
    SwitchOff: 'Désactivé',
    MarkAllAsRead: 'Marquer tout comme lu',
    FilterOption: {
      All: 'Tout',
      Overall: 'Gén/Pot',
      SkillMove: 'Geste Technique',
      WeakFoot: 'Pied Faible',
    },
  },
  NotificationItem: {
    UnknownMessageType: 'Type de message inconnu',
    GameDate: 'Date du jeu',
    SkillMove: 'Geste Technique',
    WeakFoot: 'Pied Faible',
    Overall: 'Gén',
    Potential: 'Pot',
    MarkAsRead: 'Marquer comme lu',
  },
};
