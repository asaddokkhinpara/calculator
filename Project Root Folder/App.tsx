
import React, { useState, useCallback, useEffect } from 'react';
import { CalcState, HistoryItem } from './types';
import CalculatorButton from './components/CalculatorButton';
import HistoryPanel from './components/HistoryPanel';
import SmartAssistant from './components/SmartAssistant';
import { 
  Calculator as CalcIcon, 
  Settings, 
  Menu, 
  ChevronDown, 
  HelpCircle,
  Delete,
  X,
  // Added missing BrainCircuit import
  BrainCircuit
} from 'lucide-react';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'assistant'>('assistant');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateDisplay = (val: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const deleteLast = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  };

  const calculate = useCallback(() => {
    try {
      // Basic safety: replace common math symbols
      const sanitized = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      
      const result = Function(`'use strict'; return (${sanitized})`)().toString();
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: display,
        result: result,
        timestamp: Date.now()
      };

      setHistory(prev => [newItem, ...prev].slice(0, 50));
      setDisplay(result);
      setExpression(`${display} =`);
    } catch (e) {
      setDisplay('Error');
    }
  }, [display]);

  const handleKeypad = (val: string) => {
    if (val === '=') {
      calculate();
    } else if (val === 'C') {
      clear();
    } else if (val === '⌫') {
      deleteLast();
    } else {
      updateDisplay(val);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9\.\+\-\*\/]/.test(key)) {
        let val = key;
        if (key === '*') val = '×';
        if (key === '/') val = '÷';
        updateDisplay(val);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        deleteLast();
      } else if (key === 'Escape') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calculate]);

  const buttons = [
    { label: 'C', variant: 'action' as const },
    { label: '(', variant: 'operator' as const },
    { label: ')', variant: 'operator' as const },
    { label: '÷', variant: 'operator' as const },
    { label: '7', variant: 'number' as const },
    { label: '8', variant: 'number' as const },
    { label: '9', variant: 'number' as const },
    { label: '×', variant: 'operator' as const },
    { label: '4', variant: 'number' as const },
    { label: '5', variant: 'number' as const },
    { label: '6', variant: 'number' as const },
    { label: '-', variant: 'operator' as const },
    { label: '1', variant: 'number' as const },
    { label: '2', variant: 'number' as const },
    { label: '3', variant: 'number' as const },
    { label: '+', variant: 'operator' as const },
    { label: '0', variant: 'number' as const, className: 'col-span-1' },
    { label: '.', variant: 'number' as const },
    { label: '⌫', variant: 'action' as const },
    { label: '=', variant: 'equal' as const },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-black selection:bg-indigo-500/30">
      {/* App Header */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <CalcIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AuraCalc <span className="text-indigo-500">AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Scientific & Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <button 
            className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Traditional Calculator */}
        <section className="md:col-span-5 lg:col-span-4 glass rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
          {/* Top Display Area */}
          <div className="mb-6 px-2 text-right">
            <div className="h-6 text-indigo-400/60 text-sm mono truncate mb-1">
              {expression}
            </div>
            <div className="text-5xl font-bold mono truncate text-white tracking-tighter mb-4">
              {display}
            </div>
          </div>

          <hr className="border-white/5 mb-6" />

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, idx) => (
              <CalculatorButton 
                key={idx}
                label={btn.label}
                variant={btn.variant}
                className={btn.className}
                onClick={() => handleKeypad(btn.label)}
              />
            ))}
          </div>
        </section>

        {/* Right Side: Tools & Assistant */}
        <section className={`
          md:col-span-7 lg:col-span-8 glass rounded-[2.5rem] p-1 h-[600px] flex flex-col
          ${isMobileMenuOpen ? 'fixed inset-4 z-50 bg-black' : 'relative hidden md:flex'}
        `}>
          {/* Tab Switcher */}
          <div className="flex p-1.5 gap-1.5 bg-black/40 rounded-t-[2.4rem]">
            <button 
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'assistant' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white'}`}
            >
              <BrainCircuit size={16} /> Assistant
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white'}`}
            >
              <CalcIcon size={16} /> History
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-hidden">
            {activeTab === 'history' ? (
              <HistoryPanel 
                history={history} 
                onClear={() => setHistory([])}
                onSelect={(item) => {
                  setDisplay(item.result);
                  setExpression(item.expression + ' =');
                }}
              />
            ) : (
              <SmartAssistant />
            )}
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-white/20 text-xs">
        <p>© 2024 AuraCalc AI. Built with Gemini 3 Pro Reasoning.</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="flex items-center gap-1"><HelpCircle size={10} /> Math Solver</span>
          <span className="flex items-center gap-1"><BrainCircuit size={10} /> Natural Language</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
