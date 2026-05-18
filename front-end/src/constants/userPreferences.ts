import { Bell, DatabaseZap, Eye, Lock, MapPinned, Smartphone } from 'lucide-react';

export const userPreferenceItems = [
  { icon: Bell, title: 'Alertas em tempo real', text: 'Receba aviso quando a sua região entrar em estado ruim ou crítico.', defaultActive: true },
  { icon: MapPinned, title: 'Localização automática', text: 'Usar GPS ou IP para buscar dados ambientais da região atual.', defaultActive: true },
  { icon: DatabaseZap, title: 'Cruzar fontes oficiais', text: 'Combinar relatos com fontes oficiais quando estiverem disponíveis.', defaultActive: true },
  { icon: Lock, title: 'Relatos anônimos', text: 'Enviar feedbacks sem exibir dados pessoais publicamente.', defaultActive: true },
  { icon: Eye, title: 'Modo alto contraste', text: 'Melhorar leitura dos status por cor e contraste.', defaultActive: false },
  { icon: Smartphone, title: 'Modo economia de dados', text: 'Reduzir animações pesadas e atualizações em segundo plano.', defaultActive: false }
];
