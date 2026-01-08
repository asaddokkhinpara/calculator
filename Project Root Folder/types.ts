
export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'math' | 'chart';
}

export enum CalcState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  ERROR = 'ERROR'
}
