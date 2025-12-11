const fr = {
  nav: {
    home: 'Accueil',
    services: 'Services',
    ai: "Architecte IA",
    admin_panel: "Panneau d'administration",
    my_projects: 'Mes Projets',
    projects: 'Projets',
    bookings: 'Réservations',
    book_meeting: 'Réserver une réunion',
    sign_in: "S'identifier",
    logout: 'Se déconnecter',
    switch_to_fr: 'Passer au Français',
    switch_to_en: 'Passer à l\'anglais',
    toggle_language: 'Basculer la langue'
  },
  theme: {
    switch_light: 'Passer en mode clair',
    switch_dark: 'Passer en mode sombre'
  },
  hero: {
    accepting: "Acceptation de nouveaux projets pour 2025",
    title_line1: 'Construire le',
    title_highlight: 'Futur Numérique',
    subtitle: "Nous concevons des solutions logicielles robustes, évolutives et sécurisées. De l'intégration IA à la sécurité d'entreprise, SYNARIZMIE offre l'excellence à chaque ligne de code.",
    start_project: 'Démarrer votre projet',
    explore_services: 'Explorer les services'
    ,
    modern_stack: {
      title: 'Stack Moderne'
    },
    enterprise_security: {
      title: 'Sécurité d’Entreprise',
      desc: 'Infrastructure conforme SOC2 avec chiffrement de bout en bout.'
    }
  },
  services: {
    our_expertise: 'Notre Expertise',
    engineering_excellence: "L'Excellence d'ingénierie",
    subtitle: "Nous combinons créativité et expertise technique pour fournir des solutions évolutives.",
    view_details: 'Voir les détails',
    why_choose: 'Pourquoi choisir SYNARIZMIE ?',
    why_choose_prefix: "Nous n'écrivons pas seulement du code ; nous concevons des solutions qui stimulent la croissance. Notre",
    why_choose_suffix: "équipe est composée de vétérans de l'industrie dédiés à votre réussite."
  ,
    items: {
      ai: {
        title: 'Solutions d\'Intelligence Artificielle',
        description: "Intégration LLM personnalisée, analyses prédictives et systèmes de prise de décision automatisés.",
        longDescription: "Exploitez la puissance de l'IA générative et du Machine Learning pour transformer vos opérations. Nous construisons des modèles personnalisés adaptés à vos jeux de données, offrant des insights prédictifs, de la génération de contenu automatisée et des agents intelligents.",
        features: {
          '0': 'Fine-tuning des LLM personnalisés',
          '1': "Tableaux de bord d'analyse prédictive",
          '2': 'Traitement du langage naturel (NLP)',
          '3': 'Systèmes de vision par ordinateur',
          '4': "Agents d'automatisation pilotés par l'IA"
        }
      },
      web: {
        title: 'Solutions Web, Mobile & Bureau',
        description: "Applications haute performance pour web, mobile et bureau.",
        longDescription: "Nous concevons des applications esthétiques et performantes sur toutes les plateformes. En utilisant des frameworks modernes comme React, Next.js, React Native, Flutter et Electron, nous garantissons une présence digitale rapide, accessible et optimisée pour chaque appareil.",
        features: {
          '0': 'Développement Web React & Next.js',
          '1': 'Applications mobiles iOS & Android',
          '2': 'Applications bureau cross-platform',
          '3': 'Progressive Web Apps (PWA)',
          '4': 'Conception et optimisation UI/UX'
        }
      }
    }
  },
  auth: {
    welcome_back: 'Bon retour',
    create_account: 'Créer un compte',
    access_portal: 'Accédez à votre espace client',
    start_journey: "Commencez votre voyage avec SYNARIZMIE",
    full_name: 'Nom complet',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    sign_in: "S'identifier",
    create_account_cta: 'Créer un compte',
    dont_have: "Vous n'avez pas de compte ? Inscrivez-vous",
    already_have: 'Vous avez déjà un compte ? Connectez-vous',
    admin_tip: "Astuce : utilisez admin@synarizmie.dev pour vous connecter en tant qu'administrateur.",
    developer_tip: 'Développeurs : Contactez votre administrateur pour obtenir vos identifiants.',
    developer_note: 'Note : L\'inscription est réservée aux clients. Les développeurs sont créés par les administrateurs.'
  },
  booking: {
    login_required: 'Connexion requise',
    please_log_in: "Veuillez vous connecter ou créer un compte pour planifier une consultation avec nos experts.",
    go_to_login: 'Aller à la connexion',
    admin_restricted: "Accès administrateur restreint",
    admin_restricted_msg: "Les administrateurs ne peuvent pas réserver de réunions. Veuillez passer à un compte client pour tester la réservation.",
      new_reservation: 'Nouvelle réservation',
      my_requests: 'Mes demandes',
      request_received_prefix: 'Nous avons bien reçu votre demande pour ',
      google_meet_integration: 'Intégration Google Meet',
      google_meet_msg_prefix: "Une fois qu'un administrateur aura approuvé votre demande, un lien Google Meet fonctionnel sera généré et envoyé à ",
      google_meet_msg_suffix: '.',
      select_services_hint: "Sélectionnez un ou plusieurs services qui vous intéressent. Nous vérifierons la disponibilité dans notre agenda et sécuriserons votre créneau.",
      live_availability: 'Disponibilité en direct',
      real_time_checking: 'Vérification des créneaux en temps réel',
      select_project_required: "Veuillez sélectionner ou créer un projet lié avant de confirmer la demande.",
    schedule_consultation: 'Planifier une consultation',
    agenda_for: 'Agenda pour',
    unique_link_text: 'Un lien Meet unique sera fourni après approbation.',
    select_date: 'Sélectionner une date',
    pick_date_hint: 'Choisissez une date pour voir l’agenda et les heures disponibles.',
    occupied_slots: 'Créneaux occupés',
    no_bookings: 'Aucune réservation',
    select_time: "Sélectionner l'heure",
    select_project_placeholder: 'Sélectionnez le projet lié...',
    services_label: 'Services',
    description_label: 'Description',
    description_placeholder: "Décrivez les objectifs et le contexte de cette réunion...",
    related_project_label: 'Projet lié',
    not_eligible_suffix: ' — non éligible',
    logged_in_as: 'Connecté en tant que :',
    clear_history: "Effacer l’historique",
    refresh: 'Rafraîchir',
    refresh_bookings: 'Rafraîchir les réservations',
    book_another: 'Réserver une autre',
    view_my_requests: 'Voir mes demandes',
    confirm_request: 'Confirmer la demande',
    processing: 'Traitement...'
    ,
    no_booking_history: "Aucun historique de réservations",
    join_meet: 'Rejoindre la réunion'
    ,
    booking_failed: 'La réservation a échoué'
  },
  dashboard: {
    title: "Portail client",
    developer_title: 'Portail développeur',
    welcome_back: 'Bon retour,',
    assigned_projects: 'Vos projets assignés',
    no_assigned_projects: 'Aucun projet ne vous a encore été assigné.',
    contact_admin: 'Contactez votre administrateur pour les affectations de projets.',
    select_project: 'Sélectionner un projet',
    no_projects: 'Aucun projet',
    no_project_selected: 'Aucun projet sélectionné',
    deadline_label: 'Date limite :',
    close_create_form: 'Fermer le formulaire de création',
    create_project: 'Créer un projet',
    rename_project: 'Renommer le projet',
    delete_project: 'Supprimer le projet',
    project_name: 'Nom du projet',
    deadline: 'Date limite',
    create: 'Créer',
    cancel: 'Annuler',
    overall_progress: 'Progression globale',
    tasks: 'Tâches',
    click_to_toggle: 'Cliquez pour basculer',
    drag_to_reorder: 'Glissez pour réorganiser',
    add_new_task_placeholder: 'Ajouter une nouvelle tâche...',
    work_breakdown: 'Répartition du travail',
    done: 'Terminé',
    remaining: 'Restant',
    services: 'Services',
    description: 'Description',
    features: 'Fonctionnalités clés',
    project_not_found: 'Projet introuvable',
    only_planning_delete: "Seuls les projets en 'Planning' peuvent être supprimés. Ce projet est déjà en cours ou terminé.",
    project_has_bookings: 'Ce projet a des réservations associées et ne peut pas être supprimé.',
    provide_valid_project_name: 'Veuillez fournir un nom de projet valide',
    duplicate_project_name: 'Vous avez déjà un projet portant ce nom. Choisissez un nom différent.',
    failed_to_create_project: 'Échec de la création du projet'
  },
  dashboard_extra: {
    failed_to_rename_project: "Échec du renommage du projet"
  },
  common_ui: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    delete: 'Supprimer'
  },
  empty: {
    no_active_projects: "Vous n'avez aucun projet actif pour le moment.",
    book_consultation: "Réservez une consultation pour commencer."
  },
  confirm: {
    delete_confirm_with_name: 'Êtes-vous sûr de vouloir supprimer "{name}" ? Cette action est irrémédiable.',
    delete_confirm: 'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irrémédiable.'
    ,
    default_title: 'Confirmer',
    confirm_label: 'Confirmer',
    cancel_label: 'Annuler',
    processing: 'Traitement...'
  },
  admin: {
    title: "Centre de contrôle Admin",
    subtitle: "Gérez les réunions client, les approbations et les projets.",
    pending_bookings: 'Réservations en attente',
    active_clients: 'Clients actifs',
    total_projects: 'Projets totaux',
    active_developers: 'Développeurs actifs',
    manage_users: "Gérer les utilisateurs",
    manage_clients: 'Gérer les clients',
    manage_developers: 'Gérer les développeurs',
    add_developer: 'Ajouter un développeur',
    edit_developer: 'Modifier le développeur',
    developer_name: 'Nom du développeur',
    developer_email: 'E-mail du développeur',
    create_developer: 'Créer le développeur',
    update_developer: 'Mettre à jour',
    assign_developer: 'Assigner un développeur',
    unassign_developer: 'Désassigner',
    select_developer: 'Sélectionner un développeur',
    no_developer_assigned: 'Aucun développeur assigné',
    developer_assigned: 'Développeur assigné avec succès',
    approve_remove_tip: "Approuver ou supprimer les comptes clients",
    name: 'Nom',
    email: 'E-mail',
    status: 'Statut',
    actions: 'Actions',
    activate: 'Activer',
    no_users_found: "Aucun utilisateur trouvé.",
    no_developers_found: 'Aucun développeur trouvé.',
    meeting_requests: 'Demandes de réunion',
    manage_projects: 'Gérer les projets',
    filter_requests_placeholder: 'Filtrer les demandes...',
    filter_clients_placeholder: 'Filtrer les clients...',
    filter_developers_placeholder: 'Filtrer les développeurs...',
    filter_by_name: 'Filtrer par nom...',
    filter_by_client: 'Filtrer par client',
    filter_by_developer: 'Filtrer par développeur',
    all_clients: 'Tous les clients',
    all_developers: 'Tous les développeurs',
    clear_history: "Effacer l'historique",
    showing_requests: 'Affiche {count} demandes',
    client_label: 'Client',
    services_description: 'Services / Description',
    date_time: 'Date & Heure',
    no_booking_requests: "Aucune demande de réservation trouvée.",
    clear_booking_history_title: "Effacer l'historique des réservations",
    clear_booking_history_message: "Supprimez les réservations annulées/rejetées du système. Inclure éventuellement les réservations terminées.",
    clear_confirm: 'Effacer',
    clear_failed: "Échec de l'effacement de l'historique des réservations",
    include_finished: 'Inclure les réservations terminées',
    show_description: 'Afficher la description',
    approve_send_link: 'Approuver et envoyer le lien',
    reject: 'Rejeter',
    mark_finished: 'Marquer comme terminé',
    cancel_booking: 'Annuler la réservation',
    no_description_provided: 'Aucune description fournie.',
    all_projects: 'Tous les projets',
    clients_create_note: 'Les clients créent et suppriment leurs propres projets dans Mes Projets.',
    client_label_short: 'Client :',
    developer_label_short: 'Développeur :',
    due_label: 'Échéance :',
    rename: 'Renommer',
    delete: 'Supprimer',
    deactivate: 'Désactiver',
    rename_project: 'Renommer le projet',
    provide_valid_project_name: 'Veuillez fournir un nom de projet valide',
    failed_to_rename: 'Échec du renommage',
    edit: 'Modifier'
  },
  common: {
    back_to_services: 'Retour aux services',
    request_sent: 'Demande envoyée !',
    close: 'Fermer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    create: 'Créer'
  }
  ,
  
  notifications: {
    bell_label: 'Notifications',
    bell_title: 'Notifications',
    title: 'Notifications',
    refresh: 'Rafraîchir',
    mark_all: 'Tout marquer',
    clear: 'Effacer',
    show_all: 'Afficher tout',
    clear_all: 'Tout effacer',
    close: 'Fermer les notifications',
    loading: 'Chargement...',
    no_notifications: 'Aucune notification',
    mark_as_read: 'Marquer comme lu',
    mark_as_unread: 'Marquer comme non lu',
    delete_notification: 'Supprimer la notification',
    read: 'Lu'
  }
  ,
  all_components: {
    navbar: 'Barre de navigation',
    hero: 'Hero',
    services: 'Services',
    dashboard: 'Tableau de bord',
    booking: 'Réservation',
    ai_consultant: "Consultant IA",
    auth: 'Authentification',
    admin_dashboard: "Tableau d'administration",
    floating_copilot: 'Assistant flottant'
  }
  ,
  ai_consultant: {
    welcome: "Bonjour ! Je suis l'Architecte IA de SYNARIZMIE. Parlez-moi de votre idée logicielle et je vous aiderai à définir les exigences techniques, les suggestions de stack et l'estimation de l'envergure.",
    title: 'Architecte IA',
    subtitle: 'Propulsé par Gemini 2.5 Flash',
    status: {
      online: 'En ligne'
    },
    thinking: 'Réflexion...',
    placeholder: "Décrivez votre idée de projet (ex. : 'Je veux une application mobile pour suivre les objectifs fitness avec des fonctionnalités sociales')...",
    send: 'Envoyer',
    caution: "Les réponses de l'IA peuvent être inexactes. Consultez nos ingénieurs pour les contrats finaux."
  },
  my_projects: {
    access_restricted: {
      title: "Accès restreint",
      desc: "Seuls les comptes clients peuvent créer ou supprimer des projets ici. Les administrateurs gèrent les projets depuis le centre d'administration."
    },
    title: 'Mes Projets',
    create_project: 'Créer un projet',
    empty: "Vous n'avez aucun projet pour le moment.",
    form: {
      project_name: 'Nom du projet',
      deadline: 'Date limite',
      new_project_name: 'Nouveau nom de projet',
      description: 'Description',
      description_placeholder: 'Décrivez les objectifs et exigences de votre projet...',
      services: 'Services / Fonctionnalités',
      features: 'Caractéristiques clés',
      feature_placeholder: 'Ajouter une fonctionnalité...'
    },
    actions: {
      rename: 'Renommer',
      delete: 'Supprimer',
      details: 'Modifier les détails',
      add_feature: 'Ajouter une fonctionnalité',
      remove_feature: 'Supprimer la fonctionnalité'
    },
    card: {
      due: 'Échéance :',
      status: 'Statut :',
      show_details: 'Afficher les détails',
      hide_details: 'Masquer les détails',
      description: 'Description',
      features: 'Fonctionnalités'
    },
    dialogs: {
      delete_title: 'Supprimer le projet',
      delete_with_name_prefix: 'Êtes-vous sûr de vouloir supprimer',
      delete_suffix: "Cette action est irréversible.",
      delete_generic: "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.",
      rename_title: 'Renommer le projet',
      rename_desc_prefix: 'Renommer',
      details_title: 'Détails du projet'
    },
    errors: {
      provide_valid_name: 'Veuillez fournir un nom de projet valide',
      failed_rename: 'Échec du renommage',
      provide_name: 'Veuillez fournir un nom de projet',
      duplicate_name: 'Vous avez déjà un projet portant ce nom. Choisissez un nom différent.',
      failed_create: "Échec de la création du projet",
      project_not_found: 'Projet introuvable',
      only_delete_own: 'Vous ne pouvez supprimer que vos propres projets',
      only_planning_delete: "Seuls les projets en 'Planning' peuvent être supprimés. Contactez l'administrateur pour les projets protégés.",
      has_bookings: 'Ce projet a des réservations associées et ne peut pas être supprimé.',
      failed_delete: 'Échec de la suppression du projet'
    }
  },
  copilot: {
    name: 'Copilot SYNARIZMIE',
    init_text: "Bonjour ! Je suis le Copilot de SYNARIZMIE. Comment puis-je vous aider aujourd'hui ?",
    open: 'Ouvrir le Copilot',
    close: 'Fermer le Copilot',
    thinking: 'Réflexion...',
    placeholder: 'Posez votre question...',
    send: 'Envoyer'
  },
  appsShowcase: {
    ecosystem: 'Écosystème',
    appsTitle: 'Apps & Intégrations',
    appsSubtitle: 'Étendez vos possibilités avec des applications sélectionnées. Un écosystème fluide conçu pour connecter chaque workflow.',
    connect: 'Connecter',
    featuredProject: 'Projet Phare',
    pointageTitle: 'Système de Pointage',
    pointageSubtitle: 'Gestion complète des heures de travail',
    pointageDescription: 'Une solution moderne et intuitive pour la gestion des présences, congés, heures supplémentaires et RTT. Conçue pour les PME et grandes entreprises recherchant l\'efficacité et la conformité.',
    liveDemo: 'Démo Live',
    learnMore: 'En savoir plus',
    builtWith: 'Construit avec',
    productionReady: 'Prêt pour la production',
    enterpriseGrade: 'Qualité Entreprise',
    viewAll: 'Voir tout',
    whyChooseTitle: 'Pourquoi choisir SYNARIZMIE ',
    whyChooseSubtitle: 'Des solutions sur mesure qui transforment votre vision en réalité digitale. Notre expertise vous accompagne de la conception au déploiement.',
    advantages: 'Avantages',
    builtForTitle: 'Conçu spécialement pour',
    builtForSubtitle: 'Des solutions adaptées à chaque secteur',
    industries: 'Industries',
    availableOn: 'Disponible sur toutes les plateformes',
    startProject: 'Démarrer votre projet',
    imagesTitles: {
      0: { title: 'Ajouter un employé', description: 'Interface intuitive pour créer de nouveaux profils employés avec informations personnelles et données initiales.', category: 'Gestion RH' },
      1: { title: 'Gestion des demandes', description: 'Suivi complet des congés, RTT, heures supplémentaires avec statuts en temps réel.', category: 'Demandes' },
      2: { title: 'Sommaire mensuel', description: 'Vue d\'ensemble des heures prestées, RTT, heures supplémentaires et congés restants.', category: 'Analytics' },
      3: { title: 'Centre de rapports', description: 'Génération de rapports Excel et PDF pour le suivi des heures et des requêtes.', category: 'Rapports' },
      4: { title: 'Gestion des pointages', description: 'Tableau de bord complet pour la gestion quotidienne des pointages et présences.', category: 'Pointage' }
    },
    features: {
      employeeManagement: 'Gestion des employés',
      leaveRequests: 'Demandes de congés',
      detailedReports: 'Rapports détaillés',
      excelPdfExport: 'Export Excel/PDF',
      enhancedSecurity: 'Sécurité renforcée',
      responsiveDesign: 'Design responsive'
    },
    whyChooseFeatures: {
      timeSaving: {
        title: 'Gain de temps',
        description: 'Réduisez de 70% le temps consacré à la gestion administrative des heures.',
        stat: '70%'
      },
      compliance: {
        title: 'Conformité garantie',
        description: 'Respect automatique des réglementations du travail et conventions collectives.',
        stat: '100%'
      },
      roi: {
        title: 'ROI rapide',
        description: 'Retour sur investissement visible dès les premiers mois d\'utilisation.',
        stat: '3x'
      },
      satisfaction: {
        title: 'Satisfaction employés',
        description: 'Interface moderne et intuitive appréciée par toutes les générations.',
        stat: '95%'
      }
    },
    builtFor: {
      sme: { name: 'PME & ETI', description: '10 à 500 employés' },
      multinational: { name: 'Multinationales', description: 'Multi-sites, multi-pays' },
      services: { name: 'Services', description: 'Consulting, IT, Agences' },
      industry: { name: 'Industrie', description: 'Production, Logistique' }
    },
    platforms: {
      desktop: 'Bureau',
      mobile: 'Mobile',
      web: 'Web'
    }
  }
};

export default fr;
