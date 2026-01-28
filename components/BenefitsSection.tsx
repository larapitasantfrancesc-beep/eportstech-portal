

import React from 'react';
import { Layers, Zap, Users, TrendingUp } from 'lucide-react';
import { Language, BenefitsConfig } from '../types';
import { TRANSLATIONS } from '../constants';

interface BenefitsSectionProps {
  lang: Language;
  config?: BenefitsConfig; // Optional to prevent breaking if not loaded yet
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ lang, config }) => {
  // Use config if available, otherwise fallback to constants
  const title = config?.mainTitle?.[lang] || TRANSLATIONS.benefitsTitle[lang];
  const subtitle = config?.subtitle?.[lang] || TRANSLATIONS.benefitsSubtitle[lang];
  
  const benefits = [
    {
      icon: Layers,
      title: config?.items?.[0]?.title?.[lang] || TRANSLATIONS.ben1Title[lang],
      desc: config?.items?.[0]?.description?.[lang] || TRANSLATIONS.ben1Desc[lang]
    },
    {
      icon: Users,
      title: config?.items?.[1]?.title?.[lang] || TRANSLATIONS.ben2Title[lang],
      desc: config?.items?.[1]?.description?.[lang] || TRANSLATIONS.ben2Desc[lang]
    },
    {
      icon: Zap,
      title: config?.items?.[2]?.title?.[lang] || TRANSLATIONS.ben3Title[lang],
      desc: config?.items?.[2]?.description?.[lang] || TRANSLATIONS.ben3Desc[lang]
    },
    {
      icon: TrendingUp,
      title: config?.items?.[3]?.title?.[lang] || TRANSLATIONS.ben4Title[lang],
      desc: config?.items?.[3]?.description?.[lang] || TRANSLATIONS.ben4Desc[lang]
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-gray-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
             EportsTech Value
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-6">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
