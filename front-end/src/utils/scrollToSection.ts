export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
}
