import { Mail, Phone, Sprout } from 'lucide-react';
import { contactContent, landingSectionIds } from '../../constants/landingContent';

export function ContactFooter() {
  return (
    <footer id={landingSectionIds.contato} tabIndex={-1} className="scroll-mt-24 bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-400 p-2 text-slate-950">
              <Sprout size={24} aria-hidden="true" />
            </span>
            <strong className="text-2xl font-black">{contactContent.brand}</strong>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{contactContent.closingMessage}</p>
        </div>

        <address className="grid gap-3 not-italic">
          <a
            href={`mailto:${contactContent.email}`}
            className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-100 transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            aria-label={`Enviar email para ${contactContent.email}`}
          >
            <Mail size={18} aria-hidden="true" />
            {contactContent.email}
          </a>
          <a
            href="tel:+5592999999999"
            className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-100 transition hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            aria-label={`Ligar para ${contactContent.phone}`}
          >
            <Phone size={18} aria-hidden="true" />
            {contactContent.phone}
          </a>
        </address>
      </div>
    </footer>
  );
}
