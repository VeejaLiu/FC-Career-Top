export default {
  LoginComponent: {
    VideoTutorial:
      'Comment utiliser cette application ? Apprenez-en plus grâce à la vidéo !',
    welcome: 'Bon retour',
    usernameEmail: "Nom d'utilisateur / Email",
    usernameEmailPlaceholder: "votre nom d'utilisateur ou email",
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
    title: 'Career.Top',
    switchVersion: 'Changer de version du jeu',
    current: 'Actuel',
  },
  Navbar: {
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
  NoDataComponent: {
    prefix: 'Rien à afficher pour le moment. Visitez notre page',
    getStartedPage: 'Commencer',
    suffix: 'pour débuter votre aventure.',
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
    EMAIL_UNVERIFIED: {
      Prefix:
        "Vous n'avez pas vérifié votre adresse email. Veuillez vous rendre sur la",
      SettingsPage: 'Page des paramètres',
      Suffix: "pour vérifier votre adresse email d'abord.",
    },

    Title: 'Démarrage rapide',
    STEP_1: {
      Title: "1. Ouvrez FC24/FC25 avec l'éditeur Live.",
      DownloadLink: 'Lien de téléchargement :',
    },
    STEP_2: {
      Title: '2. Entrez dans le mode carrière.',
      Description:
        "Veuillez d'abord entrer dans le mode carrière de FC24/FC25.",
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
## 1. Dépendances
- Dernière version de **[xAranaktu/FC-24-Live-Editor](https://www.patreon.com/collection/96422?view=expanded)** ou **[xArnatu/FC-25-Live-Editor](https://www.patreon.com/collection/779838?view=expanded)**.
- **Clé API secrète**. (Vous pouvez la gérer depuis la [Page des paramètres](/settings), MAIS vous n'en avez pas vraiment besoin car je l'ai déjà incluse dans l'extrait de code ci-dessous pour vous)
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
# Notes importantes et conseils

### 1. La date en jeu peut ne pas être parfaitement précise !

Vous avez peut-être remarqué que nous suivons la progression des statistiques des joueurs à mesure que le temps en jeu change.  
MAIS voici un petit secret : il est difficile pour nous d'obtenir la date exacte en jeu ! Nous avions l'habitude d'extraire ces données de la "career_table" que vous pouvez trouver dans l'éditeur Live sous l'onglet Table. Mais après une certaine mise à jour du jeu, les données de cette table ne sont plus précises. Fait intéressant, j'ai découvert un modèle : la table est précise lorsque vous entrez pour la première fois dans le mode Carrière ou après avoir joué un match.

Donc, sur cette base, nous avons dû créer une méthode de calcul manuel du temps en écoutant l'événement DAY_PASSED dans le jeu et en le recoupant avec les données que nous pouvons encore obtenir. C'est un peu maladroit, et j'ai dû ajouter beaucoup de code redondant pour le faire fonctionner. Mais pour l'instant, c'est notre seule option. Donc, lorsque vous utilisez ce script, ne vous fiez pas trop à la date en jeu, car elle pourrait ne pas être exacte.

Et s'il vous plaît, exécutez ce script immédiatement après être entré dans le mode Carrière pour obtenir les données les plus précises possibles. Sinon, les données ne deviendront précises qu'après avoir joué un match.

**Notre conseil : Exécutez ce script juste après être entré dans le mode Carrière !**

### 2. La fenêtre noire ennuyeuse ! Elle pourrait voler votre attention.

Laissez-moi vous expliquer comment cela fonctionne. Notre application s'appuie sur les fonctions fournies par l'éditeur Live. Chaque fois que l'événement WEEK_PASSED est déclenché dans le jeu, notre script Lua s'exécute, collecte des données de tous les joueurs de votre équipe actuelle et les envoie à notre serveur. Mais voici le problème : l'éditeur Live n'offre pas de moyen d'envoyer directement des requêtes API à un serveur externe, donc nous utilisons la commande Curl de Windows pour cela.

Malheureusement, chaque fois que nous exécutons cette commande, une fenêtre noire apparaît car nous exécutons Curl dans le système Windows. Et parfois, cette fenêtre noire peut détourner l'attention de votre jeu, ce qui est ennuyeux. Cela n'arrive pas à chaque fois, mais c'est possible. Ce n'est pas parfait, mais c'est le mieux que nous puissions faire pour l'instant.

Je suis désolé pour cet inconvénient, mais je cherche constamment une meilleure solution. Donc, lorsque vous utilisez cette application, veuillez ne pas fermer cette fenêtre noire - elle est occupée à envoyer la requête API. Si votre réseau n'est pas trop lent, la fenêtre devrait disparaître rapidement. D'après mon expérience, c'est supportable puisque la fenêtre noire n'apparaît qu'une fois par semaine de jeu. Et hey, c'est un petit prix à payer pour suivre les progrès de vos joueurs, non ? Soyez assuré, je suis à la recherche d'une meilleure solution, et je mettrai à jour l'application dès que nous en trouverons une. Merci pour votre compréhension !

### 3. Un seul emplacement de sauvegarde pris en charge !

Pendant la bêta fermée, nous ne prenons en charge qu'un seul emplacement de sauvegarde. C'est parce que nos ressources serveur sont limitées, et nous ne pouvons pas fournir une sauvegarde séparée pour chaque utilisateur. De plus, je doute que quiconque change de fichiers de sauvegarde aussi souvent, donc je pense que cette limitation est juste. À l'avenir, nous pourrions offrir plus d'emplacements de sauvegarde, mais qui sait ? L'avenir est plein de surprises !

### 4. Problèmes causés par des permissions insuffisantes du système de fichiers

Laissez-moi vous expliquer pourquoi ce script nécessite des permissions sur le système de fichiers. Comme nous l'avons mentionné précédemment, nous utilisons la ligne de commande pour exécuter directement une commande curl afin d'envoyer vos données de joueur. Cependant, en raison des nombreux attributs de joueur, la chaîne de données JSON peut devenir très longue, rendant impossible la concaténation de toutes ces données dans une seule ligne de curl, car elle dépasse la longueur autorisée pour la ligne de commande.

Par conséquent, ce que je fais, c'est d'abord écrire ces données dans un fichier, puis concaténer le chemin du fichier dans la commande. Sur cette base, veuillez vous assurer que vous disposez de privilèges administratifs et de permissions d'écriture pour le dossier. Généralement, nous écrirons dans le répertoire racine du jeu EA FC, et si l'écriture échoue, une erreur s'affichera : "Permission refusée."`,
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
