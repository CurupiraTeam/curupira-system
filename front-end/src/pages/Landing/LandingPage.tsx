import { AboutSection } from '../../components/landing/AboutSection';
import { BackToTopButton } from '../../components/landing/BackToTopButton';
import { ContactFooter } from '../../components/landing/ContactFooter';
import { HeroSection } from '../../components/landing/HeroSection';
import { LandingNavbar } from '../../components/landing/LandingNavbar';
import { ObjectiveSection } from '../../components/landing/ObjectiveSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ObjectiveSection />
        <AboutSection />
      </main>
      <ContactFooter />
      <BackToTopButton />
    </div>
  );
}
