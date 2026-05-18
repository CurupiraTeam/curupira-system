import { AlertTriangle, CheckCircle2, Loader2, LogIn, PlugZap, Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

// Track which floating variants have been shown during this SPA session (resets on full reload)
const shownThisSession = new Set<string>();

type StateVariant = 'loading' | 'empty' | 'error' | 'unauthorized' | 'success' | 'disconnected' | 'partial';

const icons = {
  loading: Loader2,
  empty: Search,
  error: AlertTriangle,
  unauthorized: LogIn,
  success: CheckCircle2,
  disconnected: PlugZap,
  partial: AlertTriangle
};

interface StateViewProps {
  variant: StateVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function StateView({ variant, title, description, action, compact = false }: StateViewProps) {
  const Icon = icons[variant];
  const isLoading = variant === 'loading';

  return (
    <div
      className={`rounded-[2.5rem] border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-200/20 ${
        compact ? 'p-4' : 'p-6'
      }`}
      role={variant === 'error' || variant === 'unauthorized' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 border border-emerald-100">
          <Icon className={isLoading ? 'animate-spin' : undefined} size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black">{title}</h3>
          {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function LoadingState(props: Omit<StateViewProps, 'variant'>) {
  return <StateView {...props} variant="loading" />;
}

export function EmptyState(props: Omit<StateViewProps, 'variant'>) {
  return <StateView {...props} variant="empty" />;
}

export function ErrorState(props: Omit<StateViewProps, 'variant'>) {
  return <StateView {...props} variant="error" />;
}

export function UnauthorizedState(props: Omit<StateViewProps, 'variant'>) {
  return <FloatingState {...props} variant="unauthorized" />;
}

export function SuccessState(props: Omit<StateViewProps, 'variant'>) {
  return <StateView {...props} variant="success" />;
}

export function DisconnectedState(props: Omit<StateViewProps, 'variant'>) {
  return <StateView {...props} variant="disconnected" />;
}

export function PartialDataState(props: Omit<StateViewProps, 'variant'>) {
  return <FloatingState {...props} variant="partial" />;
}

function getFloatingRoot() {
  if (typeof document === 'undefined') return null;
  let root = document.getElementById('floating-state-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'floating-state-root';
    root.className = 'fixed right-4 top-4 z-50 flex flex-col gap-3 items-end';
    document.body.appendChild(root);
  }
  return root;
}

function FloatingState({ title, description, action, compact = false, variant, durationMs, }: Omit<StateViewProps, 'variant'> & { variant: StateVariant; durationMs?: number }) {
  const [visible, setVisible] = useState(true);
  const shouldShow = !shownThisSession.has(variant);
  const duration = durationMs ?? 3000;
  const elRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    if (typeof document === 'undefined') return;
    const root = getFloatingRoot();
    const el = document.createElement('div');
    el.className = 'w-full max-w-xs pr-2 sm:pr-0';
    elRef.current = el;
    root?.appendChild(el);
    setMounted(true);
    // mark as shown for this SPA session so it won't appear on other pages during navigation
    try {
      shownThisSession.add(variant);
    } catch {}
    return () => {
      try {
        if (elRef.current && root?.contains(elRef.current)) root.removeChild(elRef.current);
      } catch {}
    };
  }, [shouldShow, variant]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  useEffect(() => {
    if (!visible && elRef.current) {
      const root = getFloatingRoot();
      try {
        if (root && elRef.current && root.contains(elRef.current)) root.removeChild(elRef.current);
      } catch {}
      elRef.current = null;
      setMounted(false);
    }
  }, [visible]);

  if (!mounted || !elRef.current || !visible) return null;

  const content = (
    <div className="relative">
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 z-10 inline-flex items-center justify-center rounded-full bg-slate-100/90 p-1.5 text-slate-600 hover:text-slate-950 shadow border border-slate-200/50 backdrop-blur hover:bg-slate-200"
      >
        <X size={16} aria-hidden="true" />
      </button>
      <div className="pointer-events-auto">
        <StateView variant={variant} title={title} description={description} action={action} compact={compact} />
      </div>
    </div>
  );

  return createPortal(content, elRef.current);
}
