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

// Partner apps and integrations
const partnerApps = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Real-time team notifications',
    icon: '�',
    color: 'from-purple-500 to-pink-500',
    category: 'Communication'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Enterprise collaboration hub',
    icon: '👥',
    color: 'from-blue-500 to-indigo-500',
    category: 'Communication'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Seamless schedule sync',
    icon: '�',
    color: 'from-green-500 to-emerald-500',
    category: 'Productivity'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate your workflows',
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
    category: 'Automation'
  },
  {
    id: 'sap',
    name: 'SAP HR',
    description: 'Enterprise HR integration',
    icon: '🏢',
    color: 'from-cyan-500 to-blue-500',
    category: 'Enterprise'
  },
  {
    id: 'payroll',
    name: 'Payroll Systems',
    description: 'Automatic hours export',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500',
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Translated image data
  const translatedPointageImages = pointageImages.map((img, index) => ({
    ...img,
    title: t(`appsShowcase.imagesTitles.${index}.title`, img.title),
    description: t(`appsShowcase.imagesTitles.${index}.description`, img.description),
    category: t(`appsShowcase.imagesTitles.${index}.category`, img.category)
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

  // Auto-rotate project images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % pointageImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % pointageImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + pointageImages.length) % pointageImages.length);
  };

  const openLightbox = (index: number) => {
    setLightboxImage(index);
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
    <div ref={containerRef} className="relative overflow-hidden">
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
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
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
          SECTION 2: Project Showcase - Pointage
          ======================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto">
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
                      pointage.synarizmie.dev
                    </div>
                  </div>
                </div>
                
                {/* Image container with aspect ratio */}
                <div className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      {/* Real project image */}
                      <img 
                        src={translatedPointageImages[activeImageIndex].src} 
                        alt={translatedPointageImages[activeImageIndex].title}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Overlay with title on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-6 text-white">
                          <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/80">
                            {translatedPointageImages[activeImageIndex].category}
                          </span>
                          <h4 className="text-xl font-bold mb-1">
                            {translatedPointageImages[activeImageIndex].title}
                          </h4>
                          <p className="text-sm text-white/80 max-w-md">
                            {translatedPointageImages[activeImageIndex].description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Navigation arrows */}
                  <button 
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 active:shadow-inner active:scale-95 transition-all duration-200 hover:scale-110 border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  </button>
                  <button 
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 active:shadow-inner active:scale-95 transition-all duration-200 hover:scale-110 border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <ArrowRight className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  </button>
                  
                  {/* View all button */}
                  <button
                    onClick={() => openLightbox(activeImageIndex)}
                    aria-label={t('appsShowcase.viewAll')}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    {t('appsShowcase.viewAll')}
                  </button>
                </div>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex gap-3 mt-4 justify-center">
                {translatedPointageImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`${t('appsShowcase.viewAll')} ${index + 1}`}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      index === activeImageIndex
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    {index === activeImageIndex && (
                      <motion.div 
                        layoutId="activeThumb"
                        className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                      />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Floating badges */}
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
                    key={index}
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
                <button className="group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 transition-all flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {t('appsShowcase.liveDemo')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('appsShowcase.learnMore')}
                </button>
              </div>
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
              {t('appsShowcase.whyChooseTitle').replace('SYNARIZMIE', '')} <span className="gradient-text-animated">SYNARIZMIE</span>?
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
        {isLightboxOpen && (
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
                setLightboxImage((prev) => (prev - 1 + translatedPointageImages.length) % translatedPointageImages.length);
              }}
              aria-label="Previous lightbox image"
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 hover:shadow-lg hover:shadow-white/10 active:bg-white/30 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage((prev) => (prev + 1) % translatedPointageImages.length);
              }}
              aria-label="Next lightbox image"
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/25 hover:shadow-lg hover:shadow-white/10 active:bg-white/30 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Image content */}
            <motion.div
              key={lightboxImage}
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
                      pointage.synarizmie.dev/{translatedPointageImages[lightboxImage].title.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                  </div>
                </div>
                
                {/* Large image display */}
                <div className="relative">
                  <img 
                    src={translatedPointageImages[lightboxImage].src} 
                    alt={translatedPointageImages[lightboxImage].title}
                    className="w-full h-auto max-h-[70vh] object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <span className="inline-block mb-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      {translatedPointageImages[lightboxImage].category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {translatedPointageImages[lightboxImage].title}
                    </h3>
                    <p className="text-white/80 max-w-lg">
                      {translatedPointageImages[lightboxImage].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex justify-center gap-3 mt-4">
                {translatedPointageImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImage(index);
                    }}
                    aria-label={`${t('appsShowcase.viewAll')} ${index + 1}`}
                    className={`w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === lightboxImage
                        ? 'border-blue-500 shadow-lg'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppsShowcase;
