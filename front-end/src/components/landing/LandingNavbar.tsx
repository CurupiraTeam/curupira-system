import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { landingNavItems, landingRoutes, landingSectionIds } from '../../constants/landingContent';
import { scrollToSection } from '../../utils/scrollToSection';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-slate-950/88 text-white shadow-lg backdrop-blur-xl">
      <nav className="mx-auto grid max-w-7xl gap-3 px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <button
          type="button"
          onClick={() => scrollToSection(landingSectionIds.principal)}
          className="inline-flex items-center gap-3 justify-self-start rounded-2xl px-1 py-1 text-left focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-label="Voltar para a seção Principal"
        >
          <span className="rounded-2xl bg-emerald-500 p-2 text-slate-950 shadow-lg">
            <Leaf size={24} aria-hidden="true" />
          </span>
          <span>
            <strong className="block text-lg font-black leading-none">Curupira</strong>
            <span className="hidden text-xs font-semibold text-emerald-200 sm:block">Monitoramento Inteligente do Ar</span>
          </span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/10 p-1">
          {landingNavItems.map((item) => (
            <button
              key={item.targetId}
              type="button"
              onClick={() => scrollToSection(item.targetId)}
              className="rounded-full px-4 py-2 text-xs font-black text-slate-100 transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>

        <Link
          to={landingRoutes.login}
          className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 md:justify-self-end"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
