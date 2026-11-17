import React from 'react';
import { CurrencyType } from '../types';
import { ArrowLeftRight, Coins, Gem } from 'lucide-react';
import { PoECornerBracket } from './PoEOrnaments';

interface CurrencyBarProps {
  divineRate: number;
  onDivineRateChange: (rate: number) => void;
  displayCurrency: CurrencyType;
  onDisplayCurrencyChange: (currency: CurrencyType) => void;
}

export const CurrencyBar: React.FC<CurrencyBarProps> = ({
  divineRate,
  onDivineRateChange,
  displayCurrency,
  onDisplayCurrencyChange
}) => {
  return (
    <div className="currency-bar-card poe-panel-with-corners">
      <PoECornerBracket position="tl" />
      <PoECornerBracket position="tr" />
      <PoECornerBracket position="bl" />
      <PoECornerBracket position="br" />

      {/* Left: Divine to Chaos Exchange Rate */}
      <div className="currency-rate-section">
        <div className="currency-rate-label">
          <ArrowLeftRight size={15} color="#d4a75e" />
          <span>Курс валюти (Exchange Rate):</span>
        </div>
        <div className="currency-rate-input-wrap">
          <span className="rate-badge divine-badge">
            <Gem size={13} />
            1 Divine =
          </span>
          <input
            type="number"
            step="any"
            min="1"
            className="input-field input-number rate-input"
            value={divineRate || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onDivineRateChange(isNaN(val) || val <= 0 ? 1 : val);
            }}
            placeholder="150"
            title="Скільки Chaos Orbs коштує 1 Divine Orb"
          />
          <span className="rate-badge chaos-badge">
            <Coins size={13} />
            Chaos (c)
          </span>
        </div>
      </div>

      {/* Right: Display Currency Switcher */}
      <div className="currency-display-section">
        <span className="display-label">Відображати підсумок у:</span>
        <div className="currency-toggle-group">
          <button
            type="button"
            className={`currency-toggle-btn ${displayCurrency === 'chaos' ? 'active chaos-active' : ''}`}
            onClick={() => onDisplayCurrencyChange('chaos')}
          >
            <Coins size={14} />
            Chaos Orb (c)
          </button>
          <button
            type="button"
            className={`currency-toggle-btn ${displayCurrency === 'divine' ? 'active divine-active' : ''}`}
            onClick={() => onDisplayCurrencyChange('divine')}
          >
            <Gem size={14} />
            Divine Orb (div)
          </button>
        </div>
      </div>
    </div>
  );
};
