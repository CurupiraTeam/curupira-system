import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { feedbackOptions } from '../data/mockData';

export function FeedbackPanel() {
  const [selected, setSelected] = useState(feedbackOptions[0]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit() {
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 2800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-glow"
    >
      <div className="mb-6">
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          Sensor humano
        </span>
        <h3 className="mt-4 text-2xl font-black">Reporte a qualidade do ar agora</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Seu relato ajuda o Curupira a cruzar percepção local com dados oficiais e detectar incidentes mais rápido.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {feedbackOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
              selected === option
                ? 'border-emerald-300 bg-emerald-400 text-slate-950'
                : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Descreva o que você está sentindo ou vendo na sua região..."
        className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-emerald-300"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
      >
        <Send size={18} /> Enviar relato
      </button>

      {sent && <p className="mt-3 text-center text-sm font-semibold text-emerald-300">Relato registrado com sucesso.</p>}
    </motion.div>
  );
}
