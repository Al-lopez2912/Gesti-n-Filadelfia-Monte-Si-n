import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-800">
          {getIcon()}
          <span className="font-medium">{toast.message}</span>
        </div>
        <button
          onClick={clearToast}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
