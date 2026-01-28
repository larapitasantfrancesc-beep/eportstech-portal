

import React, { useState, useEffect } from 'react';
import { SERVICES_DATA, TRANSLATIONS } from '../constants';
import { getServices } from '../services/supabaseMock';
import { Language, Service } from '../types';
import * as Icons from 'lucide-react';
import { X, Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
  onServiceRequest?: (service: Service) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ lang, onServiceRequest }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dynamicServices, setDynamicServices] = useState<Service[]>(SERVICES_DATA);

  // Sync with mock DB to ensure any updates from Admin Panel are reflected
  useEffect(() => {
    const fetchServices = async () => {
        const srvs = await getServices();
        setDynamicServices(srvs);
    };
    fetchServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleContactClick = () => {
    if (selectedService && onServiceRequest) {
        onServiceRequest(selectedService);
    }
    closeModal();
  };

  // Only show visible services
  const visibleServices = dynamicServices.filter(s => s.visible);

  return (
    <section id="services" className="py-24 bg-white relative scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Expertise</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {TRANSLATIONS.servicesTitle[lang]}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Soluciones integrales adaptadas a las necesidades de la empresa moderna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleServices.map((service) => {
            // Dynamically render icon
            // @ts-ignore
            const IconComponent = Icons[service.icon];

            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceClick(service)}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 cursor-pointer"
              >
                <div className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-600 ring-4 ring-white group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {IconComponent && <IconComponent size={24} />}
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    <span className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {service.title[lang]}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {service.description[lang]}
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                   <Icons.Plus size={20} />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SERVICE DETAIL MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="bg-primary-50 p-8 border-b border-primary-100 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-white text-primary-600 rounded-xl shadow-sm">
                             {/* @ts-ignore */}
                            {Icons[selectedService.icon] && React.createElement(Icons[selectedService.icon], { size: 32 })}
                        </div>
                        <div>
                             <h3 className="text-2xl font-bold text-gray-900">{selectedService.title[lang]}</h3>
                             <p className="text-primary-600 font-medium capitalize">{selectedService.category.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Descripción Detallada</h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {selectedService.extendedDescription?.[lang] || selectedService.description[lang]}
                        </p>
                    </div>

                    {selectedService.features?.[lang] && (
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Características Clave</h4>
                             <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {selectedService.features[lang].map((feature, idx) => (
                                     <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                                         <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                         <span>{feature}</span>
                                     </li>
                                 ))}
                             </ul>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button 
                            onClick={closeModal}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                        <button 
                            onClick={handleContactClick}
                            className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center gap-2"
                        >
                            Solicitar Información <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
