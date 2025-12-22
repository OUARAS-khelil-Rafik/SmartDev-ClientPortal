import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useI18n } from '../i18n';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Building2,
  Timer,
  ClipboardList,
  Download,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Play,
  X,
  Eye
} from 'lucide-react';

// Import images for the Employee Check-in System (Pointage)
import addWorkersImg from '../img/check_in_img/Add_workers.jpeg';
import demandeCongeImg from '../img/check_in_img/Demande_Congé.jpeg';
import sommaireImg from '../img/check_in_img/Sommaire.jpeg';
import centreRapportImg from '../img/check_in_img/Centre-rapport.jpeg';
import gestionPointagesImg from '../img/check_in_img/Gestion-pointages.jpeg';

// Import images for Braille Translator project
import brailleTranslatorImg from '../img/braille_img/Translator page.png';
import brailleTextToBrailleImg from '../img/braille_img/Transcriptor page (Text to Braille).png';
import brailleBrailleToTextImg from '../img/braille_img/Transcriptor page (Braille to Text).png';

// Project images for the Employee Check-in System (Pointage)
const pointageImages = [
  {
    id: 1,
    title: 'Ajouter un employé',
    description: 'Interface intuitive pour créer de nouveaux profils employés avec informations personnelles et données initiales.',
    category: 'Gestion RH',
    src: addWorkersImg
  },
  {
    id: 2,
    title: 'Gestion des demandes',
    description: 'Suivi complet des congés, RTT, heures supplémentaires avec statuts en temps réel.',
    category: 'Demandes',
    src: demandeCongeImg
  },
  {
    id: 3,
    title: 'Sommaire mensuel',
    description: 'Vue d\'ensemble des heures prestées, RTT, heures supplémentaires et congés restants.',
    category: 'Analytics',
    src: sommaireImg
  },
  {
    id: 4,
    title: 'Centre de rapports',
    description: 'Génération de rapports Excel et PDF pour le suivi des heures et des requêtes.',
    category: 'Rapports',
    src: centreRapportImg
  },
  {
    id: 5,
    title: 'Gestion des pointages',
    description: 'Tableau de bord complet pour la gestion quotidienne des pointages et présences.',
    category: 'Pointage',
    src: gestionPointagesImg
  }
];

// Project images for Braille Translator
const brailleImages = [
  {
    id: 1,
    title: 'Translator Page',
    description: 'Translate between multiple languages with Braille support. Bidirectional translation with real-time conversion.',
    category: 'Translation',
    src: brailleTranslatorImg
  },
  {
    id: 2,
    title: 'Text to Braille',
    description: 'Convert regular text to Braille notation with virtual keyboard support for Grade 1 and Grade 2 Braille.',
    category: 'Transcription',
    src: brailleTextToBrailleImg
  },
  {
    id: 3,
    title: 'Braille to Text',
    description: 'Transcribe Braille notation back to readable text. Interactive Braille cell input with visual feedback.',
    category: 'Transcription',
    src: brailleBrailleToTextImg
  }
];

// Project definitions
const projects = [
  {
    id: 'pointage',
    name: 'Pointage',
    icon: <Timer className="w-5 h-5" />,
    color: 'blue',
    url: 'http://pointagevdc.cloud'
  },
  {
    id: 'braille',
    name: 'Braille Translator',
    icon: <Globe className="w-5 h-5" />,
    color: 'cyan',
    url: 'https://dotwise-jk4yz203f-jamelsyh.vercel.app/'
  }
];

