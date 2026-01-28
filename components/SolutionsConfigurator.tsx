

import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, ConfiguratorItemResult } from '../types';
import { getConfiguratorItems } from '../services/supabaseMock';
import * as Icons from 'lucide-react';
import { Check, Loader2, Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';

interface SolutionsConfiguratorProps {
  lang: Language;
  onRequestQuote: (selectedItems: any[]) => void;
}

const SolutionsConfigurator: React.FC<SolutionsConfiguratorProps> = ({ lang, onRequestQuote }) => {
  // Configurator Grid State
  const [items, setItems] = useState<ConfiguratorItemResult[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  
  // Fetch items on mount
  useEffect(() => {
      const fetchItems = async () => {
          setLoadingItems(true);
          const data = await getConfiguratorItems();
          // Transform simple items to result items (with selected state)
          // Filter visible items
          const resultItems: ConfiguratorItemResult[] = data
              .filter(item => item.visible)
              .map(item => ({
                  ...item,
                  level: 'optional',
                  selected: false
              }));
          setItems(resultItems);
          setLoadingItems(false);
      };
      fetchItems();
  }, []);


  const toggleItemSelection = (id: string) => {
      setItems(prev => prev.map(item => 
          item.id === id ? { ...item, selected: !item.selected } : item
      ));
  };

  const getSelectedItems = () => items.filter(r => r.selected);
  const selectedCount = getSelectedItems().length;

  // --- HANDLER ---
  const handleTransferToForm = () => {
      const selected = getSelectedItems();
      // Notify Parent / User to scroll to form and prefill
      onRequestQuote(selected);
      // Reset selection option:
      // setItems(prev => prev.map(i => ({...i, selected: false})));
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-gray-200 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
             <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                 <ShoppingCart size={16} />
                 <span>Catálogo de Productos y Servicios</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                {TRANSLATIONS.configuratorTitle[lang]}
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed">
                {TRANSLATIONS.configuratorSubtitle[lang]}
            </p>
        </div>

        {loadingItems ? (
             <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-primary-600" size={48} />
             </div>
        ) : (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 
                 {/* GRID OF ITEMS */}
                 <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {items.map(item => {
                         // @ts-ignore
                         const Icon = Icons[item.icon] || Sparkles;
                         return (
                             <div 
                                 key={item.id} 
                                 onClick={() => toggleItemSelection(item.id)}
                                 className={`cursor-pointer group relative p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md flex flex-col gap-4 ${item.selected ? 'border-primary-500 bg-white shadow-md ring-1 ring-primary-500' : 'border-gray-200 bg-white hover:border-primary-300'}`}
                             >
                                 <div className="flex justify-between items-start">
                                     <div className={`p-3 rounded-xl transition-colors ${item.selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                         <Icon size={24} />
                                     </div>
                                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.selected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                         {item.selected && <Check size={14} className="text-white" />}
                                     </div>
                                 </div>
                                 
                                 <div>
                                     <h5 className="font-bold text-gray-900 text-lg mb-1">{item.title[lang]}</h5>
                                     <p className="text-sm text-gray-500">{item.benefit[lang]}</p>
                                 </div>
                             </div>
                         );
                     })}
                 </div>

                 {/* STICKY SIDEBAR SUMMARY */}
                 <div className="lg:col-span-1">
                     <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 sticky top-24">
                         <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                             <ShoppingCart className="text-primary-400" /> Resumen
                         </h4>
                         
                         <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                             {selectedCount === 0 && <p className="text-gray-400 text-sm italic">Selecciona los servicios que deseas añadir a tu paquete.</p>}
                             {getSelectedItems().map(item => (
                                 <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 animate-fade-in">
                                     <span>{item.title[lang]}</span>
                                     <Check size={14} className="text-green-400" />
                                 </div>
                             ))}
                         </div>

                         <div className="bg-slate-800 p-4 rounded-lg mb-6">
                             <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Servicios seleccionados</p>
                             <div className="flex items-center gap-2 text-white font-bold text-2xl">
                                 {selectedCount}
                             </div>
                         </div>

                         <button
                             onClick={handleTransferToForm}
                             disabled={selectedCount === 0}
                             className={`w-full py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${selectedCount > 0 ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-primary-600/30' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                         >
                             {TRANSLATIONS.configuratorCta[lang]}
                             {selectedCount > 0 && <ArrowRight size={18} />}
                         </button>
                     </div>
                 </div>
             </div>
        )}
      </div>
    </section>
  );
};

export default SolutionsConfigurator;
