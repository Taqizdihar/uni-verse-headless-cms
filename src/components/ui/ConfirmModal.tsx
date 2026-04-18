import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  onConfirm,
  onClose,
  variant = 'primary'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:bg-zinc-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-zinc-900 mb-2">{title}</h3>
          <p className="text-zinc-500 leading-relaxed mb-8">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                isDanger 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                  : 'bg-zinc-900 hover:bg-black shadow-zinc-900/20'
              }`}
              style={!isDanger ? { backgroundColor: 'var(--primary, #18181b)', color: 'var(--secondary, #fbbf24)' } : {}}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
