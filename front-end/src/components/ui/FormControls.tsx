import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({ className, light, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { light?: boolean }) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60',
        light
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-200'
          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        className
      )}
    />
  );
}

export function FieldError({ message, light }: { message?: string; light?: boolean }) {
  if (!message) return null;
  return <p className={clsx('mt-2 text-sm font-semibold', light ? 'text-red-600' : 'text-red-300')}>{message}</p>;
}

interface FieldWrapperProps {
  label: string;
  error?: string;
  light?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, error, light, children }: FieldWrapperProps) {
  return (
    <label className="block">
      <span className={clsx('text-sm font-black', light ? 'text-slate-700' : 'text-slate-100')}>{label}</span>
      <div className="mt-2">{children}</div>
      <FieldError message={error} light={light} />
    </label>
  );
}

export function TextInput({ light, ...props }: InputHTMLAttributes<HTMLInputElement> & { light?: boolean }) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-2xl border outline-none px-4 py-3 text-sm transition',
        light
          ? 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
          : 'border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus:border-emerald-300',
        props.className
      )}
    />
  );
}

export function TextArea({ light, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { light?: boolean }) {
  return (
    <textarea
      {...props}
      className={clsx(
        'min-h-28 w-full resize-none rounded-2xl border outline-none p-4 text-sm transition',
        light
          ? 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
          : 'border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus:border-emerald-300',
        props.className
      )}
    />
  );
}

export function SelectField({ light, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { light?: boolean }) {
  return (
    <select
      {...props}
      className={clsx(
        'w-full rounded-2xl border outline-none px-4 py-3 text-sm transition',
        light
          ? 'border-slate-200 bg-white text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
          : 'border-white/10 bg-slate-900 text-white focus:border-emerald-300',
        props.className
      )}
    />
  );
}

export function FormSection({ title, light, children }: { title: string; light?: boolean; children: ReactNode }) {
  return (
    <section className={clsx('rounded-3xl border p-4', light ? 'border-emerald-100 bg-emerald-50/20' : 'border-white/10 bg-white/5')}>
      <h4 className={clsx('text-sm font-black uppercase tracking-[0.16em]', light ? 'text-emerald-800' : 'text-emerald-300')}>{title}</h4>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}
