export type CurrencyType = 'chaos' | 'divine';

export interface ProfitItem {
  id: string;
  name: string;
  quantity: number | '';
  price: number | '';
  currency: CurrencyType;
}

export interface CalculatorState {
  expenses: ProfitItem[];
  profit: ProfitItem[];
  divinePriceInChaos: number;
  displayCurrency: CurrencyType;
}

export type SessionStatus = 'PROFIT' | 'LOSS' | 'BREAK EVEN';

export interface SummaryStats {
  totalExpensesChaos: number;
  totalProfitChaos: number;
  netProfitChaos: number;
  
  totalExpensesDivine: number;
  totalProfitDivine: number;
  netProfitDivine: number;

  roi: number;
  roiDisplay: string;
  status: SessionStatus;
  
  displayCurrency: CurrencyType;
  divineRate: number;
}
