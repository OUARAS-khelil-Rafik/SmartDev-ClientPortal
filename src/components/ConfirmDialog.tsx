import React from 'react';
import { useI18n } from '../i18n';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, message, confirmLabel, cancelLabel, loading = false, onConfirm, onCancel, children }) => {
  const { t } = useI18n();

  if (!open) return null;

  const titleText = title || t('confirm.default_title');
  const messageText = message || '';
  const confirmText = confirmLabel || t('confirm.confirm_label');
  const cancelText = cancelLabel || t('confirm.cancel_label');
  const processingText = t('confirm.processing');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{titleText}</h3>
        {messageText && <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{messageText}</p>}
        {children}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{cancelText}</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">{loading ? processingText : confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
