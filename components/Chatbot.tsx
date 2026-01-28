import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Minimize2, RefreshCw } from 'lucide-react';
import { generateChatResponse, loadBotConfig } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface ChatbotProps {
  lang: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState('NEXI_tech');
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar configuració del bot i mostrar salutació inicial
  useEffect(() => {
    const initBot = async () => {
      try {
        const config = await loadBotConfig();
        if (config?.name) {
          setBotName(config.name);
        }
      } catch (err) {
        console.warn('Could not load bot config:', err);
      }
    };
    initBot();
  }, []);

  // Salutació inicial quan s'obre el xat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings: Record<Language, string> = {
        es: `👋 ¡Hola! Soy ${botName}, el asistente virtual de EportsTech. ¿En qué puedo ayudarte hoy?`,
        ca: `👋 Hola! Sóc ${botName}, l'assistent virtual d'EportsTech. En què et puc ajudar avui?`,
        en: `👋 Hello! I'm ${botName}, EportsTech's virtual assistant. How can I help you today?`,
        fr: `👋 Bonjour! Je suis ${botName}, l'assistant virtuel d'EportsTech. Comment puis-je vous aider aujourd'hui?`,
        de: `👋 Hallo! Ich bin ${botName}, der virtuelle Assistent von EportsTech. Wie kann ich Ihnen heute helfen?`,
        it: `👋 Ciao! Sono ${botName}, l'assistente virtuale di EportsTech. Come posso aiutarti oggi?`
      };

      setMessages([
        {
          id: 'greeting',
          role: 'model',
          text: greetings[lang] || greetings.es,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, lang, botName]);

  // Auto-scroll als nous missatges
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus a l'input quan s'obre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setHasError(false);

    try {
      // Preparar historial (excloure salutació inicial)
      const history = messages
        .filter(m => m.id !== 'greeting')
        .map(m => ({ role: m.role, text: m.text }));
      
      const response = await generateChatResponse(history, userMsg.text, lang);
      const botMessage = response.message; // Extreure el missatge de l'objecte

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
      
      const errorMessages: Record<Language, string> = {
        es: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o contacta con nosotros directamente.',
        ca: 'Ho sento, hi ha hagut un error. Si us plau, torna a intentar-ho o contacta amb nosaltres directament.',
        en: 'Sorry, an error occurred. Please try again or contact us directly.',
        fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.',
        de: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
        it: 'Mi dispiace, si è verificato un errore. Riprova o contattaci direttamente.'
      };

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorMessages[lang] || errorMessages.es,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setHasError(false);
  };

  // Placeholders per idioma
  const placeholders: Record<Language, string> = {
    es: 'Escribe tu consulta...',
    ca: 'Escriu la teva consulta...',
    en: 'Type your question...',
    fr: 'Écrivez votre question...',
    de: 'Schreiben Sie Ihre Frage...',
    it: 'Scrivi la tua domanda...'
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-primary-600 hover:bg-primary-700'
        } text-white`}
        aria-label={isOpen ? 'Tancar xat' : 'Obrir xat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm">{botName}</h4>
                <p className="text-xs text-primary-200">EportsTech Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                className="text-primary-200 hover:text-white p-1 rounded transition-colors"
                title="Nova conversa"
              >
                <RefreshCw size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-primary-200 hover:text-white p-1 rounded transition-colors"
                title="Minimitzar"
              >
                <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-md shadow-md' 
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                  }`}
                >
                  {/* Renderitzar missatges amb salts de línia */}
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary-600" />
                  <span className="text-xs text-gray-500">
                    {lang === 'ca' ? 'Pensant...' : 
                     lang === 'en' ? 'Thinking...' : 
                     lang === 'fr' ? 'Réflexion...' : 
                     lang === 'de' ? 'Denken...' : 
                     lang === 'it' ? 'Pensando...' : 
                     'Pensando...'}
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholders[lang] || placeholders.es}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="text-primary-600 hover:text-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors p-1"
                aria-label="Enviar"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 text-center py-1.5 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">
              Powered by Google Gemini AI • 
              <a href="mailto:contact@eportstech.com" className="hover:text-primary-600 ml-1">
                contact@eportstech.com
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Animació CSS */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
