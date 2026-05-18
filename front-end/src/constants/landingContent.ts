export const landingSectionIds = {
  principal: 'principal',
  objetivo: 'objetivo',
  sobreNos: 'sobre-nos',
  contato: 'contato'
} as const;

export const landingRoutes = {
  login: '/login',
  register: '/cadastro',
  landing: '/landing'
} as const;

export const landingNavItems = [
  { label: 'Objetivo', targetId: landingSectionIds.objetivo },
  { label: 'Sobre nós', targetId: landingSectionIds.sobreNos },
  { label: 'Contato', targetId: landingSectionIds.contato }
] as const;

export const heroContent = {
  title: 'Curupira: monitoramento inteligente do ar com participação cidadã',
  subtitle:
    'Uma plataforma para acompanhar a qualidade do ar, registrar fumaça, queimadas e odores químicos, e fortalecer decisões locais em defesa da saúde pública e do meio ambiente.',
  ctaLabel: 'Venha fazer parte desta missão',
  imageUrl:
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80'
} as const;

export const objectiveCards = [
  {
    icon: 'activity',
    title: 'Monitoramento do ar',
    concept: 'Air monitoring',
    description:
      'Reúne indicadores ambientais para ajudar comunidades a perceber mudanças na qualidade do ar antes que o problema fique invisível ou tarde demais.'
  },
  {
    icon: 'users',
    title: 'Ciência cidadã',
    concept: 'Citizen Science',
    description:
      'Transforma moradores em participantes ativos, permitindo que relatos locais complementem dados oficiais e ampliem a cobertura ambiental.'
  },
  {
    icon: 'map',
    title: 'Relatos georreferenciados',
    concept: 'Georeferenced reports',
    description:
      'Registra fumaça, queimadas, odores químicos e outros sinais de risco com localização aproximada para apoiar leitura regional.'
  },
  {
    icon: 'flame',
    title: 'Alertas de fumaça e queimadas',
    concept: 'Wildfire and smoke alerts',
    description:
      'Ajuda a visualizar padrões de crise ambiental causados por fumaça, focos de queimada e degradação da qualidade do ar.'
  },
  {
    icon: 'shield',
    title: 'Saúde e segurança ambiental',
    concept: 'Public health and environmental safety',
    description:
      'Apoia decisões locais, prevenção de exposição e consciência pública em regiões com pouca infraestrutura de monitoramento.'
  }
] as const;

export const aboutContent = {
  title: 'Sobre nós',
  description:
    'Curupira é um projeto acadêmico de Engenharia de Software voltado ao monitoramento ambiental, à participação cidadã e à democratização de informações sobre qualidade do ar.'
} as const;

export const contactContent = {
  brand: 'Curupira',
  email: 'contato@curupira.com',
  phone: '(92) 99999-9999',
  closingMessage:
    'Monitorar o ar também é cuidar das pessoas. Participe da construção de uma rede colaborativa de atenção ambiental.'
} as const;
