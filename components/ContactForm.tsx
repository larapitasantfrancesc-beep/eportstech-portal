

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { LeadForm, Language } from '../types';
import { submitLead } from '../services/supabaseMock';
import { TRANSLATIONS, SERVICES_DATA, CATEGORY_INSIGHTS } from '../constants';
import { CheckCircle, AlertCircle, Loader2, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../services/analytics';
import { useUtmTracking } from '../hooks/useUtmTracking';

interface ContactFormProps {
  lang: Language;
  prefilledMessage?: string;
  prefilledService?: string;
  contactEmail: string;
  contactPhone: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ lang, prefilledMessage, prefilledService, contactEmail, contactPhone }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<LeadForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Hook per capturar UTMs de Google Ads i altres fonts
  const { getUtmData, isFromGoogleAds, campaignName } = useUtmTracking();

  // Watch service selection for dynamic insights
  const selectedService = useWatch({
      control,
      name: 'serviceInterest',
      defaultValue: prefilledService || 'General Inquiry'
  });

  // Watch for changes in prefilled props to update the form fields
  useEffect(() => {
    if (prefilledMessage) {
      setValue('message', prefilledMessage);
    }
    if (prefilledService) {
      setValue('serviceInterest', prefilledService);
    }
  }, [prefilledMessage, prefilledService, setValue]);

  const onSubmit = async (data: LeadForm) => {
    setIsSubmitting(true);
    try {
      // Passar UTMs juntament amb les dades del formulari
      const utmData = getUtmData();
      const result = await submitLead(data, utmData);
      
      if (result.success) {
        setSubmitStatus('success');
        
        // Track analytics event amb info de campanya
        trackEvent('form_submission', {
          form_name: 'contact_consultation',
          service_interest: data.serviceInterest,
          from_google_ads: isFromGoogleAds,
          campaign: campaignName || 'organic'
        });

        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (e) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic to determine which insights to show
  const getInsights = () => {
      // Handle special cases first
      if (selectedService === 'Custom Configuration') {
          const insights = CATEGORY_INSIGHTS['custom'];
          return {
              growth: insights.growth[lang] || insights.growth['en'],
              security: insights.security[lang] || insights.security['en']
          };
      }

      // 1. Find the service object that matches the selected English title
      const foundService = SERVICES_DATA.find(s => s.title.en === selectedService);
      
      // 2. Get the category or default
      const category = foundService ? foundService.category : 'default';

      // 3. Return insights for that category or default
      const insights = CATEGORY_INSIGHTS[category] || CATEGORY_INSIGHTS['default'];
      
      // 4. Return localized string, falling back to English if lang not found
      return {
          growth: insights.growth[lang] || insights.growth['en'],
          security: insights.security[lang] || insights.security['en']
      };
  };

  const dynamicInsights = getInsights();

  if (submitStatus === 'success') {
    return (
      <div id="contact" className="bg-green-50 rounded-2xl p-8 text-center border border-green-200 shadow-sm animate-fade-in max-w-4xl mx-auto my-16 scroll-mt-32">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-6">Thank you for contacting EportsTech. We will be in touch shortly.</p>
        <button 
          onClick={() => setSubmitStatus('idle')}
          className="text-green-700 underline hover:text-green-800 font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div id="contact" className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 scroll-mt-32">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Info & Insights Side */}
        <div className="bg-primary-900 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">{TRANSLATIONS.contactTitle[lang]}</h3>
            <p className="text-primary-200 mb-8 text-sm">
               Contacta con nuestros especialistas para diseñar el futuro tecnológico de tu empresa.
            </p>
            
            <div className="space-y-6 animate-fade-in">
                <h4 className="flex items-center gap-2 font-semibold text-white/90 uppercase tracking-wider text-xs border-b border-primary-700 pb-2">
                    <Lightbulb size={14} className="text-yellow-400" />
                    {TRANSLATIONS.insightTitle[lang]}
                </h4>
                
                <div className="bg-primary-800/50 p-4 rounded-lg border border-primary-700">
                    <div className="flex gap-3 mb-2">
                        <TrendingUp size={20} className="text-green-400 flex-shrink-0" />
                        <span className="text-sm font-semibold">Growth Impact</span>
                    </div>
                    <p className="text-xs text-primary-100 leading-relaxed">
                        {dynamicInsights.growth}
                    </p>
                </div>

                <div className="bg-primary-800/50 p-4 rounded-lg border border-primary-700">
                    <div className="flex gap-3 mb-2">
                        <ShieldCheck size={20} className="text-blue-400 flex-shrink-0" />
                        <span className="text-sm font-semibold">Risk & Security</span>
                    </div>
                    <p className="text-xs text-primary-100 leading-relaxed">
                        {dynamicInsights.security}
                    </p>
                </div>
            </div>
          </div>
          
          <div className="mt-10 relative z-10">
             <div className="flex flex-col gap-1 text-xs text-primary-300">
                 <span>{contactEmail}</span>
                 <span>{contactPhone}</span>
                 <span className="mt-2 text-primary-500 font-semibold">EACOM Group Member</span>
             </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>

        {/* Form Side */}
        <div className="p-10 md:w-3/5 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  {...register('fullName', { required: true })} 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                  placeholder="John Doe"
                />
                {errors.fullName && <span className="text-xs text-red-500">Required</span>}
               </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  {...register('phone', { required: true })} 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                  placeholder="+34 600..."
                />
                 {errors.phone && <span className="text-xs text-red-500">Required</span>}
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                placeholder="you@company.com"
              />
              {errors.email && <span className="text-xs text-red-500">Valid email required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input 
                {...register('company')} 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Interest</label>
              <select 
                {...register('serviceInterest')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Custom Configuration">Custom Solution Pack (Configurator)</option>
                {SERVICES_DATA.map(s => (
                  <option key={s.id} value={s.title.en}>{s.title[lang]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea 
                {...register('message')} 
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2 bg-gray-50"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : TRANSLATIONS.ctaButton[lang]}
            </button>

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle size={16} />
                <span className="text-sm">Something went wrong. Please try again.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
