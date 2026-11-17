export interface ProfitItem {
  id: string;
  name: string;
  quantity: number | '';
  price: number | '';
}

export interface CalculatorState {
  expenses: ProfitItem[];
  profit: ProfitItem[];
}

export type SessionStatus = 'PROFIT' | 'LOSS' | 'BREAK EVEN';

export interface SummaryStats {
  totalExpenses: number;
  totalProfit: number;
  netProfit: number;
  roi: number;
  roiDisplay: string;
  status: SessionStatus;
}
