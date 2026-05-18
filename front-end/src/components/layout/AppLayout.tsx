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
    <div className="min-h-screen bg-slate-50 bg-forest-radial">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <NavLink to="/dashboard" className="flex items-center gap-3" aria-label="Ir para a Home do Curupira">
            <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="rounded-2xl bg-emerald-700 p-2 text-white shadow-lg">
              <Leaf size={24} aria-hidden="true" />
            </motion.div>
            <div>
              <strong className="block text-lg font-black leading-none text-slate-950">Curupira</strong>
              <span className="hidden text-xs font-semibold text-emerald-700 sm:block">Monitoramento Inteligente do Ar</span>
            </div>
          </NavLink>

          <div className="hidden items-center gap-2 rounded-full bg-slate-100 p-1 md:flex">
            {navigationItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `rounded-full px-5 py-2 text-sm font-black transition ${
                    isActive ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:text-slate-950'
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
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
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

      <main>
        <Outlet key={location.pathname} />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-slate-500'
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
