
import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Brain, Shield, Globe, Smartphone, Cloud, Database, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { Service } from '../types';

// Service texts are localized at runtime using `t('services.items.<id>...')`

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { t } = useI18n();

  const servicesList: Service[] = [
    {
      id: 'ai',
      icon: <Brain size={40} className="text-purple-500" />,
      title: t('services.items.ai.title'),
      description: t('services.items.ai.description'),
      longDescription: t('services.items.ai.longDescription'),
      features: [
        t('services.items.ai.features.0'),
        t('services.items.ai.features.1'),
        t('services.items.ai.features.2'),
        t('services.items.ai.features.3'),
        t('services.items.ai.features.4')
      ]
    },
    {
      id: 'sec',
      icon: <Shield size={40} className="text-emerald-500" />,
      title: t('services.items.sec.title'),
      description: t('services.items.sec.description'),
      longDescription: t('services.items.sec.longDescription'),
      features: [
        t('services.items.sec.features.0'),
        t('services.items.sec.features.1'),
        t('services.items.sec.features.2'),
        t('services.items.sec.features.3'),
        t('services.items.sec.features.4')
      ]
    },
    {
      id: 'web',
      icon: <Globe size={40} className="text-blue-500" />,
      title: t('services.items.web.title'),
      description: t('services.items.web.description'),
      longDescription: t('services.items.web.longDescription'),
      features: [
        t('services.items.web.features.0'),
        t('services.items.web.features.1'),
        t('services.items.web.features.2'),
        t('services.items.web.features.3'),
        t('services.items.web.features.4')
      ]
    },
    {
      id: 'mob',
      icon: <Smartphone size={40} className="text-orange-500" />,
      title: t('services.items.mob.title'),
      description: t('services.items.mob.description'),
      longDescription: t('services.items.mob.longDescription'),
      features: [
        t('services.items.mob.features.0'),
        t('services.items.mob.features.1'),
        t('services.items.mob.features.2'),
        t('services.items.mob.features.3'),
        t('services.items.mob.features.4')
      ]
    },
    {
      id: 'cloud',
      icon: <Cloud size={40} className="text-sky-500" />,
      title: t('services.items.cloud.title'),
      description: t('services.items.cloud.description'),
      longDescription: t('services.items.cloud.longDescription'),
      features: [
        t('services.items.cloud.features.0'),
        t('services.items.cloud.features.1'),
        t('services.items.cloud.features.2'),
        t('services.items.cloud.features.3'),
        t('services.items.cloud.features.4')
      ]
    },
    {
      id: 'data',
      icon: <Database size={40} className="text-red-500" />,
      title: t('services.items.data.title'),
      description: t('services.items.data.description'),
      longDescription: t('services.items.data.longDescription'),
      features: [
        t('services.items.data.features.0'),
        t('services.items.data.features.1'),
        t('services.items.data.features.2'),
        t('services.items.data.features.3'),
        t('services.items.data.features.4')
      ]
    }
  ];

  if (selectedService) {
      return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                  <ArrowLeft size={20} /> {t('common.back_to_services')}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mb-6">
                            {React.cloneElement(selectedService.icon as React.ReactElement<any>, { size: 64 })}
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                            {selectedService.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                            {selectedService.longDescription}
                        </p>
                        
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                              <Zap className="text-yellow-300" /> {t('services.why_choose')}
                            </h3>
                            <p className="text-blue-100">
                              {t('services.why_choose_prefix')} <strong>{selectedService.title}</strong> {t('services.why_choose_suffix')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('services.engineering_excellence')}</h3>
                        <div className="space-y-4">
                            {selectedService.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide text-sm mb-2">{t('services.our_expertise')}</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">{t('services.engineering_excellence')}</h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-150 duration-500">
                {service.icon}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                
                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                  {t('services.view_details')} <span className="ml-2">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
