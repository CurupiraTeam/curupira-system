import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, RadioTower, ShieldCheck } from 'lucide-react';
import { heroContent, landingRoutes, landingSectionIds } from '../../constants/landingContent';

export function HeroSection() {
  return (
    <section
      id={landingSectionIds.principal}
      tabIndex={-1}
      className="relative isolate flex min-h-[calc(100vh-76px)] scroll-mt-24 items-center overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.94), rgba(6, 78, 59, 0.78), rgba(2, 6, 23, 0.44)), url(${heroContent.imageUrl})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full bg-emerald-300 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
            Plataforma cidadã de monitoramento ambiental
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-emerald-50 sm:text-lg">
            {heroContent.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={landingRoutes.register}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              {heroContent.ctaLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-white/20 bg-slate-950/64 p-5 shadow-2xl backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: RadioTower, label: 'Dados ambientais', text: 'Leitura simples sobre qualidade do ar e sinais de risco.' },
            { icon: MapPin, label: 'Relatos no mapa', text: 'Ocorrências comunitárias com localização aproximada.' },
            { icon: ShieldCheck, label: 'Saúde pública', text: 'Informação para reduzir exposição a fumaça e odores.' }
          ].map(({ icon: Icon, label, text }) => (
            <article key={label} className="rounded-3xl bg-white/10 p-4">
              <Icon className="text-emerald-300" size={26} aria-hidden="true" />
              <h3 className="mt-4 text-lg font-black">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
