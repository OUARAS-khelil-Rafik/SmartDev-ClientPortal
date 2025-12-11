
import React from 'react';
import { useI18n } from '../i18n';
import { Sparkles, BotMessageSquare, PanelsTopLeft, Rocket } from 'lucide-react';

const techLogos = [
  { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Go', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
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
  { name: 'Laravel', src: 'https://laravel.com/img/logotype.min.svg' },
  { name: 'Django', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
  { name: '.NET', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
  { name: 'Spring', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
  { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'AWS', src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Azure', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
  { name: 'GCP', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' }
];

const marqueeRows = [
  techLogos.slice(0, 14),
  techLogos.slice(14).concat(techLogos.slice(0, 6))
];

const Services: React.FC = () => {
  const { t } = useI18n();
  const marketingLinesRaw = t('services.marketingLines');
  const marketingLines = Array.isArray(marketingLinesRaw) ? marketingLinesRaw : [];

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
    <div id="services-section" className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors">
      <div className="absolute inset-0 gradient-aurora opacity-70 dark:opacity-90" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.07),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.07),transparent_22%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_22%)]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-24 pb-20 relative">
        <div className="text-center space-y-4 sm:space-y-5 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg glow-border">
            <Sparkles size={16} className="text-blue-500 dark:text-blue-300" /> {t('services.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight gradient-text-animated">{t('services.title')}</h2>
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
              className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200/70 dark:border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 perspective-1000 tilt-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
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
      </div>
    </div>
  );
};

export default Services;
