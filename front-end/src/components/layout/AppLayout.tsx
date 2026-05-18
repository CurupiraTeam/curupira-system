import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LogOut } from 'lucide-react';
import { navigationItems } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/10 to-teal-50/15 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Delicate Dot Grid Texture for Detail and Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none fixed" />

      {/* Glowing Ambient Pastel Orbs for Organic Warmth */}
      <div className="absolute top-10 left-10 w-[35rem] h-[35rem] rounded-full bg-emerald-100/45 blur-[120px] pointer-events-none fixed" />
      <div className="absolute bottom-20 right-10 w-[35rem] h-[35rem] rounded-full bg-teal-100/35 blur-[120px] pointer-events-none fixed" />

      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/75 backdrop-blur-md relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-6">
          <NavLink to="/dashboard" className="flex items-center gap-3" aria-label="Ir para a Home do Curupira">
            <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-2 text-white shadow-lg shadow-emerald-600/20">
              <Leaf size={24} aria-hidden="true" />
            </motion.div>
            <div>
              <strong className="block text-lg font-black leading-none text-slate-950 tracking-tight">Curupira</strong>
              <span className="hidden text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:block mt-1">Monitoramento Inteligente</span>
            </div>
          </NavLink>

          <div className="hidden items-center gap-1.5 rounded-full bg-slate-200/50 border border-slate-300/30 p-1 md:flex">
            {navigationItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `rounded-full px-5 py-2 text-sm font-black transition-all duration-300 ${
                    isActive ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/15' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-900"
              >
                <LogOut size={16} aria-hidden="true" /> Sair
              </button>
            ) : (
              <NavLink to="/login" className="rounded-full px-5 py-2 text-sm font-black text-emerald-700 transition hover:bg-white">
                Entrar
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 pb-24 md:pb-6 relative">
        <Outlet key={location.pathname} />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/50 bg-white/90 px-3 py-2 shadow-2xl backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition-all ${
                  isActive ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/15' : 'text-slate-500'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
