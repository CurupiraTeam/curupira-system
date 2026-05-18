import type { LucideIcon } from 'lucide-react';

interface PreferenceToggleCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
  active: boolean;
  onToggle: () => void;
}

export function PreferenceToggleCard({ icon: Icon, title, text, active, onToggle }: PreferenceToggleCardProps) {
  return (
    <article className="rounded-[2.5rem] border border-emerald-100/60 bg-white/95 p-5 shadow-xl shadow-slate-200/30 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Icon size={22} aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative h-7 w-12 rounded-full transition focus:outline-none focus:ring-4 focus:ring-emerald-300 ${active ? 'bg-emerald-600' : 'bg-slate-200'}`}
          aria-label={`Alternar ${title}`}
          aria-pressed={active}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${active ? 'left-6' : 'left-1'}`} />
        </button>
      </div>
      <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
