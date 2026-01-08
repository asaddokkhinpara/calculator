
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equal';
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  className = ''
}) => {
  const baseStyles = "h-16 rounded-2xl text-xl font-medium transition-all duration-200 flex items-center justify-center btn-active";
  
  const variants = {
    number: "bg-white/5 hover:bg-white/10 text-white",
    operator: "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400",
    action: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400",
    equal: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
