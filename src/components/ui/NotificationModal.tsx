import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
}

export function NotificationModal({
  isOpen,
  title,
  message,
  type = 'success',
  onClose
}: NotificationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50';
      case 'warning':
        return 'bg-amber-50';
      case 'info':
        return 'bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${getBgColor()}`}>
              {getIcon()}
            </div>
          </div>

          <h3 className="text-xl font-bold text-zinc-900 mb-2">{title}</h3>
          <p className="text-zinc-500 leading-relaxed mb-8">{message}</p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3.5 rounded-2xl font-bold text-white bg-zinc-900 hover:bg-black shadow-lg shadow-zinc-900/20 transition-all active:scale-95"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
