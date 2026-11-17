import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  isError?: boolean;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.isError ? 'toast-error' : ''}`}>
          {toast.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
