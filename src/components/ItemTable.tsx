import React from 'react';
import { ProfitItem } from '../types';
import { Plus, X, Inbox } from 'lucide-react';
import { PoECornerBracket } from './PoEOrnaments';

interface ItemTableProps {
  type: 'expenses' | 'profit';
  title: string;
  items: ProfitItem[];
  total: number;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, field: 'name' | 'quantity' | 'price', value: string | number) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  type,
  title,
  items,
  total,
  onAddItem,
  onDeleteItem,
  onUpdateItem
}) => {
  const formatNumber = (num: number) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
              <th style={{ minWidth: '170px' }}>Item Name</th>
              <th className="col-num" style={{ width: '100px' }}>Quantity</th>
              <th className="col-num" style={{ width: '120px' }}>Price / Item</th>
              <th className="col-num" style={{ width: '120px' }}>Total</th>
              <th className="col-act"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const qty = parseSafeFloat(item.quantity);
              const price = parseSafeFloat(item.price);
              const rowTotal = qty * price;

              return (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      className="input-field"
                      list="poe-common-items"
                      placeholder="e.g. Scarab of Divinity, Map..."
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                    />
                  </td>
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
                  <td>
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
                  </td>
                  <td className="row-total">{formatNumber(rowTotal)}</td>
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

      <div className="table-footer">
        <span className="total-summary-label">
          {isExpenses ? 'Total Expenses' : 'Total Profit'}
        </span>
        <span className="total-summary-value">{formatNumber(total)}</span>
      </div>
    </section>
  );
};