// Brand SVG Icons for Partner Apps
const SlackIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const TeamsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M20.625 8.073c.574 0 1.125.224 1.532.62.407.398.635.936.635 1.498v5.617a3.91 3.91 0 0 1-1.165 2.788 4.01 4.01 0 0 1-2.82 1.157h-2.995a.39.39 0 0 1-.278-.114.381.381 0 0 1-.115-.274V11.09a2.72 2.72 0 0 1 .806-1.934 2.79 2.79 0 0 1 1.958-.802h2.442v-.281zm-.987-1.406a2.063 2.063 0 0 0 2.063-2.063A2.063 2.063 0 0 0 19.638 2.5a2.063 2.063 0 0 0-2.063 2.104 2.063 2.063 0 0 0 2.063 2.063zM9.91 5.27a3.126 3.126 0 0 0 3.125 3.124A3.126 3.126 0 0 0 16.16 5.27 3.126 3.126 0 0 0 13.035 2.5a3.125 3.125 0 0 0-3.125 2.77zm7.807 5.312a3.415 3.415 0 0 0-1.013-2.433 3.492 3.492 0 0 0-2.458-1.01H7.753a3.493 3.493 0 0 0-2.458 1.01 3.416 3.416 0 0 0-1.013 2.433v6.614a.39.39 0 0 0 .115.274.39.39 0 0 0 .277.115h5.188v4.823a.39.39 0 0 0 .115.274.39.39 0 0 0 .278.114h3.852a4.94 4.94 0 0 0 3.467-1.424 4.816 4.816 0 0 0 1.435-3.43V10.58h.708z"/>
  </svg>
);

const GoogleCalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8">
    <path fill="#4285F4" d="M18.316 5.684H5.684v12.632h12.632V5.684z"/>
    <path fill="#FFFFFF" d="M16.105 10.526h-1.684v1.685h1.684v-1.685zm0 3.369h-1.684v1.684h1.684v-1.684zm-3.369-3.369h-1.684v1.685h1.684v-1.685zm0 3.369h-1.684v1.684h1.684v-1.684zm-3.368-3.369H7.684v1.685h1.684v-1.685zm0 3.369H7.684v1.684h1.684v-1.684z"/>
    <path fill="#EA4335" d="M18.316 4H5.684A1.684 1.684 0 0 0 4 5.684v12.632A1.684 1.684 0 0 0 5.684 20h12.632A1.684 1.684 0 0 0 20 18.316V5.684A1.684 1.684 0 0 0 18.316 4zm0 14.316H5.684V8.21h12.632v10.106z"/>
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M15.678 8.322H24v7.356h-8.322v8.322h-7.356v-8.322H0V8.322h8.322V0h7.356v8.322zm-2.17 5.187V10.49h-3.016v3.018H7.473v3.018h3.018v3.017h3.017v-3.017h3.018v-3.018h-3.018z"/>
  </svg>
);

const SAPIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M0 6v12h24V6H0zm10.72 9.203H9.407l-.37-1.462H6.742l-.37 1.462H5.059l1.976-6.406h1.708l1.976 6.406zm4.074 0h-1.172V9.6l-1.404 5.603h-.984L9.83 9.6v5.603H8.657V8.797h1.783l1.28 4.69 1.28-4.69h1.794v6.406zm4.143-.797c-.305.573-.858.898-1.642.898-.886 0-1.573-.33-1.836-.99l.81-.573c.193.435.573.701 1.026.701.428 0 .733-.213.733-.548 0-.345-.295-.5-.832-.713l-.345-.132c-.759-.289-1.21-.701-1.21-1.489 0-.797.629-1.363 1.538-1.363.683 0 1.162.264 1.452.78l-.78.537c-.163-.295-.42-.467-.672-.467-.33 0-.548.193-.548.457 0 .285.218.414.701.608l.345.132c.871.335 1.363.72 1.363 1.594 0 .152-.036.295-.103.568z"/>
  </svg>
);

const PayrollIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
  </svg>
);

