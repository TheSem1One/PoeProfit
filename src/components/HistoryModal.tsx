import React, { useState } from 'react';
import { SavedSession, CurrencyType } from '../types';
import { PoECornerBracket, PoESeparator } from './PoEOrnaments';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  X,
  Layers,
  Coins,
  Gem
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  history: SavedSession[];
  onClose: () => void;
  onRestoreSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAllHistory: () => void;
  displayCurrency: CurrencyType;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onRestoreSession,
  onDeleteSession,
  onClearAllHistory,
  displayCurrency
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const isDivine = displayCurrency === 'divine';

  const formatNumber = (num: number, decimals = 2) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Cumulative Lifetime Analytics across all sessions
  const lifetimeStats = history.reduce(
    (acc, session) => {
      acc.totalExpensesChaos += session.summary.totalExpensesChaos || 0;
      acc.totalExpensesDivine += session.summary.totalExpensesDivine || 0;
      acc.totalProfitChaos += session.summary.totalProfitChaos || 0;
      acc.totalProfitDivine += session.summary.totalProfitDivine || 0;
      acc.netProfitChaos += session.summary.netProfitChaos || 0;
      acc.netProfitDivine += session.summary.netProfitDivine || 0;
      if (session.summary.status === 'PROFIT') acc.profitableSessions += 1;
      return acc;
    },
    {
      totalExpensesChaos: 0,
      totalExpensesDivine: 0,
      totalProfitChaos: 0,
      totalProfitDivine: 0,
      netProfitChaos: 0,
      netProfitDivine: 0,
      profitableSessions: 0
    }
  );

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div 
        className="modal-box history-modal-box poe-panel-with-corners" 
        onClick={(e) => e.stopPropagation()}
      >
        <PoECornerBracket position="tl" />
        <PoECornerBracket position="tr" />
        <PoECornerBracket position="bl" />
        <PoECornerBracket position="br" />

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <History size={18} color="#d4a75e" />
            <span>Історія сесій та Загальна статистика ({history.length})</span>
          </div>
          <button type="button" className="btn-delete" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '0 24px' }}>
          <PoESeparator style={{ margin: '8px 0 14px' }} />
        </div>

        {/* Modal Body with Scroll */}
        <div className="history-modal-body">
          {/* Lifetime Global Overview Cards */}
          {history.length > 0 && (
            <div className="lifetime-summary-panel">
              <div className="lifetime-header">
                <Layers size={14} color="#ffd885" />
                <span>Загальна статистика за весь час (Lifetime Wealth):</span>
              </div>
              <div className="lifetime-grid">
                <div className="lifetime-box">
                  <div className="lifetime-label">Збережено сесій</div>
                  <div className="lifetime-value">{history.length}</div>
                  <div className="lifetime-sub">{lifetimeStats.profitableSessions} у плюсі</div>
                </div>

                <div className="lifetime-box">
                  <div className="lifetime-label">Всього витрачено</div>
                  <div className="lifetime-value">
                    {isDivine 
                      ? `${formatNumber(lifetimeStats.totalExpensesDivine, 2)} div`
                      : `${formatNumber(lifetimeStats.totalExpensesChaos, 0)} c`}
                  </div>
                  <div className="lifetime-sub">
                    {isDivine
                      ? `≈ ${formatNumber(lifetimeStats.totalExpensesChaos, 0)} c`
                      : `≈ ${formatNumber(lifetimeStats.totalExpensesDivine, 2)} div`}
                  </div>
                </div>

                <div className="lifetime-box">
                  <div className="lifetime-label">Всього здобуто</div>
                  <div className="lifetime-value" style={{ color: '#5aff9f' }}>
                    {isDivine 
                      ? `${formatNumber(lifetimeStats.totalProfitDivine, 2)} div`
                      : `${formatNumber(lifetimeStats.totalProfitChaos, 0)} c`}
                  </div>
                  <div className="lifetime-sub">
                    {isDivine
                      ? `≈ ${formatNumber(lifetimeStats.totalProfitChaos, 0)} c`
                      : `≈ ${formatNumber(lifetimeStats.totalProfitDivine, 2)} div`}
                  </div>
                </div>

                <div className="lifetime-box">
                  <div className="lifetime-label">Чистий прибуток</div>
                  <div 
                    className="lifetime-value" 
                    style={{ color: lifetimeStats.netProfitChaos >= 0 ? '#5aff9f' : '#ff756b' }}
                  >
                    {lifetimeStats.netProfitChaos > 0 ? '+' : ''}
                    {isDivine 
                      ? `${formatNumber(lifetimeStats.netProfitDivine, 2)} div`
                      : `${formatNumber(lifetimeStats.netProfitChaos, 0)} c`}
                  </div>
                  <div className="lifetime-sub">
                    {isDivine
                      ? `≈ ${formatNumber(lifetimeStats.netProfitChaos, 0)} c`
                      : `≈ ${formatNumber(lifetimeStats.netProfitDivine, 2)} div`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search bar & Action */}
          {history.length > 0 && (
            <div className="history-search-row">
              <input
                type="text"
                className="input-field history-search-input"
                placeholder="Пошук сесії за назвою чи стратегією..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-danger btn-sm"
                onClick={onClearAllHistory}
                title="Очистити всю історію"
              >
                <Trash2 size={12} />
                Очистити історію
              </button>
            </div>
          )}

          {/* Sessions List */}
          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              <History size={36} />
              <div>{history.length === 0 ? 'Історія сесій порожня' : 'Нічого не знайдено за вашим запитом'}</div>
              <div style={{ fontSize: '11px', marginTop: '6px', color: 'var(--poe-text-dim)', textTransform: 'none' }}>
                {history.length === 0 
                  ? 'Зробіть підрахунок та натисніть «Зберегти сесію», щоб записати прибуток в історію.'
                  : 'Спробуйте іншу назву для пошуку.'}
              </div>
            </div>
          ) : (
            <div className="sessions-list">
              {filteredHistory.map((session) => {
                const isExpanded = expandedId === session.id;
                const netChaos = session.summary.netProfitChaos;
                const netDivine = session.summary.netProfitDivine;
                const isProfitable = netChaos > 0.0001;
                const isLoss = netChaos < -0.0001;

                const primaryNet = isDivine ? netDivine : netChaos;
                const altNet = isDivine ? netChaos : netDivine;
                const curTag = isDivine ? 'div' : 'c';
                const altTag = isDivine ? 'c' : 'div';

                return (
                  <div 
                    key={session.id} 
                    className={`session-card poe-panel-with-corners ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div className="session-card-header" onClick={() => toggleExpand(session.id)}>
                      {/* Left: Title & date */}
                      <div className="session-card-main">
                        <div className="session-title-row">
                          <span className="session-card-title">{session.title}</span>
                          <span className="session-date-badge">
                            {new Date(session.createdAt).toLocaleDateString('uk-UA', { 
                              day: '2-digit', 
                              month: '2-digit',
                              year: 'numeric'
                            })} {new Date(session.createdAt).toLocaleTimeString('uk-UA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="session-meta-row">
                          <span>Витрати: {formatNumber(isDivine ? session.summary.totalExpensesDivine : session.summary.totalExpensesChaos, isDivine ? 2 : 0)} {curTag}</span>
                          <span>•</span>
                          <span>Видобуток: {formatNumber(isDivine ? session.summary.totalProfitDivine : session.summary.totalProfitChaos, isDivine ? 2 : 0)} {curTag}</span>
                          <span>•</span>
                          <span>ROI: <strong style={{ color: isProfitable ? '#5aff9f' : isLoss ? '#ff756b' : '#d4a75e' }}>{session.summary.roiDisplay}</strong></span>
                        </div>
                      </div>

                      {/* Right: Net profit badge & buttons */}
                      <div className="session-card-right" onClick={(e) => e.stopPropagation()}>
                        <div className={`session-net-badge ${isProfitable ? 'profit' : isLoss ? 'loss' : 'neutral'}`}>
                          <div className="net-main-val">
                            {primaryNet > 0 ? '+' : ''}{formatNumber(primaryNet, isDivine ? 2 : 0)} {curTag}
                          </div>
                          <div className="net-alt-val">
                            ≈ {altNet > 0 ? '+' : ''}{formatNumber(altNet, isDivine ? 0 : 2)} {altTag}
                          </div>
                        </div>

                        <div className="session-actions-group">
                          <button
                            type="button"
                            className="btn btn-gold btn-sm"
                            onClick={() => onRestoreSession(session)}
                            title="Завантажити цю сесію в калькулятор"
                          >
                            <RotateCcw size={12} />
                            Завантажити
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => onDeleteSession(session.id)}
                            title="Видалити сесію"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => toggleExpand(session.id)}
                            style={{ padding: '5px 8px' }}
                            title="Розгорнути детальну статистику"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail View: Full Breakdown of Expenses and Profit */}
                    {isExpanded && (
                      <div className="session-detail-view">
                        <div className="session-detail-rate-bar">
                          <span>Фіксований курс сесії: 1 Divine = {session.divineRate} Chaos</span>
                          <span>Всього предметів: {session.expenses.length} витрат, {session.profit.length} дропу</span>
                        </div>

                        <div className="session-detail-tables">
                          {/* Expenses Detail */}
                          <div className="detail-sub-table">
                            <div className="detail-table-title" style={{ color: '#e54b4b' }}>
                              <TrendingDown size={14} />
                              Всі витрати ({session.expenses.length}):
                            </div>
                            {session.expenses.length === 0 ? (
                              <div className="empty-sub-text">Немає витрат</div>
                            ) : (
                              <table className="poe-table detail-poe-table">
                                <thead>
                                  <tr>
                                    <th>Предмет</th>
                                    <th className="col-num">К-сть</th>
                                    <th className="col-num">Ціна</th>
                                    <th className="col-num">Сума</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {session.expenses.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>{item.name || '—'}</td>
                                      <td className="col-num">{item.quantity}</td>
                                      <td className="col-num">{item.price} {item.currency === 'divine' ? 'div' : 'c'}</td>
                                      <td className="col-num row-total" style={{ fontSize: '13px' }}>
                                        {formatNumber(Number(item.quantity) * Number(item.price), item.currency === 'divine' ? 2 : 1)} {item.currency === 'divine' ? 'div' : 'c'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>

                          {/* Profit Detail */}
                          <div className="detail-sub-table">
                            <div className="detail-table-title" style={{ color: '#38e07a' }}>
                              <TrendingUp size={14} />
                              Весь здобуток ({session.profit.length}):
                            </div>
                            {session.profit.length === 0 ? (
                              <div className="empty-sub-text">Немає дропу</div>
                            ) : (
                              <table className="poe-table detail-poe-table">
                                <thead>
                                  <tr>
                                    <th>Предмет</th>
                                    <th className="col-num">К-сть</th>
                                    <th className="col-num">Ціна</th>
                                    <th className="col-num">Сума</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {session.profit.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>{item.name || '—'}</td>
                                      <td className="col-num">{item.quantity}</td>
                                      <td className="col-num">{item.price} {item.currency === 'divine' ? 'div' : 'c'}</td>
                                      <td className="col-num row-total" style={{ fontSize: '13px' }}>
                                        {formatNumber(Number(item.quantity) * Number(item.price), item.currency === 'divine' ? 2 : 1)} {item.currency === 'divine' ? 'div' : 'c'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
