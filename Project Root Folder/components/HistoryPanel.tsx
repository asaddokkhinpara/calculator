
import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, History as HistoryIcon } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 flex items-center gap-2">
          <HistoryIcon size={14} /> History
        </h3>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {history.length === 0 ? (
          <p className="text-center text-white/20 mt-10 text-sm italic">No recent calculations</p>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="glass p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <div className="text-white/50 text-xs mb-1 group-hover:text-indigo-400 transition-colors">
                {item.expression} =
              </div>
              <div className="text-white font-semibold truncate">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
