
import React, { useState, useRef, useEffect } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { Message } from '../types';
import { Send, Sparkles, Loader2, BrainCircuit } from 'lucide-react';

const SmartAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Aura AI. I can solve word problems, explain calculus, or help with unit conversions. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await solveMathProblem(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 px-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 flex items-center gap-2">
          <BrainCircuit size={14} /> Math Assistant
        </h3>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[90%] p-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'}
            `}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                  <Sparkles size={10} /> Aura AI
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-400" size={16} />
              <span className="text-xs text-white/40 font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a word problem..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-white/20 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-white disabled:text-white/10 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default SmartAssistant;
