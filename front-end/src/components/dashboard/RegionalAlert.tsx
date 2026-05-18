import { AlertTriangle } from 'lucide-react';

export function RegionalAlert({ message }: { message: string }) {
  return (
    <div className="rounded-3xl bg-emerald-400 p-4 text-slate-950">
      <p className="flex items-center gap-2 text-sm font-black">
        <AlertTriangle size={18} aria-hidden="true" /> Atenção para sua região
      </p>
      <p className="mt-2 text-sm font-semibold leading-6">{message}</p>
    </div>
  );
}
