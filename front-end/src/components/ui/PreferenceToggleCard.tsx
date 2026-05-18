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
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
          <Icon size={22} aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative h-7 w-12 rounded-full transition focus:outline-none focus:ring-4 focus:ring-emerald-300 ${active ? 'bg-emerald-600' : 'bg-slate-300'}`}
          aria-label={`Alternar ${title}`}
          aria-pressed={active}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${active ? 'left-6' : 'left-1'}`} />
        </button>
      </div>
      <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
