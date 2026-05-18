import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-6xl font-black text-slate-950">404</h1>
        <p className="mt-3 text-slate-600">Página não encontrada.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white">Voltar para HOME</Link>
      </div>
    </section>
  );
}
