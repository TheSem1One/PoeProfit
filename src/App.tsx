import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CalculatorState, ProfitItem, SummaryStats, CurrencyType } from './types';
import { STORAGE_KEY, DEFAULT_CALCULATOR_DATA, COMMON_POE_ITEMS } from './constants/poeItems';
import { Header } from './components/Header';
import { CurrencyBar } from './components/CurrencyBar';
import { SummaryDashboard } from './components/SummaryDashboard';
import { ItemTable } from './components/ItemTable';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import './styles/App.css';

export const App: React.FC = () => {
  // Load initial state from localStorage or default
  const [data, setData] = useState<CalculatorState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.expenses) && Array.isArray(parsed.profit)) {
          // Backward compatibility migration
          return {
            divinePriceInChaos: typeof parsed.divinePriceInChaos === 'number' && parsed.divinePriceInChaos > 0 
              ? parsed.divinePriceInChaos 
              : 150,
            displayCurrency: parsed.displayCurrency === 'divine' ? 'divine' : 'chaos',
            expenses: parsed.expenses.map((item: any) => ({
              ...item,
              currency: item.currency || (item.name && item.name.toLowerCase().includes('divine') ? 'divine' : 'chaos')
            })),
            profit: parsed.profit.map((item: any) => ({
              ...item,
              currency: item.currency || (item.name && item.name.toLowerCase().includes('divine') ? 'divine' : 'chaos')
            }))
          };
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return DEFAULT_CALCULATOR_DATA;
  });

  const [isSavedActive, setIsSavedActive] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const saveTimerRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  // Helper to trigger a toast
  const addToast = useCallback((text: string, isError = false) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, text, isError }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Save changes to localStorage and trigger "Saved" badge
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setIsSavedActive(true);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(() => {
        setIsSavedActive(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      addToast('Помилка збереження в localStorage', true);
    }
  }, [data, addToast]);

  // Unique ID generator
  const generateId = () => {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  };

  const parseSafeFloat = (val: number | string | undefined | null) => {
    if (val === '' || val === undefined || val === null) return 0;
    const parsed = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
  };

  const divineRate = data.divinePriceInChaos > 0 ? data.divinePriceInChaos : 150;

  // Calculate totals and financial metrics in both Chaos and Divine
  const { totalExpensesChaos, totalExpensesDivine, totalProfitChaos, totalProfitDivine, summaryStats } = useMemo(() => {
    let expChaos = 0;
    for (const item of data.expenses) {
      const qty = parseSafeFloat(item.quantity);
      const price = parseSafeFloat(item.price);
      const isDivine = item.currency === 'divine';
      expChaos += isDivine ? (qty * price * divineRate) : (qty * price);
    }

    let profChaos = 0;
    for (const item of data.profit) {
      const qty = parseSafeFloat(item.quantity);
      const price = parseSafeFloat(item.price);
      const isDivine = item.currency === 'divine';
      profChaos += isDivine ? (qty * price * divineRate) : (qty * price);
    }

    const expDivine = divineRate > 0 ? expChaos / divineRate : 0;
    const profDivine = divineRate > 0 ? profChaos / divineRate : 0;

    const netChaos = profChaos - expChaos;
    const netDivine = profDivine - expDivine;

    let roi = 0;
    let roiDisplay = '0.00%';
    if (expChaos > 0) {
      roi = (netChaos / expChaos) * 100;
      roiDisplay = `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;
    } else if (expChaos === 0 && profChaos > 0) {
      roiDisplay = '+100.00%';
    }

    let status: SummaryStats['status'] = 'BREAK EVEN';
    if (netChaos > 0.0001) status = 'PROFIT';
    else if (netChaos < -0.0001) status = 'LOSS';

    const stats: SummaryStats = {
      totalExpensesChaos: expChaos,
      totalExpensesDivine: expDivine,
      totalProfitChaos: profChaos,
      totalProfitDivine: profDivine,
      netProfitChaos: netChaos,
      netProfitDivine: netDivine,
      roi,
      roiDisplay,
      status,
      displayCurrency: data.displayCurrency,
      divineRate
    };

    return {
      totalExpensesChaos: expChaos,
      totalExpensesDivine: expDivine,
      totalProfitChaos: profChaos,
      totalProfitDivine: profDivine,
      summaryStats: stats
    };
  }, [data, divineRate]);

  // Actions: Add Item
  const handleAddItem = (type: 'expenses' | 'profit') => {
    const newItem: ProfitItem = {
      id: generateId(),
      name: '',
      quantity: 1,
      price: 0,
      currency: 'chaos'
    };

    setData((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  // Actions: Delete Item
  const handleDeleteItem = (type: 'expenses' | 'profit', id: string) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id)
    }));
  };

  // Actions: Update Item field
  const handleUpdateItem = (
    type: 'expenses' | 'profit',
    id: string,
    field: 'name' | 'quantity' | 'price' | 'currency',
    value: any
  ) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  // Actions: Divine Rate Change
  const handleDivineRateChange = (rate: number) => {
    setData((prev) => ({ ...prev, divinePriceInChaos: rate }));
  };

  // Actions: Display Currency Switch
  const handleDisplayCurrencyChange = (currency: CurrencyType) => {
    setData((prev) => ({ ...prev, displayCurrency: currency }));
  };

  // Actions: Clear All
  const handleClearAll = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Очищення всіх даних',
      message: 'Ви впевнені, що хочете безповоротно видалити всі витрати та здобутий прибуток?',
      onConfirm: () => {
        setData((prev) => ({ ...prev, expenses: [], profit: [] }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Усі дані успішно очищено');
      }
    });
  };

  // Actions: Export JSON
  const handleExportJson = () => {
    try {
      const exportObject = {
        version: '2.0',
        engine: 'Vite + React + TypeScript',
        exportedAt: new Date().toISOString(),
        data
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `poe_profit_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('Дані успішно експортовано у файл JSON');
    } catch (err) {
      console.error(err);
      addToast('Помилка під час експорту JSON', true);
    }
  };

  // Actions: Import JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        let importedData = parsed.data || parsed;

        if (Array.isArray(importedData.expenses) && Array.isArray(importedData.profit)) {
          setData({
            divinePriceInChaos: typeof importedData.divinePriceInChaos === 'number' && importedData.divinePriceInChaos > 0
              ? importedData.divinePriceInChaos
              : 150,
            displayCurrency: importedData.displayCurrency === 'divine' ? 'divine' : 'chaos',
            expenses: importedData.expenses.map((item: any) => ({
              id: item.id || generateId(),
              name: String(item.name || ''),
              quantity: item.quantity !== undefined ? item.quantity : 0,
              price: item.price !== undefined ? item.price : 0,
              currency: item.currency || (item.name && item.name.toLowerCase().includes('divine') ? 'divine' : 'chaos')
            })),
            profit: importedData.profit.map((item: any) => ({
              id: item.id || generateId(),
              name: String(item.name || ''),
              quantity: item.quantity !== undefined ? item.quantity : 0,
              price: item.price !== undefined ? item.price : 0,
              currency: item.currency || (item.name && item.name.toLowerCase().includes('divine') ? 'divine' : 'chaos')
            }))
          });
          addToast('Резервну копію успішно відновлено!');
        } else {
          addToast('Невірний формат файлу JSON', true);
        }
      } catch (err) {
        console.error('Import error:', err);
        addToast('Помилка читання JSON файлу', true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      {/* Autocomplete datalist */}
      <datalist id="poe-common-items">
        {COMMON_POE_ITEMS.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      {/* Header */}
      <Header
        isSavedActive={isSavedActive}
        onExport={handleExportJson}
        onImport={handleImportJson}
        onClearAll={handleClearAll}
      />

      {/* Currency Exchange Rate Bar & Display Selector */}
      <CurrencyBar
        divineRate={divineRate}
        onDivineRateChange={handleDivineRateChange}
        displayCurrency={data.displayCurrency}
        onDisplayCurrencyChange={handleDisplayCurrencyChange}
      />

      {/* Summary Dashboard */}
      <SummaryDashboard stats={summaryStats} />

      {/* Main Two-Column Layout */}
      <div className="tables-layout">
        {/* Expenses Table */}
        <ItemTable
          type="expenses"
          title="Expenses (Витрати)"
          items={data.expenses}
          totalChaos={totalExpensesChaos}
          totalDivine={totalExpensesDivine}
          displayCurrency={data.displayCurrency}
          divineRate={divineRate}
          onAddItem={() => handleAddItem('expenses')}
          onDeleteItem={(id) => handleDeleteItem('expenses', id)}
          onUpdateItem={(id, field, value) => handleUpdateItem('expenses', id, field, value)}
        />

        {/* Profit Table */}
        <ItemTable
          type="profit"
          title="Profit (Прибуток)"
          items={data.profit}
          totalChaos={totalProfitChaos}
          totalDivine={totalProfitDivine}
          displayCurrency={data.displayCurrency}
          divineRate={divineRate}
          onAddItem={() => handleAddItem('profit')}
          onDeleteItem={(id) => handleDeleteItem('profit', id)}
          onUpdateItem={(id, field, value) => handleUpdateItem('profit', id, field, value)}
        />
      </div>

      {/* Footer */}
      <footer>
        Path of Exile is a registered trademark of Grinding Gear Games. Powered by Vite &amp; React.
      </footer>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default App;
