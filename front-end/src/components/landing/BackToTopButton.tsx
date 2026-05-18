import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { landingSectionIds } from '../../constants/landingContent';
import { scrollToSection } from '../../utils/scrollToSection';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 360);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToSection(landingSectionIds.principal)}
      className={`fixed bottom-5 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-950/20 transition focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-6 sm:right-6 ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      aria-label="Voltar para o topo da landing page"
    >
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
