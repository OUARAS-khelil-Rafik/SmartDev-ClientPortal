
import React, { useState, useEffect } from 'react';
import MotionZone from './MotionZone';
import { useI18n } from '../i18n';
import { Sparkles, BotMessageSquare, PanelsTopLeft, Rocket } from 'lucide-react';

const techLogos = [
  { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'C++', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'C#', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Vue.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Angular', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { name: 'Flutter', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'React Native', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Swift', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
  { name: 'Kotlin', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
  { name: 'Rust', src: 'https://www.rust-lang.org/logos/rust-logo-blk.svg' },
  { name: 'Ruby', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
  { name: 'PHP', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'Laravel', src: 'https://laravel.com/img/logotype.min.svg' },
  { name: 'Django', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
  { name: 'Flask', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
  { name: 'FastAPI', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'Express.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'HTML', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'Tailwind', src: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tailwindcss.svg' },
  { name: 'Bootstrap', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  { name: 'TensorFlow', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg' },
  { name: 'LLaMA', src: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/meta.svg' },
  { name: 'NumPy', src: 'https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg' },
  { name: 'Pandas', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
  { name: 'Matplotlib', src: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg' },
  { name: 'Seaborn', src: 'https://seaborn.pydata.org/_images/logo-mark-lightbg.svg' },
  { name: 'Apache Spark', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg' },
  { name: 'Streamlit', src: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/streamlit.svg' },
  { name: 'SQLite', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
  { name: 'SQL', src: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png' },
  { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Oracle', src: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
  { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'AWS', src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Azure', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
  { name: 'GCP', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
  { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
];

const marqueeRows = [
  techLogos.slice(0, 14),
  techLogos.slice(14).concat(techLogos.slice(0, 6))
];

const systemLogos = [
  { name: 'Windows', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg' },
  { name: 'macOS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg' },
  { name: 'Linux', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' }
];

const Services: React.FC = () => {
  const { t } = useI18n();
  const marketingLinesRaw = t('services.marketingLines');
  const marketingLines = Array.isArray(marketingLinesRaw) ? marketingLinesRaw : [];

  const deviceHighlights = [
    {
      title: t('services.devices.highlights.pixel_perfect.title'),
      desc: t('services.devices.highlights.pixel_perfect.desc')
    },
    {
      title: t('services.devices.highlights.native_performance.title'),
      desc: t('services.devices.highlights.native_performance.desc')
    },
    {
      title: t('services.devices.highlights.security_compliance.title'),
      desc: t('services.devices.highlights.security_compliance.desc')
    },
    {
      title: t('services.devices.highlights.ship_everywhere.title'),
      desc: t('services.devices.highlights.ship_everywhere.desc')
    }
  ];

  const [currentOsIndex, setCurrentOsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOsIndex((prev) => (prev + 1) % systemLogos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const capabilityCards = [
    {
      icon: <BotMessageSquare size={28} className="text-blue-300" />,
      title: t('services.capabilities.ai.title'),
      highlight: t('services.capabilities.ai.highlight'),
      desc: t('services.capabilities.ai.desc')
    },
    {
      icon: <PanelsTopLeft size={28} className="text-cyan-300" />,
      title: t('services.capabilities.experiences.title'),
      highlight: t('services.capabilities.experiences.highlight'),
      desc: t('services.capabilities.experiences.desc')
    },
    {
      icon: <Sparkles size={28} className="text-amber-300" />,
      title: t('services.capabilities.platforms.title'),
      highlight: t('services.capabilities.platforms.highlight'),
      desc: t('services.capabilities.platforms.desc')
    },
    {
      icon: <Rocket size={28} className="text-emerald-300" />,
      title: t('services.capabilities.delivery.title'),
      highlight: t('services.capabilities.delivery.highlight'),
      desc: t('services.capabilities.delivery.desc')
    }
  ];

  return (
    <MotionZone variant="fadeUp" className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors" id="services-section">
      <div className="absolute inset-0 gradient-aurora opacity-70 dark:opacity-90" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.07),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.07),transparent_22%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_22%)]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-24 pb-20 relative">
        <div className="text-center space-y-4 sm:space-y-5 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg glow-border">
            <Sparkles size={16} className="text-blue-500 dark:text-blue-300" /> {t('services.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight gradient-text-animated pb-1">{t('services.title')}</h2>
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto">{t('services.subtitle')}</p>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">{t('services.promise')}</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {marketingLines.map((line, idx) => (
              <span key={idx} className="px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur">
                {line}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {capabilityCards.map((capability, index) => (
            <div
              key={capability.title}
              className={`glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200/70 dark:border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 perspective-1000 tilt-hover animate-fade-in-up animation-delay-${index * 80}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 shadow-inner">
                  {capability.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{capability.title}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-200">{capability.highlight}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{capability.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/80 dark:bg-white/5 rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-blue-700 dark:text-blue-200 text-sm font-semibold uppercase tracking-[0.25em] mb-2">{t('services.stack_title')}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('services.stack_subtitle')}</h3>
              <p className="text-slate-700 dark:text-slate-200 mt-2 max-w-3xl">{t('services.stack_caption')}</p>
            </div>
          </div>

          <div className="space-y-6">
            {marqueeRows.map((row, rowIdx) => (
              <div key={rowIdx} className="overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-inner">
                <div className={`marquee-track ${rowIdx === 0 ? 'marquee-fast' : 'marquee-slow'}`}>
                  {[...row, ...row].map((logo, idx) => (
                    <div key={`${logo.name}-${idx}`} className="flex items-center gap-3 px-6 py-4">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white shadow-sm border border-slate-200/80 dark:bg-white dark:border-white/20 dark:shadow-white/10 flex items-center justify-center">
                        <img src={logo.src} alt={logo.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" loading="lazy" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white/90">{logo.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid lg:grid-cols-[1.1fr,0.9fr] gap-8 items-center animate-fade-in-up">
          <div className="relative p-6 sm:p-8 rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/95 dark:bg-slate-900/85 shadow-2xl overflow-hidden">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-500/12 dark:bg-blue-500/18 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-16 bottom-6 h-44 w-44 rounded-full bg-emerald-400/10 dark:bg-emerald-400/18 blur-3xl" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,rgba(59,130,246,0.08),transparent_46%),radial-gradient(circle_at_72%_28%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_52%_78%,rgba(236,72,153,0.05),transparent_34%)] dark:bg-[radial-gradient(circle_at_28%_42%,rgba(59,130,246,0.14),transparent_46%),radial-gradient(circle_at_72%_28%,rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_52%_78%,rgba(236,72,153,0.08),transparent_34%)]" aria-hidden="true" />

            <div className="relative h-[370px] sm:h-[440px] flex items-center justify-center">
              <div className="absolute -top-2 left-6 flex items-center gap-3 rounded-full bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 border border-slate-200/70 dark:border-white/10 px-4 py-2 backdrop-blur-sm shadow-lg device-bounce z-50">
                <div className="relative h-5 w-5 overflow-hidden">
                  {systemLogos.map((os, idx) => (
                    <img
                      key={os.name}
                      src={os.src}
                      alt={os.name}
                      className={`absolute inset-0 h-5 w-5 object-contain transition-all duration-500 ${idx === currentOsIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                      loading="lazy"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-white/90">{t('services.devices.runs_on_every_os')}</span>
              </div>

              <div className="relative w-full max-w-3xl">
                {/* Tablet front-left */}
                <div className="absolute -left-8 sm:-left-4 bottom-4 sm:bottom-8 w-36 sm:w-40 rounded-[26px] border border-slate-700/30 dark:border-white/15 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 shadow-2xl backdrop-blur device-sway device-glow z-30">
                  <div className="m-3 rounded-2xl bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 border border-slate-600/50 dark:border-white/15 h-44 flex flex-col justify-between p-3 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-white/80">
                      <span>12:45</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300">5G</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(8)].map((_, idx) => (
                        <span key={idx} className={`h-5 rounded-md bg-white/60 dark:bg-white/20 grid-cell-pulse animation-delay-${idx * 150}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/80">
                      <span className="h-6 w-6 rounded-full bg-white/60 dark:bg-white/20 border border-white/30 dark:border-white/20" />
                      <span className="flex-1 h-2 rounded-full bg-white/60 dark:bg-white/25" />
                    </div>
                  </div>
                </div>

                {/* Desktop/laptop back layer */}
                <div className="relative w-[84%] sm:w-[88%] mx-auto rounded-[30px] border border-slate-600/40 dark:border-white/15 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 p-4 shadow-2xl device-float device-glow z-10">
                  <div className="h-[210px] sm:h-[240px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-white/12 shadow-inner overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-300" />
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    </div>
                    <div className="px-4 grid grid-cols-4 gap-3">
                      {[...Array(12)].map((_, idx) => (
                        <div key={idx} className={`h-10 rounded-xl bg-white/40 dark:bg-white/10 border border-white/20 dark:border-white/5 grid-cell-pulse animation-delay-${idx * 100}`} />
                      ))}
                    </div>
                    <div className="px-4 pt-4 grid grid-cols-3 gap-3">
                      {[...Array(6)].map((_, idx) => (
                        <div key={idx} className={`h-2 rounded-full bg-white/50 dark:bg-white/15 grid-cell-shimmer animation-delay-${idx * 200}`} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 h-5 w-4/5 mx-auto rounded-full bg-slate-500/60" />
                </div>

                {/* Phone front-right */}
                <div className="absolute right-0 sm:right-1 top-1 sm:top-3 w-28 sm:w-32 rounded-[24px] border border-slate-700/30 dark:border-white/15 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 shadow-xl backdrop-blur device-bounce device-glow z-40">
                  <div className="m-3 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 border border-slate-600/50 dark:border-white/15 h-40 flex flex-col justify-between p-4 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-white/90">
                      <span>{t('services.devices.phone_label')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-200">{t('services.devices.online_status')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(9)].map((_, idx) => (
                        <div key={idx} className={`h-5 rounded-lg bg-white/60 dark:bg-white/20 grid-cell-fade animation-delay-${idx * 120}`} />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-14 rounded-full bg-white/60 dark:bg-white/20" />
                      <div className="h-2 w-10 rounded-full bg-emerald-400/80" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg">
              <PanelsTopLeft size={16} className="text-emerald-500" /> {t('services.devices.multi_device_confidence')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('services.devices.unified_experiences')}</h3>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-3xl">
              {t('services.devices.unified_experiences_desc')}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {deviceHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 shadow-sm">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {systemLogos.map((os) => (
                <div key={os.name} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-sm">
                  <img src={os.src} alt={os.name} className="h-6 w-6 object-contain" loading="lazy" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-white/90">{os.name}</span>
                </div>
              ))}
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('services.devices.more_platforms')}</span>
            </div>
          </div>
        </div>
      </div>
    </MotionZone>
  );
};

export default Services;
