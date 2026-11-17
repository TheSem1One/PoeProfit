import React, { useState, useEffect } from 'react';
import { PoECornerBracket, PoESeparator } from './PoEOrnaments';
import { BookmarkPlus } from 'lucide-react';

interface SaveSessionModalProps {
  isOpen: boolean;
  onSave: (title: string) => void;
  onCancel: () => void;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
  isOpen,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
      const timeStr = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      setTitle(`Фарм-сесія (${dateStr} ${timeStr})`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal-box poe-panel-with-corners" onClick={(e) => e.stopPropagation()}>
        <PoECornerBracket position="tl" />
        <PoECornerBracket position="tr" />
        <PoECornerBracket position="bl" />
        <PoECornerBracket position="br" />

        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookmarkPlus size={16} color="#d4a75e" />
            Зберегти сесію в історію
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <PoESeparator style={{ margin: '8px 0 4px' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--poe-text-normal)' }}>
              Вкажіть назву або стратегію для збереження поточного прибутку та витрат:
            </p>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. T17 Ziggurat Ambush (10 maps), Sanctum run..."
              autoFocus
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onCancel}>
              Скасувати
            </button>
            <button type="submit" className="btn btn-gold">
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
