import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateProjectConsultation } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';

const AIConsultant: React.FC = () => {
  const { t } = useI18n();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t('ai_consultant.welcome'),
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateProjectConsultation(userMsg.text, history);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
      <div className="max-w-4xl w-full flex-grow flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[80vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-slow">
                    <Sparkles className="text-white animate-spin-slow" size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">{t('ai_consultant.title')}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('ai_consultant.subtitle')}</p>
                </div>
            </div>
                <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-2 animate-glow">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {t('ai_consultant.status.online')}
                </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 ${
                            msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 hover:shadow-lg ${
                            msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none hover:bg-blue-700' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start animate-fade-in">
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center animate-bounce-subtle">
                            <Bot size={16} className="text-slate-500" />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-blue-500" />
                            <span className="text-xs text-slate-500">{t('ai_consultant.thinking')}</span>
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce animation-delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce animation-delay-200"></span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="relative flex items-center group">
              <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('ai_consultant.placeholder')}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-14 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-22 text-sm text-slate-900 dark:text-white scrollbar-hide transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/10"
              />
              <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label={t('ai_consultant.send')}
              title={t('ai_consultant.send')}
              className="absolute right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
              <Send size={16} />
              </button>
            </div>
                  <p className="text-center text-xs text-slate-400 mt-2">{t('ai_consultant.caution')}</p>
        </div>

      </div>
    </div>
  );
};

export default AIConsultant;