import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import type { AirMetric } from '../types';
import { fadeUp } from '../hooks/useScrollReveal';

interface MetricCardProps {
  metric: AirMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const percentage = Math.min((metric.value / metric.safeLimit) * 100, 140);
  const isAboveLimit = metric.value > metric.safeLimit;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.01 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {metric.value}<span className="text-base font-bold text-slate-500"> {metric.unit}</span>
          </strong>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Activity size={22} />
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full rounded-full ${isAboveLimit ? 'bg-orange-500' : 'bg-emerald-500'}`}
        />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">
        Limite recomendado: {metric.safeLimit} {metric.unit}
      </p>
    </motion.article>
  );
}
