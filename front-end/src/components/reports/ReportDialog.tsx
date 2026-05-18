import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SubmitReportForm } from './SubmitReportForm';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

export function ReportDialog({ open, onClose, onSuccess }: ReportDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Fazer relato ambiental"
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative w-full max-w-xl rounded-[2rem] bg-white shadow-2xl md:max-w-4xl my-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-800 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              aria-label="Fechar relato"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <SubmitReportForm onSuccess={onSuccess} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
