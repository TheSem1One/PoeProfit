import React from 'react';
import { SummaryStats } from '../types';
import { TrendingDown, TrendingUp, BarChart3, Clock } from 'lucide-react';
import { PoECornerBracket, PoESeparator } from './PoEOrnaments';

interface SummaryDashboardProps {
  stats: SummaryStats;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ stats }) => {
  const isDivine = stats.displayCurrency === 'divine';

  const formatNumber = (num: number, decimals = 2) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getStatusClass = () => {
    if (stats.status === 'PROFIT') return 'profit';
    if (stats.status === 'LOSS') return 'loss';
    return 'neutral';
  };

  const getColorClass = () => {
    if (stats.status === 'PROFIT') return 'color-profit';
    if (stats.status === 'LOSS') return 'color-loss';
    return 'color-neutral';
  };

  // Values based on chosen currency
  const expVal = isDivine ? stats.totalExpensesDivine : stats.totalExpensesChaos;
  const expAlt = isDivine ? stats.totalExpensesChaos : stats.totalExpensesDivine;

  const profVal = isDivine ? stats.totalProfitDivine : stats.totalProfitChaos;
  const profAlt = isDivine ? stats.totalProfitChaos : stats.totalProfitDivine;

  const netVal = isDivine ? stats.netProfitDivine : stats.netProfitChaos;
  const netAlt = isDivine ? stats.netProfitChaos : stats.netProfitDivine;

  const curTag = isDivine ? 'div' : 'c';
  const altTag = isDivine ? 'c' : 'div';
  const primaryDecimals = isDivine ? 2 : 1;
  const altDecimals = isDivine ? 1 : 2;

  return (
    <section className="summary-card poe-panel-with-corners">
      {/* Corner filigree */}
      <PoECornerBracket position="tl" />
      <PoECornerBracket position="tr" />
      <PoECornerBracket position="bl" />
      <PoECornerBracket position="br" />

      <div className="summary-header">
        <div className="summary-title">
          <BarChart3 size={16} stroke="#d4a75e" />
          Financial Summary ({isDivine ? 'Divine Orbs' : 'Chaos Orbs'})
        </div>
        <div style={{ fontFamily: 'var(--font-poe)', fontSize: '11px', color: 'var(--poe-text-dim)', letterSpacing: '2px', fontVariant: 'small-caps' }}>
          Rate: 1 div = {stats.divineRate} c
        </div>
      </div>

      <PoESeparator style={{ margin: '10px 0 16px' }} />

      <div className="summary-grid">
        {/* Total Expenses */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Total Expenses</span>
            <TrendingDown size={14} color="#f04438" />
          </div>
          <div className="metric-value">
            {formatNumber(expVal, primaryDecimals)}{' '}
            <span className={isDivine ? 'currency-div-tag' : 'currency-chaos-tag'}>{curTag}</span>
          </div>
          <div className="metric-sub">
            ≈ {formatNumber(expAlt, altDecimals)} {altTag}
          </div>
        </div>

        {/* Total Profit */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Total Profit</span>
            <TrendingUp size={14} color="#38e07a" />
          </div>
          <div className="metric-value">
            {formatNumber(profVal, primaryDecimals)}{' '}
            <span className={isDivine ? 'currency-div-tag' : 'currency-chaos-tag'}>{curTag}</span>
          </div>
          <div className="metric-sub">
            ≈ {formatNumber(profAlt, altDecimals)} {altTag}
          </div>
        </div>

        {/* Net Profit */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Net Profit</span>
            <span style={{ fontSize: '10.5px', opacity: 0.6 }}>Profit - Exp</span>
          </div>
          <div className={`metric-value ${getColorClass()}`}>
            {netVal > 0 ? '+' : ''}
            {formatNumber(netVal, primaryDecimals)}{' '}
            <span className={isDivine ? 'currency-div-tag' : 'currency-chaos-tag'}>{curTag}</span>
          </div>
          <div className="metric-sub">
            ≈ {netAlt > 0 ? '+' : ''}{formatNumber(netAlt, altDecimals)} {altTag}
          </div>
        </div>

        {/* ROI */}
        <div className="metric-box">
          <div className="metric-label">
            <span>ROI (%)</span>
            <span style={{ fontSize: '10.5px', opacity: 0.6 }}>(Net / Exp) * 100</span>
          </div>
          <div className={`metric-value ${getColorClass()}`}>
            {stats.roiDisplay}
          </div>
          <div className="metric-sub">Рентабельність сетапу</div>
        </div>

        {/* Status */}
        <div className="metric-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="metric-label">
            <span>Session Status</span>
            <Clock size={13} color="#caa058" />
          </div>
          <div className={`status-badge ${getStatusClass()}`}>
            {stats.status}
          </div>
          <div className="metric-sub" style={{ textAlign: 'center' }}>Результат фарм-сесії</div>
        </div>
      </div>
    </section>
  );
};
