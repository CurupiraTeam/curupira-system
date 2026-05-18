export const responsiveTargets = {
  mobile: '320px-767px',
  notebook: '1366x768',
  desktop: '1920x1080'
} as const;

export const responsiveValidationNotes = {
  mobile: 'Cards em coluna única, ações visíveis e formulário com envio sempre alcançável.',
  notebook: 'Alturas compactas e grids de duas colunas para evitar scroll vertical desnecessário em 1366x768.',
  desktop: 'Conteúdo com largura máxima para não ficar excessivamente espalhado em 1920x1080.'
} as const;
