import { GraduationCap, UsersRound } from 'lucide-react';
import { aboutContent, landingSectionIds } from '../../constants/landingContent';
import { teamMembers } from '../../constants/teamMembers';

export function AboutSection() {
  return (
    <section id={landingSectionIds.sobreNos} tabIndex={-1} className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Sobre nós</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{aboutContent.title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">{aboutContent.description}</p>
          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
            <GraduationCap size={28} className="text-emerald-300" aria-hidden="true" />
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Desenvolvido por estudantes de Engenharia de Software, o projeto une tecnologia, responsabilidade social e participação comunitária para tornar informações ambientais mais acessíveis.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <UsersRound size={24} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-950">Equipe do projeto</h3>
              <p className="text-sm text-slate-600">Participantes responsáveis pela construção acadêmica do Curupira.</p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {teamMembers.map((name) => (
              <li key={name} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-700 shadow-sm ring-1 ring-slate-200">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
