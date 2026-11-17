import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { PoECornerBracket, PoEEmblemIcon } from './PoEOrnaments';

interface HeaderProps {
  isSavedActive: boolean;
  onExport: () => void;
  onImport: (file: File) => void;
  onClearAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSavedActive,
  onExport,
  onImport,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header className="header-card poe-panel-with-corners">
      {/* Ornate corner filigree */}
      <PoECornerBracket position="tl" />
      <PoECornerBracket position="tr" />
      <PoECornerBracket position="bl" />
      <PoECornerBracket position="br" />

      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="header-content">
        <div className="brand-group">
          <div className="brand-icon-wrapper" title="Path of Exile 1 Ledger">
            <PoEEmblemIcon />
          </div>
          <div className="brand-titles">
            <h1>PoE 1 Profit Calculator</h1>
            <p>Wraeclast Economic Ledger &amp; Farming Analytics</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Live Saved status pill */}
          <div className={`save-indicator ${isSavedActive ? 'active' : ''}`}>
            <span className="dot"></span>
            <span>Saved</span>
          </div>

          <button className="btn" onClick={onExport} title="Експортувати дані у файл JSON">
            <Download size={14} />
            Export JSON
          </button>

          <button className="btn" onClick={() => fileInputRef.current?.click()} title="Імпортувати дані з файлу JSON">
            <Upload size={14} />
            Import JSON
          </button>

          <button className="btn btn-danger" onClick={onClearAll} title="Очистити всі таблиці">
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>
    </header>
  );
};