// Partner apps and integrations
const partnerApps = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Real-time team notifications',
    icon: <SlackIcon />,
    color: 'from-[#4A154B] to-[#611f69]',
    iconColor: '#E01E5A',
    category: 'Communication'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Enterprise collaboration hub',
    icon: <TeamsIcon />,
    color: 'from-[#464EB8] to-[#505AC9]',
    iconColor: '#6264A7',
    category: 'Communication'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Seamless schedule sync',
    icon: <GoogleCalendarIcon />,
    color: 'from-[#4285F4] to-[#34A853]',
    iconColor: '#4285F4',
    category: 'Productivity'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate your workflows',
    icon: <ZapierIcon />,
    color: 'from-[#FF4A00] to-[#FF8C00]',
    iconColor: '#FF4A00',
    category: 'Automation'
  },
  {
    id: 'sap',
    name: 'SAP HR',
    description: 'Enterprise HR integration',
    icon: <SAPIcon />,
    color: 'from-[#0FAAFF] to-[#008FD3]',
    iconColor: '#0FAAFF',
    category: 'Enterprise'
  },
  {
    id: 'payroll',
    name: 'Payroll Systems',
    description: 'Automatic hours export',
    icon: <PayrollIcon />,
    color: 'from-[#00C853] to-[#009624]',
    iconColor: '#00C853',
    category: 'Finance'
  }
];

// Features for Why Choose section
const whyChooseFeatures = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Gain de temps',
    description: 'Réduisez de 70% le temps consacré à la gestion administrative des heures.',
    stat: '70%'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Conformité garantie',
    description: 'Respect automatique des réglementations du travail et conventions collectives.',
    stat: '100%'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'ROI rapide',
    description: 'Retour sur investissement visible dès les premiers mois d\'utilisation.',
    stat: '3x'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Satisfaction employés',
    description: 'Interface moderne et intuitive appréciée par toutes les générations.',
    stat: '95%'
  }
];

// Built for industries
const builtForIndustries = [
  { icon: <Building2 className="w-8 h-8" />, name: 'PME & ETI', description: '10 à 500 employés' },
  { icon: <Globe className="w-8 h-8" />, name: 'Multinationales', description: 'Multi-sites, multi-pays' },
  { icon: <ClipboardList className="w-8 h-8" />, name: 'Services', description: 'Consulting, IT, Agences' },
  { icon: <Timer className="w-8 h-8" />, name: 'Industrie', description: 'Production, Logistique' }
];

