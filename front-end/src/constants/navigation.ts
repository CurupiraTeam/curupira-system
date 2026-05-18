import { History, Home, Map, Settings } from 'lucide-react';

export const navigationItems = [
  { label: 'HOME', path: '/dashboard', icon: Home },
  { label: 'MAPA', path: '/mapa', icon: Map },
  { label: 'HISTÓRICO', path: '/historico', icon: History },
  { label: 'OPÇÕES', path: '/opcoes', icon: Settings }
];

export const publicRoutePaths = {
  login: '/login',
  register: '/cadastro'
} as const;
