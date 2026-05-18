import { motion } from 'framer-motion';
import { fadeUp } from '../hooks/useScrollReveal';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{description}</p>
    </motion.div>
  );
}