const AppsShowcase: React.FC = () => {
  const { t } = useI18n();
  const [pointageImageIndex, setPointageImageIndex] = useState(0);
  const [brailleImageIndex, setBrailleImageIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const [lightboxProject, setLightboxProject] = useState<'pointage' | 'braille'>('pointage');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Translated image data for Pointage
  const translatedPointageImages = pointageImages.map((img, index) => ({
    ...img,
    title: t(`appsShowcase.imagesTitles.${index}.title`, img.title),
    description: t(`appsShowcase.imagesTitles.${index}.description`, img.description),
    category: t(`appsShowcase.imagesTitles.${index}.category`, img.category)
  }));

  // Translated image data for Braille
  const translatedBrailleImages = brailleImages.map((img, index) => ({
    ...img,
    title: t(`appsShowcase.brailleImagesTitles.${index}.title`, img.title),
    description: t(`appsShowcase.brailleImagesTitles.${index}.description`, img.description),
    category: t(`appsShowcase.brailleImagesTitles.${index}.category`, img.category)
  }));

  // Translated features
  const translatedWhyChooseFeatures = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('appsShowcase.whyChooseFeatures.timeSaving.title'),
      description: t('appsShowcase.whyChooseFeatures.timeSaving.description'),
      stat: t('appsShowcase.whyChooseFeatures.timeSaving.stat')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('appsShowcase.whyChooseFeatures.compliance.title'),
      description: t('appsShowcase.whyChooseFeatures.compliance.description'),
      stat: t('appsShowcase.whyChooseFeatures.compliance.stat')
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('appsShowcase.whyChooseFeatures.roi.title'),
      description: t('appsShowcase.whyChooseFeatures.roi.description'),
      stat: t('appsShowcase.whyChooseFeatures.roi.stat')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('appsShowcase.whyChooseFeatures.satisfaction.title'),
      description: t('appsShowcase.whyChooseFeatures.satisfaction.description'),
      stat: t('appsShowcase.whyChooseFeatures.satisfaction.stat')
    }
  ];

  // Translated industries
  const translatedBuiltForIndustries = [
    { icon: <Building2 className="w-8 h-8" />, name: t('appsShowcase.builtFor.sme.name'), description: t('appsShowcase.builtFor.sme.description') },
    { icon: <Globe className="w-8 h-8" />, name: t('appsShowcase.builtFor.multinational.name'), description: t('appsShowcase.builtFor.multinational.description') },
    { icon: <ClipboardList className="w-8 h-8" />, name: t('appsShowcase.builtFor.services.name'), description: t('appsShowcase.builtFor.services.description') },
    { icon: <Timer className="w-8 h-8" />, name: t('appsShowcase.builtFor.industry.name'), description: t('appsShowcase.builtFor.industry.description') }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % partnerApps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close lightbox with Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // Auto-rotate project images
  useEffect(() => {
    const pointageInterval = setInterval(() => {
      setPointageImageIndex((prev) => (prev + 1) % translatedPointageImages.length);
    }, 5000);
    const brailleInterval = setInterval(() => {
      setBrailleImageIndex((prev) => (prev + 1) % translatedBrailleImages.length);
    }, 6000);
    return () => {
      clearInterval(pointageInterval);
      clearInterval(brailleInterval);
    };
  }, [translatedPointageImages.length, translatedBrailleImages.length]);

  const openLightbox = (index: number, project: 'pointage' | 'braille') => {
    setLightboxImage(index);
    setLightboxProject(project);
    setIsLightboxOpen(true);
  };

  // Animation variants - Using proper Easing type format
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="relative overflow-hidden" id="apps-showcase" ref={containerRef as any}>
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* ========================================
          SECTION 1: Apps & Integrations Carousel
          ======================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('appsShowcase.ecosystem')}</span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('appsShowcase.appsTitle').split('&')[0]} <span className="gradient-text-animated">&amp; {t('appsShowcase.appsTitle').split('&')[1] || 'Integrations'}</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('appsShowcase.appsSubtitle')}
            </motion.p>
          </motion.div>

          {/* Carousel */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="flex overflow-hidden py-8">
              <motion.div 
                className="flex gap-6"
                animate={{ x: -carouselIndex * 280 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                {[...partnerApps, ...partnerApps].map((app, index) => (
                  <motion.div
                    key={`${app.id}-${index}`}
                    variants={scaleVariants}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="flex-shrink-0 w-64 group"
                  >
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {app.category}
                        </span>
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {app.icon}
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {app.description}
                      </p>
                      
                      {/* Connect button */}
                      <button className="mt-4 w-full py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                        <span>{t('appsShowcase.connect')}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      
                      {/* Bottom gradient line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${app.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Carousel navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {partnerApps.map((app, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`Go to ${app.name}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === carouselIndex % partnerApps.length
                      ? 'w-8 bg-blue-500'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 2: Project Showcase - All Projects
          ======================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* ===== PROJECT 1: Pointage (Images Left, Text Right) ===== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left side - Image showcase */}
            <motion.div variants={itemVariants} className="relative">
              {/* Main image display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Browser-like header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white dark:bg-slate-900 rounded-md px-3 py-1 text-xs text-slate-500 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      pointage.novalis-ai.dev
                    </div>
                  </div>
                </div>
                
                {/* Image container with aspect ratio */}
                <div
                  className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(pointageImageIndex, 'pointage')}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`pointage-${pointageImageIndex}`}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={translatedPointageImages[pointageImageIndex]?.src} 
                        alt={translatedPointageImages[pointageImageIndex]?.title}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6 text-white">
                          <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/80">
                            {translatedPointageImages[pointageImageIndex]?.category}
                          </span>
                          <h4 className="text-xl font-bold mb-1">
                            {translatedPointageImages[pointageImageIndex]?.title}
                          </h4>
                          <p className="text-sm text-white/80 max-w-md">
                            {translatedPointageImages[pointageImageIndex]?.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                </div>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {translatedPointageImages.map((img, index) => (
                  <button
                    key={`pointage-thumb-${index}`}
                    onClick={() => setPointageImageIndex(index)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      index === pointageImageIndex
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <img src={img.src} alt={img.title} decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('appsShowcase.productionReady')}
              </motion.div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                <Timer className="w-4 h-4" />
                {t('appsShowcase.featuredProject')}
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {t('appsShowcase.pointageTitle')}
                <span className="block text-xl sm:text-2xl font-normal text-slate-500 dark:text-slate-400 mt-2">
                  {t('appsShowcase.pointageSubtitle')}
                </span>
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('appsShowcase.pointageDescription')}
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Users />, text: t('appsShowcase.features.employeeManagement') },
                  { icon: <Calendar />, text: t('appsShowcase.features.leaveRequests') },
                  { icon: <BarChart3 />, text: t('appsShowcase.features.detailedReports') },
                  { icon: <Download />, text: t('appsShowcase.features.excelPdfExport') },
                  { icon: <Shield />, text: t('appsShowcase.features.enhancedSecurity') },
                  { icon: <Smartphone />, text: t('appsShowcase.features.responsiveDesign') }
                ].map((feature, index) => (
                  <motion.div
                    key={`pointage-feature-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      {React.cloneElement(feature.icon, { className: 'w-4 h-4' })}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={projects.find(p => p.id === 'pointage')?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {t('appsShowcase.liveDemo')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => openLightbox(0, 'pointage')}
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  {t('appsShowcase.learnMore')}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* ===== PROJECT 2: Braille (Text Left, Images Right) ===== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left side - Content */}
            <motion.div variants={itemVariants} className="space-y-6 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-sm font-semibold">
                <Globe className="w-4 h-4" />
                {t('appsShowcase.featuredProject')}
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {t('appsShowcase.brailleTitle')}
                <span className="block text-xl sm:text-2xl font-normal text-slate-500 dark:text-slate-400 mt-2">
                  {t('appsShowcase.brailleSubtitle')}
                </span>
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('appsShowcase.brailleDescription')}
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Globe />, text: t('appsShowcase.brailleFeatures.multiLanguage') },
                  { icon: <Zap />, text: t('appsShowcase.brailleFeatures.realTimeConversion') },
                  { icon: <FileText />, text: t('appsShowcase.brailleFeatures.grade1Grade2') },
                  { icon: <Users />, text: t('appsShowcase.brailleFeatures.accessibilityFirst') },
                  { icon: <Smartphone />, text: t('appsShowcase.brailleFeatures.virtualKeyboard') },
                  { icon: <Download />, text: t('appsShowcase.brailleFeatures.exportOptions') }
                ].map((feature, index) => (
                  <motion.div
                    key={`braille-feature-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      {React.cloneElement(feature.icon, { className: 'w-4 h-4' })}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={projects.find(p => p.id === 'braille')?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {t('appsShowcase.liveDemo')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => openLightbox(0, 'braille')}
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  {t('appsShowcase.learnMore')}
                </button>
              </div>
            </motion.div>

            {/* Right side - Image showcase */}
            <motion.div variants={itemVariants} className="relative lg:order-2">
              {/* Main image display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                {/* Browser-like header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white dark:bg-slate-900 rounded-md px-3 py-1 text-xs text-slate-500 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      translating.app
                    </div>
                  </div>
                </div>
                
                {/* Image container with aspect ratio */}
                <div
                  className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(brailleImageIndex, 'braille')}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`braille-${brailleImageIndex}`}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={translatedBrailleImages[brailleImageIndex]?.src} 
                        alt={translatedBrailleImages[brailleImageIndex]?.title}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6 text-white">
                          <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/80">
                            {translatedBrailleImages[brailleImageIndex]?.category}
                          </span>
                          <h4 className="text-xl font-bold mb-1">
                            {translatedBrailleImages[brailleImageIndex]?.title}
                          </h4>
                          <p className="text-sm text-white/80 max-w-md">
                            {translatedBrailleImages[brailleImageIndex]?.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                </div>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {translatedBrailleImages.map((img, index) => (
                  <button
                    key={`braille-thumb-${index}`}
                    onClick={() => setBrailleImageIndex(index)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      index === brailleImageIndex
                        ? 'border-cyan-500 shadow-lg scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                    }`}
                  >
                    <img src={img.src} alt={img.title} decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-4 -left-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t('appsShowcase.enterpriseGrade')}
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ========================================
          SECTION 3: Why Choose Us
          ======================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-6">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{t('appsShowcase.advantages')}</span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('appsShowcase.whyChooseTitle').replace('NOVALIS AI', '')} <span className="gradient-text-animated">NOVALIS AI</span>?
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('appsShowcase.whyChooseSubtitle')}
            </motion.p>
          </motion.div>

          {/* Stats/Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {translatedWhyChooseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Stat number */}
                  <div className="absolute top-4 right-4 text-4xl font-black text-blue-500/20 dark:text-blue-400/20 group-hover:text-blue-500/30 transition-colors">
                    {feature.stat}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                  
                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 4: Built Specifically For
          ======================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 relative z-10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 dark:via-blue-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 dark:via-purple-500/50 to-transparent" />
          
          {/* Floating orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-white/10 mb-6">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('appsShowcase.industries')}</span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('appsShowcase.builtForTitle')}
              <span className="block text-xl sm:text-2xl font-normal text-slate-500 dark:text-slate-400 mt-2">
                {t('appsShowcase.builtForSubtitle')}
              </span>
            </motion.h2>
          </motion.div>

          {/* Industries grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {translatedBuiltForIndustries.map((industry, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 shadow-sm dark:shadow-none transition-all duration-300 text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {industry.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {industry.description}
                  </p>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform badges */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.p variants={itemVariants} className="text-sm text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
              {t('appsShowcase.availableOn')}
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center gap-6">
              {[
                { icon: <Monitor className="w-6 h-6" />, label: t('appsShowcase.platforms.desktop') },
                { icon: <Smartphone className="w-6 h-6" />, label: t('appsShowcase.platforms.mobile') },
                { icon: <Globe className="w-6 h-6" />, label: t('appsShowcase.platforms.web') }
              ].map((platform, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all">
                    {platform.icon}
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {platform.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto">
              {t('appsShowcase.startProject')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          Lightbox Modal
          ======================================== */}
      <AnimatePresence>
        {isLightboxOpen && (() => {
          const currentImages = lightboxProject === 'pointage' ? translatedPointageImages : translatedBrailleImages;
          const projectDomain = lightboxProject === 'pointage' ? 'pointage.novalis-ai.dev' : 'braille.novalis-ai.dev';
          const themeColor = lightboxProject === 'pointage' ? 'blue' : 'cyan';
          
          return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 hover:shadow-lg hover:shadow-white/10 active:bg-white/30 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage((prev) => (prev - 1 + currentImages.length) % currentImages.length);
              }}
              aria-label="Previous lightbox image"
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 hover:shadow-lg hover:shadow-white/10 active:bg-white/30 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage((prev) => (prev + 1) % currentImages.length);
              }}
              aria-label="Next lightbox image"
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 hover:shadow-lg hover:shadow-white/10 active:bg-white/30 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Image content */}
            <motion.div
              key={`${lightboxProject}-${lightboxImage}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white dark:bg-slate-900 rounded-md px-3 py-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      {projectDomain}/{currentImages[lightboxImage]?.title.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>
                </div>
                
                {/* Large image display */}
                <div className="relative">
                  <img 
                    src={currentImages[lightboxImage]?.src} 
                    alt={currentImages[lightboxImage]?.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-auto max-h-[70vh] object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <span className={`inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium ${themeColor === 'blue' ? 'bg-blue-500' : 'bg-cyan-500'} text-white`}>
                      {currentImages[lightboxImage]?.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentImages[lightboxImage]?.title}
                    </h3>
                    <p className="text-white/80 max-w-lg">
                      {currentImages[lightboxImage]?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-3 mt-4">
                {currentImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImage(index);
                    }}
                    aria-label={`${t('appsShowcase.viewAll')} ${index + 1}`}
                    className={`w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === lightboxImage
                        ? `${themeColor === 'blue' ? 'border-blue-500' : 'border-cyan-500'} shadow-lg`
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default AppsShowcase;
