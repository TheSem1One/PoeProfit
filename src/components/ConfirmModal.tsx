import React from 'react';
import { PoECornerBracket, PoESeparator } from './PoEOrnaments';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal-box poe-panel-with-corners" onClick={(e) => e.stopPropagation()}>
        <PoECornerBracket position="tl" />
        <PoECornerBracket position="tr" />
        <PoECornerBracket position="bl" />
        <PoECornerBracket position="br" />

        <div className="modal-header">
          <div className="modal-title">{title}</div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <PoESeparator style={{ margin: '8px 0 4px' }} />
        </div>

        <div className="modal-body">{message}</div>

        <div className="modal-footer">
          <button className="btn" onClick={onCancel}>
            Скасувати
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Підтвердити
          </button>
        </div>
      </div>
    </div>
  );
};
