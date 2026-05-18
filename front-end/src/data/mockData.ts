import type { AirMetric, HistoricalPoint, IncidentReport } from '../types';

export const airMetrics: AirMetric[] = [
  { label: 'Material particulado PM2.5', value: 37, unit: 'µg/m³', safeLimit: 25 },
  { label: 'Material particulado PM10', value: 68, unit: 'µg/m³', safeLimit: 50 },
  { label: 'Monóxido de carbono', value: 5, unit: 'ppm', safeLimit: 9 },
  { label: 'Dióxido de nitrogênio', value: 42, unit: 'ppb', safeLimit: 53 }
];

export const incidents: IncidentReport[] = [
  {
    id: '1',
    city: 'Manaus',
    neighborhood: 'Centro',
    type: 'Fumaça',
    status: 'Ruim',
    source: 'Usuário',
    intensity: 78,
    createdAt: 'Hoje, 08:12',
    description: 'Fumaça densa percebida próximo à região central durante a manhã.',
    lat: -3.1019,
    lng: -60.025
  },
  {
    id: '2',
    city: 'Manaus',
    neighborhood: 'Adrianópolis',
    type: 'Cheiro forte',
    status: 'Moderado',
    source: 'Usuário',
    intensity: 54,
    createdAt: 'Hoje, 09:40',
    description: 'Relatos de odor de queimada e irritação leve nos olhos.',
    lat: -3.089,
    lng: -60.0006
  },
  {
    id: '3',
    city: 'Manaus',
    neighborhood: 'Distrito Industrial',
    type: 'Poeira',
    status: 'Moderado',
    source: 'Estação oficial',
    intensity: 61,
    createdAt: 'Hoje, 10:05',
    description: 'Elevação no índice de partículas em suspensão detectada por estação oficial.',
    lat: -3.1324,
    lng: -59.9752
  },
  {
    id: '4',
    city: 'Careiro',
    neighborhood: 'BR-319',
    type: 'Queimada',
    status: 'Crítico',
    source: 'INPE',
    intensity: 94,
    createdAt: 'Hoje, 10:31',
    description: 'Alerta oficial de foco de calor em área próxima à rodovia.',
    lat: -3.768,
    lng: -60.369
  }
];

export const historicalData: HistoricalPoint[] = [
  { date: 'Seg', iqa: 41, reports: 12, officialAlerts: 3 },
  { date: 'Ter', iqa: 52, reports: 18, officialAlerts: 4 },
  { date: 'Qua', iqa: 63, reports: 27, officialAlerts: 7 },
  { date: 'Qui', iqa: 78, reports: 45, officialAlerts: 9 },
  { date: 'Sex', iqa: 67, reports: 34, officialAlerts: 6 },
  { date: 'Sáb', iqa: 59, reports: 24, officialAlerts: 5 },
  { date: 'Dom', iqa: 72, reports: 39, officialAlerts: 8 }
];

export const feedbackOptions = ['Ar limpo', 'Fumaça visível', 'Cheiro de queimado', 'Ar seco', 'Dificuldade para respirar'];
