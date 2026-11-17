# 🗡️ Path of Exile 1 — Profit & Expense Calculator

Сучасний, швидкий та зручний калькулятор витрат і прибутку для Path of Exile 1, написаний на **Vite + React + TypeScript** у фірмовій готичній стилістиці PoE.

---

## 🚀 Як запустити

### Режим розробки (Development):
```bash
npm run dev
```
Сервер запуститься за адресою: [http://localhost:3000](http://localhost:3000)

### Збірка для продакшну (Production Build):
```bash
npm run build
```
Зібрані оптимізовані файли будуть знаходитися в папці `dist/`.

Для попереднього перегляду збірки:
```bash
npm run preview
```

---

## ⚡ Автономна версія без сервера (Standalone)
Якщо вам потрібна версія в одному HTML-файлі без Node.js та без запуску сервера:
- Просто двічі клікніть на [index.standalone.html](file:///C:/Users/oleh2/OneDrive/Робочий%20стіл/poe%20profit%20by%20theSem1One/index.standalone.html) і відкрийте його у будь-якому браузері!

---

## 💎 Функціонал
- **Таблиця Expenses (Витрати)**: додавання, видалення, live-перерахунок `Quantity * Price`, автосума.
- **Таблиця Profit (Прибуток)**: здобута валюта та лут, автосума.
- **Панель Summary**:
  - `Total Expenses`
  - `Total Profit`
  - `Net Profit` (динамічний зелений/червоний/золотий колір)
  - `ROI (%)`
  - Статус сесії: `PROFIT`, `LOSS`, `BREAK EVEN`
- **Автозбереження**: миттєве збереження кожного символу в `localStorage` (ключ `poe1-profit-calculator-data`) з індикатором **Saved**.
- **Резервні копії**:
  - **Export JSON**: створення бекапу даних
  - **Import JSON**: відновлення даних з бекапу
- **Clear All**: повне очищення з фірмовим вікном підтвердження.
- **Автодоповнення**: випадаючий список популярних валют і предметів PoE (Divines, Chaos, Scarabs, Maps, Fragments).
