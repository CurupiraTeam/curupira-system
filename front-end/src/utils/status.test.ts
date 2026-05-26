import { describe, it, expect } from 'vitest';
import { getStatusByIqa, statusStyles, statusGradient } from './status';

/**
 * TESTE UNITÁRIO 1 (Frontend)
 * Mapeamento de IQA para status de qualidade do ar.
 */
describe('getStatusByIqa (unitário)', () => {
  it('retorna "Bom" para IQA abaixo de 45', () => {
    expect(getStatusByIqa(0)).toBe('Bom');
    expect(getStatusByIqa(44)).toBe('Bom');
  });

  it('retorna "Moderado" entre 45 e 64', () => {
    expect(getStatusByIqa(45)).toBe('Moderado');
    expect(getStatusByIqa(64)).toBe('Moderado');
  });

  it('retorna "Ruim" entre 65 e 84', () => {
    expect(getStatusByIqa(65)).toBe('Ruim');
    expect(getStatusByIqa(84)).toBe('Ruim');
  });

  it('retorna "Crítico" a partir de 85', () => {
    expect(getStatusByIqa(85)).toBe('Crítico');
    expect(getStatusByIqa(300)).toBe('Crítico');
  });

  it('possui estilo e gradiente definidos para todos os status', () => {
    (['Bom', 'Moderado', 'Ruim', 'Crítico'] as const).forEach((status) => {
      expect(statusStyles[status]).toBeTruthy();
      expect(statusGradient[status]).toBeTruthy();
    });
  });
});
