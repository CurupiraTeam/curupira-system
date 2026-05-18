import { Activity, Flame, MapPinned, ShieldCheck, UsersRound } from 'lucide-react';
import { landingSectionIds, objectiveCards } from '../../constants/landingContent';

const icons = {
  activity: Activity,
  users: UsersRound,
  map: MapPinned,
  flame: Flame,
  shield: ShieldCheck
} as const;

export function ObjectiveSection() {
  return (
    <section id={landingSectionIds.objetivo} tabIndex={-1} className="scroll-mt-24 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Objetivo</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Informação ambiental clara onde o monitoramento ainda não chega</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Fumaça, queimadas e odores químicos afetam comunidades antes que os dados oficiais apareçam com clareza. Curupira aproxima dados ambientais e relatos de moradores para apoiar atenção pública e decisões locais.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {objectiveCards.map((card) => {
            const Icon = icons[card.icon];
            return (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{card.concept}</p>
                <h3 className="mt-2 text-xl font-black text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
