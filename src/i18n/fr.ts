const fr = {
  nav: {
    home: 'Accueil',
    services: 'Services',
    ai: "Architecte IA",
    admin_panel: "Panneau d'administration",
    my_projects: 'Mes Projets',
    bookings: 'Réservations',
    book_meeting: 'Réserver une réunion',
    sign_in: "S'identifier",
    logout: 'Se déconnecter'
  },
  theme: {
    switch_light: 'Passer en mode clair',
    switch_dark: 'Passer en mode sombre'
  },
  hero: {
    accepting: "Acceptation de nouveaux projets pour 2025",
    title_line1: 'Construire le',
    title_highlight: 'Futur Numérique',
    subtitle: "Nous concevons des solutions logicielles robustes, évolutives et sécurisées. De l'intégration IA à la sécurité d'entreprise, Nexus offre l'excellence à chaque ligne de code.",
    start_project: 'Démarrer votre projet',
    explore_services: 'Explorer les services'
  },
  services: {
    our_expertise: 'Notre Expertise',
    engineering_excellence: "L'Excellence d'ingénierie",
    subtitle: "Nous combinons créativité et expertise technique pour fournir des solutions évolutives.",
    view_details: 'Voir les détails',
    why_choose: 'Pourquoi choisir Nexus ?'
  },
  auth: {
    welcome_back: 'Bon retour',
    create_account: 'Créer un compte',
    access_portal: 'Accédez à votre espace client',
    start_journey: "Commencez votre voyage avec Nexus",
    full_name: 'Nom complet',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    sign_in: "S'identifier",
    create_account_cta: 'Créer un compte',
    dont_have: "Vous n'avez pas de compte ? Inscrivez-vous",
    already_have: 'Vous avez déjà un compte ? Connectez-vous',
    admin_tip: "Astuce : utilisez admin@nexus.dev pour vous connecter en tant qu'administrateur."
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
    select_date: 'Sélectionner une date',
    pick_date_hint: 'Choisissez une date pour voir l’agenda et les heures disponibles.',
    occupied_slots: 'Créneaux occupés',
    no_bookings: 'Aucune réservation',
    select_time: "Sélectionner l'heure",
    book_another: 'Réserver une autre',
    view_my_requests: 'Voir mes demandes',
    confirm_request: 'Confirmer la demande',
    processing: 'Traitement...'
  },
  dashboard: {
    title: "Portail client",
    welcome_back: 'Bon retour,',
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
    add_new_task_placeholder: 'Ajouter une nouvelle tâche...',
    work_breakdown: 'Répartition du travail',
    done: 'Terminé',
    remaining: 'Restant',
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
    manage_users: "Gérer les utilisateurs",
    approve_remove_tip: "Approuver ou supprimer les comptes clients",
    name: 'Nom',
    email: 'E-mail',
    status: 'Statut',
    actions: 'Actions',
    activate: 'Activer',
    no_users_found: "Aucun utilisateur trouvé.",
    meeting_requests: 'Demandes de réunion',
    manage_projects: 'Gérer les projets',
    filter_requests_placeholder: 'Filtrer les demandes...',
    clear_history: 'Effacer l’historique',
    showing_requests: 'Affiche {count} demandes',
    client_label: 'Client',
    services_description: 'Services / Description',
    date_time: 'Date & Heure',
    no_booking_requests: "Aucune demande de réservation trouvée.",
    clear_booking_history_title: "Effacer l'historique des réservations",
    clear_booking_history_message: "Supprimez les réservations annulées/rejetées du système. Inclure éventuellement les réservations terminées.",
    clear_confirm: 'Effacer',
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
    due_label: 'Échéance :',
    rename: 'Renommer',
    delete: 'Supprimer',
    deactivate: 'Désactiver',
    rename_project: 'Renommer le projet',
    provide_valid_project_name: 'Veuillez fournir un nom de projet valide',
    failed_to_rename: 'Échec du renommage'
  },
  common: {
    back_to_services: 'Retour aux services',
    request_sent: 'Demande envoyée !'
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
    welcome: "Bonjour ! Je suis l'Architecte IA de Nexus. Parlez-moi de votre idée logicielle et je vous aiderai à définir les exigences techniques, les suggestions de stack et l'estimation de l'envergure.",
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
      new_project_name: 'Nouveau nom de projet'
    },
    actions: {
      rename: 'Renommer',
      delete: 'Supprimer'
    },
    card: {
      due: 'Échéance :',
      status: 'Statut :'
    },
    dialogs: {
      delete_title: 'Supprimer le projet',
      delete_with_name_prefix: 'Êtes-vous sûr de vouloir supprimer',
      delete_suffix: "Cette action est irréversible.",
      delete_generic: "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.",
      rename_title: 'Renommer le projet',
      rename_desc_prefix: 'Renommer'
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
    name: 'Copilot Nexus',
    init_text: "Bonjour ! Je suis le Copilot de Nexus. Comment puis-je vous aider aujourd'hui ?",
    open: 'Ouvrir le Copilot',
    close: 'Fermer le Copilot',
    thinking: 'Réflexion...',
    placeholder: 'Posez votre question...',
    send: 'Envoyer'
  }
};

export default fr;
