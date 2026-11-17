import React from 'react';
import { SummaryStats } from '../types';
import { TrendingDown, TrendingUp, BarChart3, Clock } from 'lucide-react';
import { PoECornerBracket, PoESeparator } from './PoEOrnaments';

interface SummaryDashboardProps {
  stats: SummaryStats;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
          Financial Summary
        </div>
        <div style={{ fontFamily: 'var(--font-poe)', fontSize: '11px', color: 'var(--poe-text-dim)', letterSpacing: '2px', fontVariant: 'small-caps' }}>
          Auto-Calculated
        </div>
      </div>

      {/* Classic PoE Tooltip Ornate Separator */}
      <PoESeparator style={{ margin: '10px 0 16px' }} />

      <div className="summary-grid">
        {/* Total Expenses */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Total Expenses</span>
            <TrendingDown size={14} color="#f04438" />
          </div>
          <div className="metric-value">{formatNumber(stats.totalExpenses)}</div>
          <div className="metric-sub">Сума всіх витрат на карти та сетап</div>
        </div>

        {/* Total Profit */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Total Profit</span>
            <TrendingUp size={14} color="#38e07a" />
          </div>
          <div className="metric-value">{formatNumber(stats.totalProfit)}</div>
          <div className="metric-sub">Загальний валовий видобуток</div>
        </div>

        {/* Net Profit */}
        <div className="metric-box">
          <div className="metric-label">
            <span>Net Profit</span>
            <span style={{ fontSize: '10.5px', opacity: 0.6 }}>Profit - Exp</span>
          </div>
          <div className={`metric-value ${getColorClass()}`}>
            {stats.netProfit > 0 ? '+' : ''}{formatNumber(stats.netProfit)}
          </div>
          <div className="metric-sub">Чистий фінансовий підсумок</div>
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
          <div className="metric-sub">Рентабельність вкладень</div>
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
          <div className="metric-sub" style={{ textAlign: 'center' }}>Результат фарм-стратегії</div>
        </div>
      </div>
    </section>
  );
};
