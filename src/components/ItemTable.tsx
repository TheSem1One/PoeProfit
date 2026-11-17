import React from 'react';
import { ProfitItem, CurrencyType } from '../types';
import { Plus, X, Inbox } from 'lucide-react';
import { PoECornerBracket } from './PoEOrnaments';

interface ItemTableProps {
  type: 'expenses' | 'profit';
  title: string;
  items: ProfitItem[];
  totalChaos: number;
  totalDivine: number;
  displayCurrency: CurrencyType;
  divineRate: number;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, field: 'name' | 'quantity' | 'price' | 'currency', value: any) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  type,
  title,
  items,
  totalChaos,
  totalDivine,
  displayCurrency,
  divineRate,
  onAddItem,
  onDeleteItem,
  onUpdateItem
}) => {
  const formatNumber = (num: number, decimals = 2) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const parseSafeFloat = (val: number | string | undefined | null) => {
    if (val === '' || val === undefined || val === null) return 0;
    const parsed = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
  };

  const isExpenses = type === 'expenses';

  return (
    <section className={`table-panel poe-panel-with-corners ${isExpenses ? 'panel-expenses' : 'panel-profit'}`}>
      <PoECornerBracket position="tl" />
      <PoECornerBracket position="tr" />
      <PoECornerBracket position="bl" />
      <PoECornerBracket position="br" />

      <div className="panel-header">
        <div className="panel-title">
          <span style={{ fontSize: '13px', color: isExpenses ? '#e54b4b' : '#38e07a' }}>
            {isExpenses ? '⚔' : '💰'}
          </span>
          {title}
          <span className="badge">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button className="btn btn-gold btn-sm" onClick={onAddItem}>
          <Plus size={12} strokeWidth={2.5} />
          Add Item
        </button>
      </div>

      <div className="table-responsive">
        <table className="poe-table">
          <thead>
            <tr>
              <th style={{ minWidth: '160px' }}>Item Name</th>
              <th className="col-num" style={{ width: '85px' }}>Qty</th>
              <th className="col-num" style={{ width: '150px' }}>Price / Item</th>
              <th className="col-num" style={{ width: '130px' }}>Total</th>
              <th className="col-act"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const qty = parseSafeFloat(item.quantity);
              const price = parseSafeFloat(item.price);
              const isItemDivine = item.currency === 'divine';
              const rawTotal = qty * price;
              
              // Total in chaos and divine
              const totalInChaos = isItemDivine ? rawTotal * divineRate : rawTotal;
              const totalInDivine = isItemDivine ? rawTotal : (divineRate > 0 ? rawTotal / divineRate : 0);

              return (
                <tr key={item.id}>
                  {/* Name */}
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      list="poe-common-items"
                      placeholder="e.g. Scarab, Map, Divine..."
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                    />
                  </td>

                  {/* Quantity */}
                  <td>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="input-field input-number"
                      placeholder="0"
                      value={item.quantity === '' ? '' : item.quantity}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                        onUpdateItem(item.id, 'quantity', val);
                      }}
                    />
                  </td>

                  {/* Price with Currency Selector */}
                  <td>
                    <div className="price-input-group">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        className="input-field input-number"
                        placeholder="0.00"
                        value={item.price === '' ? '' : item.price}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          onUpdateItem(item.id, 'price', val);
                        }}
                      />
                      <select
                        className={`currency-select-inline ${isItemDivine ? 'currency-div-selected' : 'currency-chaos-selected'}`}
                        value={item.currency || 'chaos'}
                        onChange={(e) => onUpdateItem(item.id, 'currency', e.target.value as CurrencyType)}
                        title="Виберіть валюту (Chaos / Divine)"
                      >
                        <option value="chaos">c</option>
                        <option value="divine">div</option>
                      </select>
                    </div>
                  </td>

                  {/* Row Total */}
                  <td className="row-total">
                    <div>
                      {formatNumber(rawTotal, isItemDivine ? 2 : 1)}{' '}
                      <span className={isItemDivine ? 'currency-div-tag' : 'currency-chaos-tag'}>
                        {isItemDivine ? 'div' : 'c'}
                      </span>
                    </div>
                    {/* Secondary equivalent if divine/chaos differs */}
                    <div className="row-total-sub">
                      {isItemDivine
                        ? `≈ ${formatNumber(totalInChaos, 0)} c`
                        : `≈ ${formatNumber(totalInDivine, 2)} div`}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-delete"
                      title="Видалити предмет"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="empty-state">
            <Inbox size={32} />
            <div>{isExpenses ? 'Немає доданих витрат' : 'Немає доданого видобутку'}</div>
            <div style={{ fontSize: '11px', marginTop: '6px', color: 'var(--poe-text-dim)', textTransform: 'none' }}>
              {isExpenses
                ? 'Натисніть «Add Item», щоб внести скарабеї, карти або фрагменти'
                : 'Натисніть «Add Item», щоб внести здобуті Divine Orbs або інший лут'}
            </div>
          </div>
        )}
      </div>

      {/* Table Footer with Selected & Alternate Currencies */}
      <div className="table-footer">
        <span className="total-summary-label">
          {isExpenses ? 'Total Expenses' : 'Total Profit'}
        </span>
        <div style={{ textAlign: 'right' }}>
          <div className="total-summary-value">
            {displayCurrency === 'divine' ? (
              <>
                {formatNumber(totalDivine, 2)} <span className="currency-div-tag">div</span>
              </>
            ) : (
              <>
                {formatNumber(totalChaos, 1)} <span className="currency-chaos-tag">c</span>
              </>
            )}
          </div>
          <div className="total-summary-secondary">
            {displayCurrency === 'divine'
              ? `≈ ${formatNumber(totalChaos, 1)} Chaos`
              : `≈ ${formatNumber(totalDivine, 2)} Divine`}
          </div>
        </div>
      </div>
    </section>
  );
};
