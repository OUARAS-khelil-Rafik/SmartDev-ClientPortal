const en = {
  nav: {
    home: 'Home',
    services: 'Services',
    ai: 'AI Architect',
    admin_panel: 'Admin Panel',
    my_projects: 'My Projects',
    projects: 'Projects',
    bookings: 'Bookings',
    book_meeting: 'Book Meeting',
    sign_in: 'Sign In',
    logout: 'Logout',
    switch_to_fr: 'Switch to Français',
    switch_to_en: 'Switch to English',
    toggle_language: 'Toggle language'
  },
  theme: {
    switch_light: 'Switch to light mode',
    switch_dark: 'Switch to dark mode'
  },
  hero: {
    accepting: 'Accepting New Projects for 2025',
    title_line1: 'Building the',
    title_highlight: 'Digital Future',
    subtitle: 'We engineer robust, scalable, and secure software solutions. From AI integration to enterprise security, Nexus delivers excellence in every line of code.',
    start_project: 'Start Your Project',
    explore_services: 'Explore Services'
    ,
    modern_stack: {
      title: 'Modern Stack'
    },
    enterprise_security: {
      title: 'Enterprise Security',
      desc: 'SOC2 Compliant infrastructure with end-to-end encryption.'
    }
  },
  services: {
    our_expertise: 'Our Expertise',
    engineering_excellence: 'Engineering Excellence',
    subtitle: 'We combine creativity with technical prowess to deliver solutions that scale.',
    view_details: 'View Details',
    why_choose: 'Why Choose Nexus?',
    why_choose_prefix: "We don't just write code; we architect solutions that drive growth. Our",
    why_choose_suffix: 'team consists of industry veterans dedicated to your success.'
  ,
    items: {
      ai: {
        title: 'AI & Machine Learning',
        description: 'Custom LLM integration, predictive analytics, and automated decision-making systems.',
        longDescription: 'Harness the power of Generative AI and Machine Learning to transform your business operations. We build custom models tailored to your specific data sets, enabling predictive insights, automated content generation, and intelligent agents.',
        features: {
          '0': 'Custom LLM Fine-tuning',
          '1': 'Predictive Analytics Dashboards',
          '2': 'Natural Language Processing (NLP)',
          '3': 'Computer Vision Systems',
          '4': 'AI-Powered Automation Agents'
        }
      },
      sec: {
        title: 'Cybersecurity',
        description: 'Penetration testing, security audits, and secure architecture design to protect assets.',
        longDescription: 'In an era of increasing digital threats, our cybersecurity services ensure your infrastructure is impenetrable. We employ ethical hacking, real-time monitoring, and zero-trust architectures to safeguard your data.',
        features: {
          '0': 'Penetration Testing & Audits',
          '1': 'Zero Trust Architecture',
          '2': 'Real-time Threat Monitoring',
          '3': 'GDPR & SOC2 Compliance',
          '4': 'Incident Response Planning'
        }
      },
      web: {
        title: 'Web Development',
        description: 'High-performance React & Next.js applications with stunning visuals.',
        longDescription: 'We craft visually stunning and high-performance web applications. Using modern frameworks like React, Next.js, and Tailwind CSS, we ensure your digital presence is fast, accessible, and SEO-optimized.',
        features: {
          '0': 'React & Next.js Development',
          '1': 'Progressive Web Apps (PWA)',
          '2': '3D WebGL Experiences',
          '3': 'Headless CMS Integration',
          '4': 'Performance Optimization'
        }
      },
      mob: {
        title: 'Mobile Solutions',
        description: 'Native and cross-platform mobile apps providing seamless experiences.',
        longDescription: 'Reach your customers wherever they are with our mobile development services. We build native iOS/Android apps and cross-platform solutions using React Native and Flutter for a seamless user experience.',
        features: {
          '0': 'iOS & Android Native Apps',
          '1': 'Cross-Platform (Flutter/React Native)',
          '2': 'Mobile UI/UX Design',
          '3': 'App Store Optimization',
          '4': 'Offline Capabilities'
        }
      },
      cloud: {
        title: 'Cloud Infrastructure',
        description: 'Scalable AWS/Azure/GCP architecture setup, serverless deployment, and DevOps.',
        longDescription: 'Scale effortlessly with our cloud infrastructure services. We design resilient cloud architectures on AWS, Azure, and Google Cloud, utilizing serverless technologies and containerization for maximum efficiency.',
        features: {
          '0': 'Cloud Migration Strategy',
          '1': 'Serverless Architecture',
          '2': 'Kubernetes & Docker orchestration',
          '3': 'CI/CD Pipeline Automation',
          '4': 'Cost Optimization'
        }
      },
      data: {
        title: 'Big Data',
        description: 'Data warehousing, ETL pipeline construction, and real-time analytics dashboards.',
        longDescription: 'Unlock the value of your data. Our Big Data engineers build robust pipelines to ingest, process, and visualize massive datasets, giving you actionable insights in real-time.',
        features: {
          '0': 'Data Warehousing (Snowflake/BigQuery)',
          '1': 'ETL/ELT Pipelines',
          '2': 'Real-time Streaming Analytics',
          '3': 'Business Intelligence Dashboards',
          '4': 'Data Governance & Quality'
        }
      }
    }
  },
  auth: {
    welcome_back: 'Welcome Back',
    create_account: 'Create Account',
    access_portal: 'Access your client portal',
    start_journey: 'Start your journey with Nexus',
    full_name: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    sign_in: 'Sign In',
    create_account_cta: 'Create Account',
    dont_have: "Don't have an account? Sign up",
    already_have: 'Already have an account? Sign in',
    admin_tip: 'Tip: Use admin@nexus.dev to login as Administrator.',
    developer_tip: 'Developers: Contact your administrator for login credentials.',
    developer_note: 'Note: Sign up is only for clients. Developers are created by administrators.'
  },
  booking: {
    login_required: 'Login Required',
    please_log_in: 'Please log in or create an account to schedule a consultation with our experts.',
    go_to_login: 'Go to Login',
    admin_restricted: 'Admin Access Restricted',
    admin_restricted_msg: 'Administrators cannot book meetings. Please switch to a client account to test booking functionality.',
      new_reservation: 'New Reservation',
      my_requests: 'My Requests',
      request_received_prefix: 'We have received your request for ',
      google_meet_integration: 'Google Meet Integration',
      google_meet_msg_prefix: 'Once an admin approves your request, a functional Google Meet link will be generated and sent to ',
      google_meet_msg_suffix: '.',
      select_services_hint: "Select one or more services you are interested in. We'll verify the availability in our agenda and secure your slot.",
      live_availability: 'Live Availability',
      real_time_checking: 'Real-time slot checking',
      select_project_required: 'Please select or create a related project before confirming the request.',
    schedule_consultation: 'Schedule a Consultation',
    agenda_for: 'Agenda for',
    unique_link_text: 'A unique Meet link will be provided upon approval.',
    select_date: 'Select Date',
    pick_date_hint: 'Pick a date to view agenda and available hours.',
    occupied_slots: 'Occupied Slots',
    no_bookings: 'No bookings',
    select_time: 'Select Time',
    select_project_placeholder: 'Select related project...',
    services_label: 'Services',
    description_label: 'Description',
    description_placeholder: 'Describe the goals and context for this meeting...',
    related_project_label: 'Related Project',
    not_eligible_suffix: ' — not eligible',
    logged_in_as: 'Logged in as:',
    clear_history: 'Clear history',
    refresh: 'Refresh',
    refresh_bookings: 'Refresh bookings',
    book_another: 'Book Another',
    view_my_requests: 'View My Requests',
    confirm_request: 'Confirm Request',
    processing: 'Processing...'
    ,
    no_booking_history: 'No booking history',
    join_meet: 'Join Meet'
    ,
    booking_failed: 'Booking failed'
  },
  dashboard: {
    title: 'Client Portal',
    developer_title: 'Developer Portal',
    welcome_back: 'Welcome back,',
    assigned_projects: 'Your assigned projects',
    no_assigned_projects: 'No projects have been assigned to you yet.',
    contact_admin: 'Contact your administrator for project assignments.',
    select_project: 'Select a project',
    no_projects: 'No projects',
    no_project_selected: 'No project selected',
    deadline_label: 'Deadline:',
    close_create_form: 'Close create form',
    create_project: 'Create project',
    rename_project: 'Rename project',
    delete_project: 'Delete project',
    project_name: 'Project name',
    deadline: 'Deadline',
    create: 'Create',
    cancel: 'Cancel',
    overall_progress: 'Overall Progress',
    tasks: 'Tasks',
    click_to_toggle: 'Click to toggle',
    drag_to_reorder: 'Drag to reorder',
    add_new_task_placeholder: 'Add new task...',
    work_breakdown: 'Work Breakdown',
    done: 'Done',
    remaining: 'Remaining',
    services: 'Services',
    description: 'Description',
    features: 'Key Features',
    project_not_found: 'Project not found',
    only_planning_delete: 'Only projects in Planning can be deleted. This project is already in progress or completed.',
    project_has_bookings: 'This project has associated bookings and cannot be deleted.',
    provide_valid_project_name: 'Please provide a valid project name',
    duplicate_project_name: 'You already have a project with that name. Choose a different name.',
    failed_to_create_project: 'Failed to create project'
  },
  dashboard_extra: {
    failed_to_rename_project: 'Failed to rename project'
  },
  common_ui: {
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    delete: 'Delete'
  },
  empty: {
    no_active_projects: "You don't have any active projects yet.",
    book_consultation: 'Book a consultation to get started.'
  },
  confirm: {
    delete_confirm_with_name: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    delete_confirm: 'Are you sure you want to delete this project? This action cannot be undone.'
    ,
    default_title: 'Confirm',
    confirm_label: 'Confirm',
    cancel_label: 'Cancel',
    processing: 'Processing...'
  },
  admin: {
    title: 'Admin Control Center',
    subtitle: 'Manage client meetings, approvals, and projects.',
    pending_bookings: 'Pending Bookings',
    active_clients: 'Active Clients',
    total_projects: 'Total Projects',
    active_developers: 'Active Developers',
    manage_users: 'Manage Users',
    manage_clients: 'Manage Clients',
    manage_developers: 'Manage Developers',
    add_developer: 'Add Developer',
    edit_developer: 'Edit Developer',
    developer_name: 'Developer Name',
    developer_email: 'Developer Email',
    create_developer: 'Create Developer',
    update_developer: 'Update Developer',
    assign_developer: 'Assign Developer',
    unassign_developer: 'Unassign Developer',
    select_developer: 'Select Developer',
    no_developer_assigned: 'No developer assigned',
    developer_assigned: 'Developer assigned successfully',
    approve_remove_tip: 'Approve or remove client accounts',
    name: 'Name',
    email: 'Email',
    status: 'Status',
    actions: 'Actions',
    activate: 'Activate',
    no_users_found: 'No users found.',
    no_developers_found: 'No developers found.',
    meeting_requests: 'Meeting Requests',
    manage_projects: 'Manage Projects',
    filter_requests_placeholder: 'Filter requests...',
    filter_clients_placeholder: 'Filter clients...',
    filter_developers_placeholder: 'Filter developers...',
    filter_by_name: 'Filter by name...',
    filter_by_client: 'Filter by client',
    filter_by_developer: 'Filter by developer',
    all_clients: 'All Clients',
    all_developers: 'All Developers',
    clear_history: 'Clear history',
    showing_requests: 'Showing {count} requests',
    client_label: 'Client',
    services_description: 'Services / Description',
    date_time: 'Date & Time',
    no_booking_requests: 'No booking requests found.',
    clear_booking_history_title: 'Clear Booking History',
    clear_booking_history_message: 'Remove cancelled/rejected bookings from the system. Optionally include finished bookings.',
    clear_confirm: 'Clear',
    clear_failed: 'Failed to clear booking history',
    include_finished: 'Include finished bookings',
    show_description: 'Show description',
    approve_send_link: 'Approve & Send Link',
    reject: 'Reject',
    mark_finished: 'Mark finished',
    cancel_booking: 'Cancel booking',
    no_description_provided: 'No description provided.',
    all_projects: 'All Projects',
    clients_create_note: 'Clients create and delete their own projects in My Projects.',
    client_label_short: 'Client:',
    developer_label_short: 'Developer:',
    due_label: 'Due:',
    rename: 'Rename',
    delete: 'Delete',
    deactivate: 'Deactivate',
    rename_project: 'Rename Project',
    provide_valid_project_name: 'Please provide a valid project name',
    failed_to_rename: 'Failed to rename',
    edit: 'Edit'
  },
  common: {
    back_to_services: 'Back to Services',
    request_sent: 'Request Sent!',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    create: 'Create'
  }
  ,
  notifications: {
    bell_label: 'Notifications',
    bell_title: 'Notifications',
    title: 'Notifications',
    refresh: 'Refresh',
    mark_all: 'Mark all',
    clear: 'Clear',
    show_all: 'Show all',
    clear_all: 'Clear All',
    close: 'Close notifications',
    loading: 'Loading...',
    no_notifications: 'No notifications',
    mark_as_read: 'Mark as read',
    mark_as_unread: 'Mark as unread',
    delete_notification: 'Delete notification',
    read: 'Read'
  },
  all_components: {
    navbar: 'Navbar',
    hero: 'Hero',
    services: 'Services',
    dashboard: 'Dashboard',
    booking: 'Booking',
    ai_consultant: 'AI Consultant',
    auth: 'Auth',
    admin_dashboard: 'Admin Dashboard',
    floating_copilot: 'Floating Copilot'
  }
  ,
  ai_consultant: {
    welcome: "Hello! I'm the Nexus AI Architect. Tell me about your software idea, and I'll help you break down the technical requirements, stack suggestions, and estimated scope.",
    title: 'AI Architect',
    subtitle: 'Powered by Gemini 2.5 Flash',
    status: {
      online: 'Online'
    },
    thinking: 'Thinking...',
    placeholder: "Describe your project idea (e.g., 'I want a mobile app for tracking fitness goals with social features')...",
    send: 'Send message',
    caution: 'AI responses can be inaccurate. Please consult our human engineers for final contracts.'
  },
  my_projects: {
    access_restricted: {
      title: 'Access Restricted',
      desc: 'Only client accounts can create or delete projects here. Administrators manage projects from the Admin Control Center.'
    },
    title: 'My Projects',
    create_project: 'Create project',
    empty: "You don't have any projects yet.",
    form: {
      project_name: 'Project name',
      deadline: 'Deadline',
      new_project_name: 'New project name',
      description: 'Description',
      description_placeholder: 'Describe your project goals and requirements...',
      services: 'Services / Functionalities',
      features: 'Key Features',
      feature_placeholder: 'Add a feature...'
    },
    actions: {
      rename: 'Rename',
      delete: 'Delete',
      details: 'Edit Details',
      add_feature: 'Add feature',
      remove_feature: 'Remove feature'
    },
    card: {
      due: 'Due:',
      status: 'Status:',
      show_details: 'Show details',
      hide_details: 'Hide details',
      description: 'Description',
      features: 'Features'
    },
    dialogs: {
      delete_title: 'Delete Project',
      delete_with_name_prefix: 'Are you sure you want to delete',
      delete_suffix: 'This action cannot be undone.',
      delete_generic: 'Are you sure you want to delete this project? This action cannot be undone.',
      rename_title: 'Rename Project',
      rename_desc_prefix: 'Rename',
      details_title: 'Project Details'
    },
    errors: {
      provide_valid_name: 'Please provide a valid project name',
      failed_rename: 'Failed to rename',
      provide_name: 'Please provide a project name',
      duplicate_name: 'You already have a project with that name. Choose a different name.',
      failed_create: 'Failed to create project',
      project_not_found: 'Project not found',
      only_delete_own: 'You can only delete your own projects',
      only_planning_delete: 'Only projects in Planning can be deleted. Contact Admin for protected projects.',
      has_bookings: 'This project has associated bookings and cannot be deleted.',
      failed_delete: 'Failed to delete project'
    }
  },
  copilot: {
    name: 'Nexus Copilot',
    init_text: "Hi! I'm Nexus Copilot. How can I assist you today?",
    open: 'Open Copilot',
    close: 'Close Copilot',
    thinking: 'Thinking...',
    placeholder: 'Ask anything...',
    send: 'Send message'
  }
};

export default en;
