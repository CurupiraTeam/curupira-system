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
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-3 pb-20 pt-16 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Fazer relato ambiental"
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-slate-950 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-300"
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
