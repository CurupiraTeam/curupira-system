import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon } from 'lucide-react';
import { ApiStatusPanel } from '../../components/feedback/ApiStatusPanel';
import { PreferenceToggleCard } from '../../components/ui/PreferenceToggleCard';
import { Button } from '../../components/ui/FormControls';
import { userPreferenceItems } from '../../constants/userPreferences';
import { useAuth } from '../../hooks/useAuth';
import { useRealtimeArduinoData } from '../../hooks/useRealtimeArduinoData';

export function OptionsPage() {
  const initialPreferences = useMemo(
    () => Object.fromEntries(userPreferenceItems.map((item) => [item.title, item.defaultActive])) as Record<string, boolean>,
    []
  );
  const [active, setActive] = useState(initialPreferences);
  const { isAuthenticated, logout } = useAuth();
  const realtime = useRealtimeArduinoData();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <section className="px-4 py-8 pb-24 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Opções</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Preferências e status do sistema</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Ajustes locais, conexão em tempo real e disponibilidade da API sem adicionar fluxos de perfil fora do escopo aprovado.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid content-start gap-4">
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-glow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <Moon size={26} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-black">Central de preferências</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Preferências atuais são locais/simuladas para manter o front-end pronto sem prometer persistência de perfil ainda inexistente.
              </p>
              <div className="mt-6">
                <Button type="button" onClick={handleLogout} className="w-full bg-white text-slate-950 hover:bg-emerald-100" disabled={!isAuthenticated}>
                  <LogOut size={18} aria-hidden="true" /> {isAuthenticated ? 'Sair da conta' : 'Nenhuma sessão ativa'}
                </Button>
              </div>
            </div>
            <ApiStatusPanel realtimeState={realtime.connectionState} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {userPreferenceItems.map(({ icon, title, text }) => (
              <PreferenceToggleCard
                key={title}
                icon={icon}
                title={title}
                text={text}
                active={Boolean(active[title])}
                onToggle={() => setActive((current) => ({ ...current, [title]: !current[title] }))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
