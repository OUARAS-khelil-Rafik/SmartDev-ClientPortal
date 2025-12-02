
import React, { useState } from 'react';
import { Brain, Shield, Globe, Smartphone, Cloud, Database, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { Service } from '../types';

const servicesList: Service[] = [
  {
    id: 'ai',
    icon: <Brain size={40} className="text-purple-500" />,
    title: "AI & Machine Learning",
    description: "Custom LLM integration, predictive analytics, and automated decision-making systems.",
    longDescription: "Harness the power of Generative AI and Machine Learning to transform your business operations. We build custom models tailored to your specific data sets, enabling predictive insights, automated content generation, and intelligent agents.",
    features: [
        "Custom LLM Fine-tuning",
        "Predictive Analytics Dashboards",
        "Natural Language Processing (NLP)",
        "Computer Vision Systems",
        "AI-Powered Automation Agents"
    ]
  },
  {
    id: 'sec',
    icon: <Shield size={40} className="text-emerald-500" />,
    title: "Cybersecurity",
    description: "Penetration testing, security audits, and secure architecture design to protect assets.",
    longDescription: "In an era of increasing digital threats, our cybersecurity services ensure your infrastructure is impenetrable. We employ ethical hacking, real-time monitoring, and zero-trust architectures to safeguard your data.",
    features: [
        "Penetration Testing & Audits",
        "Zero Trust Architecture",
        "Real-time Threat Monitoring",
        "GDPR & SOC2 Compliance",
        "Incident Response Planning"
    ]
  },
  {
    id: 'web',
    icon: <Globe size={40} className="text-blue-500" />,
    title: "Web Development",
    description: "High-performance React & Next.js applications with stunning visuals.",
    longDescription: "We craft visually stunning and high-performance web applications. Using modern frameworks like React, Next.js, and Tailwind CSS, we ensure your digital presence is fast, accessible, and SEO-optimized.",
    features: [
        "React & Next.js Development",
        "Progressive Web Apps (PWA)",
        "3D WebGL Experiences",
        "Headless CMS Integration",
        "Performance Optimization"
    ]
  },
  {
    id: 'mob',
    icon: <Smartphone size={40} className="text-orange-500" />,
    title: "Mobile Solutions",
    description: "Native and cross-platform mobile apps providing seamless experiences.",
    longDescription: "Reach your customers wherever they are with our mobile development services. We build native iOS/Android apps and cross-platform solutions using React Native and Flutter for a seamless user experience.",
    features: [
        "iOS & Android Native Apps",
        "Cross-Platform (Flutter/React Native)",
        "Mobile UI/UX Design",
        "App Store Optimization",
        "Offline Capabilities"
    ]
  },
  {
    id: 'cloud',
    icon: <Cloud size={40} className="text-sky-500" />,
    title: "Cloud Infrastructure",
    description: "Scalable AWS/Azure/GCP architecture setup, serverless deployment, and DevOps.",
    longDescription: "Scale effortlessly with our cloud infrastructure services. We design resilient cloud architectures on AWS, Azure, and Google Cloud, utilizing serverless technologies and containerization for maximum efficiency.",
    features: [
        "Cloud Migration Strategy",
        "Serverless Architecture",
        "Kubernetes & Docker orchestration",
        "CI/CD Pipeline Automation",
        "Cost Optimization"
    ]
  },
  {
    id: 'data',
    icon: <Database size={40} className="text-red-500" />,
    title: "Big Data",
    description: "Data warehousing, ETL pipeline construction, and real-time analytics dashboards.",
    longDescription: "Unlock the value of your data. Our Big Data engineers build robust pipelines to ingest, process, and visualize massive datasets, giving you actionable insights in real-time.",
    features: [
        "Data Warehousing (Snowflake/BigQuery)",
        "ETL/ELT Pipelines",
        "Real-time Streaming Analytics",
        "Business Intelligence Dashboards",
        "Data Governance & Quality"
    ]
  }
];

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (selectedService) {
      return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => setSelectedService(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Services
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
                                <Zap className="text-yellow-300" /> Why Choose Nexus?
                            </h3>
                            <p className="text-blue-100">
                                We don't just write code; we architect solutions that drive growth. Our {selectedService.title} team consists of industry veterans dedicated to your success.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Key Capabilities</h3>
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
          <h2 className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide text-sm mb-2">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Engineering Excellence
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We combine creativity with technical prowess to deliver solutions that scale.
          </p>
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
                  View Details <span className="ml-2">&rarr;</span>
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
